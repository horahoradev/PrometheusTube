package models

import (
	"context"
	sql2 "database/sql"
	"encoding/json"
	"fmt"
	"io"
	"strings"

	serror "errors"

	videoproto "github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/video_service/protocol"
	"github.com/aquasecurity/esquery"
	_ "github.com/doug-martin/goqu/v9/dialect/postgres"
	"github.com/elastic/go-elasticsearch/v7"
	"github.com/horahoradev/horahora/user_service/errors"
	_ "github.com/horahoradev/horahora/user_service/protocol"
	proto "github.com/horahoradev/horahora/user_service/protocol"
	userproto "github.com/horahoradev/horahora/user_service/protocol"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc/status"
)

const (
	maxRating         = 10.00
	NumResultsPerPage = 50
	cdnURL            = "images.horahora.org"
)

type VideoModel struct {
	db *sqlx.DB
	// TODO: do we really need a grpc client here? bad cohesion ;(
	grpcClient        proto.UserServiceClient
	ApprovalThreshold int
	r                 Recommender
	esClient          *elasticsearch.Client
}

func NewVideoModel(db *sqlx.DB, client proto.UserServiceClient, approvalThreshold int) (*VideoModel, error) {
	c, err := elasticsearch.NewClient(elasticsearch.Config{
		Addresses: []string{"http://elasticsearch:9200"},
	})
	if err != nil {
		return nil, err
	}

	v := &VideoModel{db: db,
		grpcClient: client,
		esClient:   c,
	}

	rec := NewBayesianTagSum(db, v)
	v.r = &rec
	return v, nil
}

// check if user has been created
// if it hasn't, then create it
// list user as parent of this video
// FIXME this signature is too long lol
// If domesticAuthorID is 0, will interpret as foreign video from foreign user
func (v *VideoModel) SaveForeignVideo(ctx context.Context, title, description string, foreignAuthorUsername string, foreignAuthorID string,
	originalSite string, originalVideoLink, originalVideoID, newURI string, tags []string, domesticAuthorID int64, videoDuration float64, category string) (int64, error) {
	tx, err := v.db.BeginTx(ctx, nil)
	if err != nil {
		return 0, err
	}

	if domesticAuthorID == 0 && (foreignAuthorID == "" || foreignAuthorUsername == "") {
		return 0, serror.New("foreign author info cannot be blank")
	}

	if domesticAuthorID == 0 && (originalVideoLink == "" || originalVideoID == "") {
		return 0, serror.New("original video info cannot be blank")
	}

	req := proto.GetForeignUserRequest{
		OriginalWebsite: originalSite,
		ForeignUserID:   foreignAuthorID,
	}

	horahoraUID := domesticAuthorID

	if horahoraUID == 0 {
		resp, err := v.grpcClient.GetUserForForeignUID(ctx, &req)
		grpcErr, ok := status.FromError(err)
		if !ok {
			return 0, fmt.Errorf("could not parse gRPC err")
		}
		switch {
		case grpcErr.Message() == errors.UserDoesNotExistMessage:
			// Create the user
			log.Infof("User %s does not exist for video %s, creating...", foreignAuthorUsername, originalVideoID)

			regReq := proto.RegisterRequest{
				Email:          "fake@user.com", // NO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				Username:       foreignAuthorUsername,
				Password:       "",
				ForeignUser:    true,
				ForeignUserID:  foreignAuthorID,
				ForeignWebsite: originalSite,
			}
			regResp, err := v.grpcClient.Register(ctx, &regReq)
			if err != nil {
				return 0, err
			}

			validateReq := proto.ValidateJWTRequest{
				Jwt: regResp.Jwt,
			}

			// The validation is superfluous, but we need the claims
			// FIXME: can probably optimize
			validateResp, err := v.grpcClient.ValidateJWT(ctx, &validateReq)
			if err != nil {
				return 0, err
			}

			if !validateResp.IsValid {
				return 0, fmt.Errorf("jwt invalid (this should never happen!)")
			}

			horahoraUID = validateResp.Uid

		case err != nil:
			return 0, err

		case err == nil:
			horahoraUID = resp.NewUID
		}
	}

	sql := "INSERT INTO videos (title, description, userID, originalSite, " +
		"originalLink, newLink, originalID, upload_date, video_duration, category) " +
		"VALUES ($1, $2, $3, $4, $5, $6, $7, Now(), $8, $9) " +
		"returning id"

	// By this point the user should exist
	// Username is unique, so will fail if user already exists
	// FIXME: there might be some issues with error handling here. Should test to make sure scan returns ErrNoRows if insertion fail.
	// maybe switch to: https://github.com/jmoiron/sqlx/issues/154#issuecomment-148216948
	var videoID int64
	res := tx.QueryRow(sql, title, description, horahoraUID, originalSite, originalVideoLink, newURI, originalVideoID, videoDuration, category)

	err = res.Scan(&videoID)
	if err != nil {
		tx.Rollback()
		return 0, err
	}

	tagSQL := "INSERT INTO tags (video_id, tag) VALUES ($1, $2)"
	for _, tag := range tags {
		_, err = tx.Exec(tagSQL, videoID, tag)
		if err != nil {
			tx.Rollback()
			return 0, err
		}
	}

	err = tx.Commit()
	if err != nil {
		// What to do here? Rollback?
		return 0, err
	}

	return videoID, nil
}

func (v *VideoModel) ForeignVideoExists(foreignVideoID, website string) (bool, error) {
	sql := "SELECT id FROM videos WHERE originalSite=$1 AND originalID=$2"
	var videoID int64
	res := v.db.QueryRow(sql, website, foreignVideoID)
	err := res.Scan(&videoID)
	switch {
	case err == sql2.ErrNoRows:
		return false, nil
	case err != nil:
		return false, err
	default: // err == nil
		return true, nil
	}
}

func (v *VideoModel) IncrementViewsForVideo(videoID int64) error {
	sql := "UPDATE videos SET views = views + 1 WHERE id = $1"
	_, err := v.db.Exec(sql, videoID)
	if err != nil {
		return err
	}

	return nil
}

func (v *VideoModel) AddRatingToVideoID(ratingUID, videoID int64, ratingValue float64) error {
	sql := "INSERT INTO ratings (user_id, video_id, thumbs) VALUES ($1, $2, $3)" +
		"ON CONFLICT (user_id, video_id) DO update SET thumbs = $4"
	_, err := v.db.Exec(sql, ratingUID, videoID, ratingValue, ratingValue)
	if err != nil {
		return err
	}

	err = v.r.RemoveRecommendedVideoForUser(ratingUID, videoID)
	if err != nil {
		log.Errorf("Failed to remove recommended video for user %d. Err: %s", ratingUID, err)
	}

	rating, err := v.GetAverageRatingForVideoID(videoID)
	if err != nil {
		return err
	}

	_, err = v.db.Exec("UPDATE videos SET rating = $1 WHERE id = $2", rating, videoID)
	if err != nil {
		return err
	}

	return nil
}

func (v *VideoModel) GetCategories() (*videoproto.CategoryList, error) {
	sql := "SELECT category, count(*) from videos GROUP BY category"
	var categories []*videoproto.Category
	rows, err := v.db.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var cat videoproto.Category
		err = rows.Scan(&cat.Name, &cat.Cardinality)
		if err != nil {
			return nil, err
		}
		categories = append(categories, &cat)
	}

	return &videoproto.CategoryList{Categories: categories}, nil
}

type ESVideoResp struct {
	Took     int  `json:"took"`
	TimedOut bool `json:"timed_out"`
	Shards   struct {
		Total      int `json:"total"`
		Successful int `json:"successful"`
		Skipped    int `json:"skipped"`
		Failed     int `json:"failed"`
	} `json:"_shards"`
	Hits struct {
		Total struct {
			Value    int    `json:"value"`
			Relation string `json:"relation"`
		} `json:"total"`
		MaxScore any `json:"max_score"`
		Hits     []struct {
			Index  string `json:"_index"`
			Type   string `json:"_type"`
			ID     string `json:"_id"`
			Score  any    `json:"_score"`
			Source struct {
				Videoid       int      `json:"videoid"`
				Title         string   `json:"title"`
				Tags          []string `json:"tags"`
				CommentCount  int      `json:"comment_count"`
				Category      string   `json:"category"`
				FavoriteArr   []any    `json:"favorite_arr"`
				UploadDate    string   `json:"upload_date"`
				Userid        int      `json:"userid"`
				Newlink       string   `json:"newlink"`
				VideoDuration float64  `json:"video_duration"`
				Views         int      `json:"views"`
				Rating        int      `json:"rating"`
				IsDeleted     bool     `json:"is_deleted"`
				Transcoded    bool     `json:"transcoded"`
				TooBig        bool     `json:"too_big"`
				IsApproved    bool     `json:"is_approved"`
				ZdbCtid       int64    `json:"zdb_ctid"`
				ZdbCmin       int      `json:"zdb_cmin"`
				ZdbCmax       int      `json:"zdb_cmax"`
				ZdbXmin       int      `json:"zdb_xmin"`
			} `json:"_source"`
			// Sort []string `json:"sort"`
		} `json:"hits"`
	} `json:"hits"`
	Aggregations struct {
		Cardinalities struct {
			DocCountErrorUpperBound int `json:"doc_count_error_upper_bound"`
			SumOtherDocCount        int `json:"sum_other_doc_count"`
			Buckets                 []struct {
				Key      string `json:"key"`
				DocCount int    `json:"doc_count"`
			} `json:"buckets"`
		} `json:"cardinalities"`
	} `json:"aggregations"`
}

// For now, this only supports either fromUserID or withTag. Can support both in future, need to switch to
// goqu and write better tests
func (v *VideoModel) GetVideoList(direction videoproto.SortDirection, pageNum int64, fromUserID int64, searchVal string, showUnapproved, unapprovedOnly bool,
	orderCategory videoproto.OrderCategory, category string, followFeed bool, following []int64) ([]*videoproto.Video, int, *videoproto.CategoryList, error) {
	sql, err := v.generateVideoListSQL(direction, pageNum, fromUserID, searchVal, showUnapproved, unapprovedOnly, orderCategory, category, followFeed, following)
	if err != nil {
		return nil, 0, nil, err
	}

	var st ESVideoResp
	err = json.Unmarshal([]byte(sql), &st)
	if err != nil {
		return nil, 0, nil, err
	}

	var results []*videoproto.Video
	for _, video := range st.Hits.Hits {
		vid := videoproto.Video{
			VideoID:       int64(video.Source.Videoid),
			VideoTitle:    video.Source.Title,
			AuthorID:      int64(video.Source.Userid),
			ThumbnailLoc:  strings.Replace(video.Source.Newlink, ".mpd", ".thumb", 1),
			Views:         uint64(video.Source.Views),
			VideoDuration: float32(video.Source.VideoDuration),
			Rating:        int64(video.Source.Rating),
		}

		resp, err := v.getUserInfo(int64(video.Source.Userid))
		if err != nil {
			return nil, 0, nil, err
		}

		vid.AuthorName = resp.Username
		results = append(results, &vid)
	}

	var cl videoproto.CategoryList
	for _, cat := range st.Aggregations.Cardinalities.Buckets {
		cl.Categories = append(cl.Categories, &videoproto.Category{
			Name:        cat.Key,
			Cardinality: uint64(cat.DocCount),
		})
	}

	return results, st.Hits.Total.Value, &cl, nil
}

func (v *VideoModel) generateVideoListSQL(direction videoproto.SortDirection, pageNum, fromUserID int64, searchVal string, showUnapproved, unapprovedOnly bool, orderCategory videoproto.OrderCategory, category string, followFeed bool, following []int64) (string, error) {
	minResultNum := (pageNum - 1) * NumResultsPerPage
	res := esquery.Search().Size(NumResultsPerPage).From(uint64(minResultNum))

	var queries []esquery.Mappable
	var searchQueries []esquery.Mappable

	switch orderCategory {
	case videoproto.OrderCategory_upload_date:
		switch direction {
		case videoproto.SortDirection_asc:
			res = res.Sort("upload_date", esquery.OrderAsc)
		case videoproto.SortDirection_desc:
			res = res.Sort("upload_date", esquery.OrderDesc)
		}

	case videoproto.OrderCategory_views:
		switch direction {
		case videoproto.SortDirection_asc:
			res = res.Sort("views", esquery.OrderAsc)
		case videoproto.SortDirection_desc:
			res = res.Sort("views", esquery.OrderDesc)
		}

	case videoproto.OrderCategory_rating:
		switch direction {
		case videoproto.SortDirection_asc:
			res = res.Sort("rating", esquery.OrderAsc)
		case videoproto.SortDirection_desc:
			res = res.Sort("rating", esquery.OrderDesc)
		}

		// case videoproto.OrderCategory_my_ratings:
		// 	ds = ds.LeftJoin(
		// 		goqu.T("ratings"),
		// 		goqu.On(goqu.Ex{"videos.id": goqu.I("ratings.video_id")})).
		// 		Where(goqu.I("user_id").Eq(fromUserID))
		// 	switch direction {
		// 	case videoproto.SortDirection_asc:
		// 		ds = ds.Order(goqu.I("ratings.rating").Asc())
		// 	case videoproto.SortDirection_desc:
		// 		ds = ds.Order(goqu.I("ratings.rating").Desc())
		// 	}
	}

	if followFeed {
		var q []esquery.Mappable
		for _, follow := range following {
			q = append(q, esquery.Term("userid", follow))
		}
		queries = append(queries, esquery.Bool().Should(q...).MinimumShouldMatch(1))
	}

	if category != "" {
		queries = append(queries, esquery.Term("category", category))
	}

	if fromUserID != 0 {
		queries = append(queries, esquery.Term("userid", fromUserID))
	}

	if searchVal != "" {
		// TODO: negative search terms
		queries = append(queries,
			esquery.MultiMatch(searchVal).Type(esquery.MatchTypeBoolPrefix).Fields("title", "description", "tags"))
	}

	if !showUnapproved {
		// only show approved
		queries = append(queries,
			esquery.Term("is_approved", true))
	} else if unapprovedOnly {
		queries = append(queries,
			esquery.Term("is_approved", false))
	}

	// Only show transcoded videos
	queries = append(queries,
		esquery.Term("transcoded", true))

	// Do not show deleted videos
	queries = append(queries,
		esquery.Term("is_deleted", false))

	// pl, _ := res.Query(esquery.Bool().Must(queries...).Should(searchQueries...)).MarshalJSON()
	// log.Errorf("pl: %v", string(pl))

	resp, err := res.Query(esquery.Bool().Must(queries...).Should(searchQueries...)).Aggs(esquery.TermsAgg("cardinalities", "category")).Run(v.esClient, v.esClient.Search.WithContext(context.TODO()))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	payload, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(payload), err
}

func (v *VideoModel) RefreshMaterializedView() error {
	sql := "REFRESH MATERIALIZED VIEW videos_denormalized"
	_, err := v.db.Exec(sql)
	if err != nil {
		return err
	}

	return nil
}

// TODO: might want to switch to some domain-specific information retrieval language in the future
// One of the log query languages, like Lucene, could work
func extractSearchTerms(search string) (includeTerms, excludeTerms []string) {
	var exclude, include []string
	spl := strings.Split(search, " ")
	for _, term := range spl {
		switch {
		case strings.HasPrefix(term, "-"):
			exclude = append(exclude, term[1:])
		default:
			include = append(include, term)
		}
	}
	return include, exclude
}

type basicVideoInfo struct {
	authorName string
	authorID   int64
	rating     int
}

// Information that isn't super straightforward to query for
func (v *VideoModel) GetVideoInfo(videoID string) (*videoproto.VideoMetadata, error) {
	sql := "SELECT id, title, description, upload_date, userID, newLink, views, video_duration FROM videos WHERE id=$1 AND is_deleted=false"
	var video videoproto.VideoMetadata
	var authorID, views int64

	row := v.db.QueryRow(sql, videoID)

	err := row.Scan(&video.VideoID, &video.VideoTitle, &video.Description, &video.UploadDate, &authorID, &video.VideoLoc, &views, &video.VideoDuration)
	if err != nil {
		return nil, err
	}

	basicInfo, err := v.getBasicVideoInfo(authorID, video.VideoID)
	if err != nil {
		return nil, err
	}

	video.Rating = int64(basicInfo.rating)
	video.AuthorName = basicInfo.authorName
	video.Views = uint64(views)
	video.AuthorID = authorID
	video.Thumbnail = strings.Replace(video.VideoLoc, ".mpd", ".thumb", 1)

	tags, err := v.getVideoTags(videoID)
	if err != nil {
		return nil, err
	}

	video.Tags = tags

	return &video, nil
}

type Tag struct {
	Tag string `db:"tag"`
}

func (v *VideoModel) getVideoTags(videoID string) ([]string, error) {
	sql := "SELECT tag from tags WHERE video_id = $1"
	var tags []Tag

	if err := v.db.Select(&tags, sql, videoID); err != nil {
		log.Errorf("Failed to retrieve video tags. Err: %s", err)
		return nil, err
	}

	var ret []string
	// FIXME
	for _, val := range tags {
		ret = append(ret, val.Tag)
	}

	return ret, nil
}

func (v *VideoModel) getUserInfo(authorID int64) (*userproto.UserResponse, error) {
	// Given user id, look up author name
	userReq := proto.GetUserFromIDRequest{
		UserID: authorID,
	}

	userResp, err := v.grpcClient.GetUserFromID(context.TODO(), &userReq)
	if err != nil {
		// maybe we should skip if we can't look them up?
		return nil, err
	}

	return userResp, nil
}

func (v *VideoModel) getBasicVideoInfo(authorID int64, videoID int64) (*basicVideoInfo, error) {
	var videoInfo basicVideoInfo

	var err error

	resp, err := v.getUserInfo(authorID)
	if err != nil {
		return nil, err
	}

	videoInfo.authorName = resp.Username
	videoInfo.authorID = authorID

	// Look up ratings from redis
	videoInfo.rating, err = v.GetAverageRatingForVideoID(videoID)
	switch {
	case err != nil && err.Error() == "redis: nil":
		break
	case err != nil:
		return nil, err
	}

	return &videoInfo, nil
}

func (v *VideoModel) GetAverageRatingForVideoID(videoID int64) (int, error) {
	var rating int
	sql := "SELECT sum(thumbs) FROM ratings WHERE video_id = $1"
	res := v.db.QueryRow(sql, videoID)
	if err := res.Scan(&rating); err != nil {
		// LMAO FIXME
		return 0, nil
	}

	return rating, nil
}

func (v *VideoModel) MarkVideoApproved(videoID string) error {
	sql := "UPDATE videos SET is_approved = TRUE WHERE id = $1"
	_, err := v.db.Exec(sql, videoID)
	if err != nil {
		return err
	}

	return nil
}

// TODO: refactor into separate models by concern
// e.g. approvalsmodel, viewmodel, etc

// Individual trusted user approves of the video
func (v *VideoModel) ApproveVideo(userID, videoID int) error {
	sql := "INSERT INTO approvals (user_id, video_id) VALUES ($1, $2)"
	_, err := v.db.Exec(sql, userID, videoID)
	if err != nil {
		return err
	}

	if err = v.MarkApprovals(); err != nil {
		return err
	}

	return nil
}

type Approval struct {
	VideoID string `db:"video_id"`
}

func (v *VideoModel) MarkApprovals() error {
	var approvals []Approval
	sql := "SELECT video_id FROM approvals GROUP BY video_id HAVING count(*) >= 1"

	if err := v.db.Select(&approvals, sql); err != nil {
		log.Errorf("Failed to retrieve video approvals. Err: %s", err)
		return err
	}

	for _, approval := range approvals {
		err := v.MarkVideoApproved(approval.VideoID)
		if err != nil {
			// Log and move on
			log.Errorf("Could not mark video %s as approved. Err: %s", approval.VideoID, err)
		}
	}

	return nil
}

func (v *VideoModel) DeleteComment(commentID, userID int64) error {
	sql := "DELETE from comments WHERE id = $1 AND user_id = $2"
	_, err := v.db.Exec(sql, commentID, userID)
	return err
}

// Comment stuff
func (v *VideoModel) MakeComment(userID, videoID, parentID int64, content string) error {
	switch parentID {
	case 0:
		sql := "INSERT INTO comments (user_id, video_id, comment, creation_date)" +
			" VALUES ($1, $2, $3, Now())"
		_, err := v.db.Exec(sql, userID, videoID, content)
		if err != nil {
			return err
		}

	default:
		sql := "INSERT INTO comments (user_id, video_id, parent_comment, comment, creation_date)" +
			" VALUES ($1, $2, $3, $4, Now())"
		_, err := v.db.Exec(sql, userID, videoID, parentID, content)
		if err != nil {
			return err
		}
	}

	return nil
}

type UnencodedVideo struct {
	ID      uint32 `db:"id"`
	NewLink string `db:"newlink"`
}

func (v UnencodedVideo) GetMPDUUID() string {
	spl := strings.Split(v.NewLink, "/")
	r := spl[len(spl)-1]
	return r[:len(r)-4]
}

func (v *VideoModel) GetUnencodedVideos() ([]UnencodedVideo, error) {
	// Newest videos first
	sql := "SELECT id, newLink FROM videos WHERE transcoded = false AND too_big = false ORDER BY upload_date desc LIMIT 100"
	var videos []UnencodedVideo
	err := v.db.Select(&videos, sql)
	if err != nil {
		return nil, err
	}

	return videos, nil
}

func (v *VideoModel) MarkVideoAsEncoded(uv UnencodedVideo) error {
	sql := "UPDATE videos SET transcoded = true WHERE id = $1"
	_, err := v.db.Exec(sql, uv.ID)
	if err != nil {
		return err
	}

	return nil
}

func (v *VideoModel) MarkVideoAsTooBig(uv UnencodedVideo) error {
	sql := "UPDATE videos SET too_big = true WHERE id = $1"
	_, err := v.db.Exec(sql, uv.ID)
	if err != nil {
		return err
	}

	return nil
}

func (v *VideoModel) MakeUpvote(userID, commentID int64, voteScore int) error {
	sql := "INSERT INTO comment_upvotes (user_id, comment_id, vote_score) VALUES ($1, $2, $3)" +
		"ON CONFLICT (user_id, comment_id) DO update SET vote_score = $4"
	_, err := v.db.Exec(sql, userID, commentID, voteScore, voteScore)
	if err != nil {
		return err
	}

	return nil
}

/*
   id SERIAL primary key,
   video_id int REFERENCES videos(id),
   timestamp varchar(255),
   message varchar(255),
   author_id int,
   type varchar(255),
   color varchar(255), -- lol
   creation_date timestamp,
   font_size varchar(255)
*/

func (v *VideoModel) MakeDanmaku(video_id int, timestamp, message string, authorID int, inpType, color, fontSize string) error {
	sql := "INSERT INTO danmaku (video_id, timestamp, message, author_id, type, color, creation_date, font_size) VALUES ($1, $2, $3, $4, $5, $6, now(), $7)"
	_, err := v.db.Exec(sql, video_id, timestamp, message, authorID, inpType, color, fontSize)
	if err != nil {
		return err
	}

	return nil
}

func (v *VideoModel) GetDanmaku(videoID int) (*videoproto.DanmakuList, error) {
	sql := "SELECT id, timestamp, message, author_id, type, color, font_size from danmaku WHERE video_id = $1 ORDER BY timestamp::float asc"
	var categories videoproto.DanmakuList
	categories.Comments = make([]*videoproto.Danmaku, 0)
	rows, err := v.db.Query(sql, videoID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var dn videoproto.Danmaku
		err = rows.Scan(&dn.Id, &dn.Timestamp, &dn.Message, &dn.AuthorId, &dn.Type, &dn.Color, &dn.FontSize)
		if err != nil {
			return nil, err
		}
		categories.Comments = append(categories.Comments, &dn)
	}

	return &categories, nil
}

func (v *VideoModel) GetVideoRecommendations(userID int64, videoID int64) (*videoproto.RecResp, error) {
	videoList, err := v.r.GetRecommendations(userID, videoID)
	if err != nil {
		log.Errorf("Could not get recommendations. Err: %s", err)
		return nil, err
	}

	return &videoproto.RecResp{Videos: videoList}, nil
}

func (v *VideoModel) DeleteVideo(videoID string) error {
	sql := "UPDATE videos SET is_deleted = true WHERE id = $1"
	_, err := v.db.Exec(sql, videoID)
	return err
}

func (v *VideoModel) GetComments(videoID, currUserID int64) ([]*videoproto.Comment, error) {
	var comments []*videoproto.Comment
	sql := "SELECT id, sum(COALESCE(vote_score, 0)) as upvote_score, comments.user_id," +
		" creation_date, comment, COALESCE(parent_comment, 0) " +
		"FROM comments LEFT JOIN comment_upvotes ON id = comment_id GROUP BY id,comment_upvotes.comment_id HAVING video_id = $1"
	rows, err := v.db.Query(sql, videoID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var comment videoproto.Comment

		err = rows.Scan(&comment.CommentId, &comment.VoteScore, &comment.AuthorId,
			&comment.CreationDate, &comment.Content, &comment.ParentId)
		if err != nil {
			log.Errorf("Failed to scan. Err: %s", err)
			continue
		}

		resp, err := v.getUserInfo(comment.AuthorId)
		if err != nil {
			log.Errorf("Failed to retrieve username for comment with author id %d. Err: %s",
				comment.AuthorId, err)
			continue
		}

		comment.AuthorUsername = resp.Username
		comment.AuthorProfileImageUrl = "/static/images/placeholder.png"

		var score int64
		sqlTwo := "SELECT vote_score FROM comment_upvotes WHERE user_id = $1 AND comment_id = $2"

		res := v.db.QueryRow(sqlTwo, currUserID, comment.CommentId)
		err = res.Scan(&score)
		log.Error(err)
		if score > 0 {
			comment.CurrentUserHasUpvoted = true
		} else if score < 0 {
			comment.CurrentUserHasDownvoted = true
		}

		comments = append(comments, &comment)
	}

	return comments, nil
}

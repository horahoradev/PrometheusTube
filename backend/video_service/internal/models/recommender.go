package models

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"sync"

	videoproto "github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/video_service/protocol"
	_ "github.com/doug-martin/goqu/v9/dialect/postgres"
	_ "github.com/horahoradev/horahora/user_service/protocol"
	"github.com/jmoiron/sqlx"
	"github.com/zhenghaoz/gorse/client"
)

// TODO: test suite for recommender implementations with precision and recall for sample dataset
type Recommender interface {
	GetRecommendations(userID int64, vid int64) ([]*videoproto.Video, error)
	RemoveRecommendedVideoForUser(userID, videoID int64) error
}

// Dumb recommender system, computes expected rating value for user from a video's tags
// and orders by sum
// No more train otomads??? (please)
type BayesianTagSum struct {
	db            *sqlx.DB
	storedResults map[int64][]*videoproto.VideoRec
	mut           sync.Mutex
	gorseClient   *client.GorseClient
	m             *VideoModel
}

func NewBayesianTagSum(db *sqlx.DB, m *VideoModel) BayesianTagSum {
	return BayesianTagSum{
		db:            db,
		storedResults: make(map[int64][]*videoproto.VideoRec),
		gorseClient:   client.NewGorseClient("http://gorse:8088", "api_key"),
		m:             m,
	}
}

type NeighborResults []struct {
	ID    string  `json:"Id"`
	Score float64 `json:"Score"`
}

func (b *BayesianTagSum) GetNeighbors(videoID int64, n int64) (*NeighborResults, error) {
	res, err := http.Get(fmt.Sprintf("http://gorse:8088/api/item/%d/neighbors?n=%d", videoID, n))
	if err != nil {
		return nil, err
	}

	payload, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	var ret NeighborResults

	err = json.Unmarshal(payload, &ret)
	return &ret, err
}

func (b *BayesianTagSum) GetRecommended(userID int64, n int64) ([]string, error) {
	res, err := http.Get(fmt.Sprintf("http://gorse:8088/api/recommend/%d?n=%d", userID, n))
	if err != nil {
		return nil, err
	}

	payload, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	var ret []string

	err = json.Unmarshal(payload, &ret)
	return ret, err
}

// TODO: remove read items for given user (even if anonymous)
func (b *BayesianTagSum) GetPopular(n int64) (*NeighborResults, error) {
	res, err := http.Get(fmt.Sprintf("http://gorse:8088/api/popular?n=%d", n))
	if err != nil {
		return nil, err
	}

	payload, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	var ret NeighborResults

	err = json.Unmarshal(payload, &ret)
	return &ret, err
}

func (b *BayesianTagSum) GetRecommendations(uid int64, vid int64) ([]*videoproto.Video, error) {
	var ret []*videoproto.Video
	switch uid {
	case 0: // TODO lmaooooo
		r, err := b.GetNeighbors(vid, 10)
		if err != nil {
			return nil, err
		}

		for _, v := range *r {
			i, err := strconv.ParseInt(v.ID, 10, 64)
			if err != nil {
				return nil, err
			}

			val, err := b.getVideoInfoForRecs(i)
			if err != nil {
				return nil, err
			}

			ret = append(ret, val)
		}

		remainingItems := 10 - len(*r)
		if remainingItems == 0 {
			return ret, nil
		}

		r, err = b.GetPopular(int64(remainingItems + 1))
		if err != nil {
			return nil, err
		}
		for _, v := range *r {
			i, err := strconv.ParseInt(v.ID, 10, 64)
			if err != nil {
				return nil, err
			}

			if i == vid {
				continue
			}

			val, err := b.getVideoInfoForRecs(i)
			if err != nil {
				return nil, err
			}

			ret = append(ret, val)
		}

	default:
		ids, err := b.GetRecommended(uid, 10)
		if err != nil {
			return nil, err
		}

		for _, id := range ids {
			i, err := strconv.ParseInt(id, 10, 64)
			if err != nil {
				return nil, err
			}

			val, err := b.getVideoInfoForRecs(i)
			if err != nil {
				return nil, err
			}

			ret = append(ret, val)
		}
	}

	// shuffle order
	for i := range ret {
		j := rand.Intn(i + 1)
		ret[i], ret[j] = ret[j], ret[i]
	}

	return ret, nil
}

func (b *BayesianTagSum) getVideoInfoForRecs(videoID int64) (*videoproto.Video, error) {
	sql := "SELECT title, newLink, views, upload_date, userID, video_duration from videos WHERE id = $1" // GOD NO!!! BATCH THIS QUERY!
	rows, err := b.db.Query(sql, videoID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var ret videoproto.Video
		err = rows.Scan(&ret.VideoTitle, &ret.ThumbnailLoc, &ret.Views, &ret.UploadDate, &ret.AuthorID, &ret.VideoDuration)
		if err != nil {
			return nil, err
		}
		// I should stop doing this...
		ret.ThumbnailLoc = strings.Replace(ret.ThumbnailLoc, ".mpd", ".thumb", 1)

		basicInfo, err := b.m.getBasicVideoInfo(ret.AuthorID, videoID)
		if err != nil {
			return nil, err
		}

		ret.AuthorName = basicInfo.authorName
		ret.Rating = int64(basicInfo.rating)

		ret.VideoID = videoID
		return &ret, nil
	}

	return nil, errors.New("no rows in rec for video")
}

func (b *BayesianTagSum) RemoveRecommendedVideoForUser(userID, videoID int64) error {
	b.mut.Lock()
	videos, ok := b.storedResults[userID]
	b.mut.Unlock()
	if !ok {
		return errors.New("No videos for given user")
	}

	for i, video := range videos {
		if video.VideoID == videoID {
			// I don't like the look of this. FIXME
			b.mut.Lock()
			b.storedResults[userID] = append(videos[:i], videos[i+1:]...)
			b.mut.Unlock()
			return nil
		}
	}

	return errors.New("Desired video could not be removed, was not found")
}

func (b *BayesianTagSum) getRecommendations(uid int64) ([]*videoproto.VideoRec, error) {
	// Videos which have been viewed and not rated are implicitly rated 0
	// left join from video scores returns some random videos by default
	sql := "WITH tag_ratings AS (select tag, coalesce(avg(ratings.rating), 0.00) AS tag_score from ratings INNER JOIN tags ON ratings.video_id = tags.video_id WHERE ratings.user_id = $1 GROUP BY tag), " +
		"video_scores AS (SELECT tags.video_id, coalesce(avg(tag_score), 0.00) AS video_score from  tags INNER JOIN tag_ratings ON tag_ratings.tag = tags.tag GROUP BY tags.video_id ORDER BY video_score DESC, tags.video_id LIMIT 50) " +
		"SELECT videos.id, title, newLink from video_scores INNER JOIN videos ON video_scores.video_id = videos.id WHERE videos.is_deleted IS false AND videos.is_approved IS true AND videos.transcoded IS true AND videos.id NOT IN (SELECT video_id FROM ratings WHERE ratings.user_id = $1) limit 10"
	rows, err := b.db.Query(sql, uid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ret []*videoproto.VideoRec
	for rows.Next() {
		vid := videoproto.VideoRec{}
		err = rows.Scan(&vid.VideoID, &vid.VideoTitle, &vid.ThumbnailLoc)
		if err != nil {
			return nil, err
		}

		// I should stop doing this...
		vid.ThumbnailLoc = strings.Replace(vid.ThumbnailLoc, ".mpd", ".thumb", 1)

		ret = append(ret, &vid)
	}

	return ret, nil
}

// TODO: copy pasta
func (b *BayesianTagSum) getFallbackRecs(uid int64) ([]*videoproto.VideoRec, error) {
	// Videos which have been viewed and not rated are implicitly rated 0
	// left join from video scores returns some random videos by default
	sql := "SELECT videos.id, title, newLink from videos WHERE videos.is_deleted IS false AND videos.is_approved IS true AND videos.transcoded IS true AND videos.id NOT IN (SELECT video_id FROM ratings WHERE ratings.user_id = $1) limit 10"
	rows, err := b.db.Query(sql, uid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ret []*videoproto.VideoRec
	for rows.Next() {
		vid := videoproto.VideoRec{}
		err = rows.Scan(&vid.VideoID, &vid.VideoTitle, &vid.ThumbnailLoc)
		if err != nil {
			return nil, err
		}

		// I should stop doing this...
		vid.ThumbnailLoc = strings.Replace(vid.ThumbnailLoc, ".mpd", ".thumb", 1)

		ret = append(ret, &vid)
	}

	return ret, nil
}

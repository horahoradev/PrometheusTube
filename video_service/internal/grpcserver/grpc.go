package grpcserver

import (
	"context"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/zhenghaoz/gorse/client"

	"github.com/google/uuid"
	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	"github.com/grpc-ecosystem/grpc-opentracing/go/otgrpc"
	"github.com/horahoradev/PrometheusTube/backend/video_service/storage"
	"github.com/jmoiron/sqlx"
	"github.com/opentracing/opentracing-go"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/horahoradev/PrometheusTube/backend/video_service/internal/dashutils"
	"github.com/horahoradev/PrometheusTube/backend/video_service/internal/models"

	grpc_prometheus "github.com/grpc-ecosystem/go-grpc-prometheus"
	proto "github.com/horahoradev/PrometheusTube/backend/video_service/protocol"
	userproto "github.com/horahoradev/horahora/user_service/protocol"

	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc"

	_ "github.com/aws/aws-sdk-go-v2/service/s3"
	_ "github.com/google/uuid"
)

const uploadDir = "/tmp/"

var _ proto.VideoServiceServer = (*GRPCServer)(nil)

type GRPCServer struct {
	VideoModel *models.VideoModel
	Local      bool
	OriginFQDN string
	Storage    storage.Storage
	RedisConn  *redis.Client
	proto.UnsafeVideoServiceServer
	MaxDailyUploadMB int
}

// TODO: API is getting bloated
func NewGRPCServer(bucketName string, db *sqlx.DB, port int, originFQDN string, local bool,
	client userproto.UserServiceClient, tracer opentracing.Tracer, storageBackend, apiID,
	apiKey string, approvalThreshold int, storageEndpoint string, MaxDLFileSize int64, redisConn *redis.Client, maxDailyUploadMB int) error {
	g, err := initGRPCServer(bucketName, db, client, local, originFQDN, storageBackend, apiID, apiKey, approvalThreshold, storageEndpoint, MaxDLFileSize, redisConn, maxDailyUploadMB)
	if err != nil {
		return err
	}

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	// TODO: context and return
	go g.transcodeAndUploadVideos(MaxDLFileSize)

	go g.refreshMaterializedView()

	grpcServer := grpc.NewServer(grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(
		otgrpc.OpenTracingServerInterceptor(tracer))))
	proto.RegisterVideoServiceServer(grpcServer, g)

	grpc_prometheus.Register(grpcServer)
	http.Handle("/metrics", promhttp.Handler())
	go http.ListenAndServe(":8080", nil)

	return grpcServer.Serve(lis)
}

func initGRPCServer(bucketName string, db *sqlx.DB, client userproto.UserServiceClient, local bool,
	originFQDN, storageBackend, apiID, apiKey string, approvalThreshold int, storageEndpoint string, MaxDLFileSize int64, redisConn *redis.Client, maxDailyUploadMB int) (*GRPCServer, error) {

	g := &GRPCServer{
		Local:            local,
		OriginFQDN:       originFQDN,
		RedisConn:        redisConn,
		MaxDailyUploadMB: maxDailyUploadMB,
	}

	var err error

	switch storageBackend {
	case "b2":
		g.Storage, err = storage.NewB2(apiID, apiKey, bucketName)
		if err != nil {
			return nil, err
		}
	case "s3":
		if storageEndpoint == "" {
			g.Storage, err = storage.NewS3(bucketName)
			if err != nil {
				return nil, err
			}
		} else {
			g.Storage, err = storage.NewS3Endpoint(bucketName, storageEndpoint, apiID, apiKey)
			if err != nil {
				return nil, err
			}
		}
	default:
		return nil, fmt.Errorf("Unknown storage backend %s", storageBackend)
	}

	g.VideoModel, err = models.NewVideoModel(db, client, approvalThreshold)
	if err != nil {
		return nil, err
	}

	return g, nil
}

func (g GRPCServer) GetFollowFeed(ctx context.Context, req *proto.FeedReq) (*proto.VideoList, error) {
	// TODO on pagination
	// TODO on unapproved
	// TODO on cardinality
	videos, _, _, err := g.VideoModel.GetVideoList(proto.SortDirection_desc, 1, 0, "", true, false, proto.OrderCategory_upload_date, "", true, req.FollowedUsers, req.ShowMature)
	return &proto.VideoList{
		Videos: videos,
	}, err
}

type VideoUpload struct {
	Meta         *proto.InputVideoChunk_Meta
	FileData     *os.File
	MetaFileData *os.File
}

var DailyUploadLimitError error = errors.New("the daily upload limit has been exceeded")

func (g GRPCServer) UploadVideo(inpStream proto.VideoService_UploadVideoServer) error {
	log.Info("Handling video upload")

	var video VideoUpload

	// UUID for tmp filename and all uploads provides probabilistic guarantee of uniqueness
	id, err := uuid.NewUUID()
	if err != nil {
		log.Error("Could not generate uuid. Err: %s", err)
		return err
	}

	tmpFile, err := os.Create(uploadDir + id.String())
	if err != nil {
		err = fmt.Errorf("could not create tmp file. Err: %s", err)
		log.Error(err)
		return err
	}

	// This is awkward but it could be worse
	metaTmp, err := os.Create(uploadDir + id.String() + ".json")
	if err != nil {
		err = fmt.Errorf("could not create meta tmp file. Err: %s", err)
		log.Error(err)
		return err
	}

	defer func() {
		tmpFile.Close()
		os.Remove(tmpFile.Name())

		metaTmp.Close()
		os.Remove(metaTmp.Name())
	}()

	video.FileData = tmpFile
	video.MetaFileData = metaTmp
loop:
	for {
		chunk, err := inpStream.Recv()
		switch {
		case err == io.EOF:
			break loop
		case err != nil:
			err = fmt.Errorf("could not recv. Err: %s", err)
			log.Error(err)
			return err
		}

		switch r := chunk.Payload.(type) {
		case *proto.InputVideoChunk_Content:
			if g.isOverDailyUploadLimit(len(r.Content.Data)) {
				return DailyUploadLimitError
			}

			_, err := video.FileData.Write(r.Content.Data)
			if err != nil {
				err = fmt.Errorf("could not write video data to file, err: %s", err)
				log.Error(err)
				return err
			}

		case *proto.InputVideoChunk_Rawmeta:
			if g.isOverDailyUploadLimit(len(r.Rawmeta.Data)) {
				return DailyUploadLimitError
			}

			// lol
			_, err := video.MetaFileData.Write(r.Rawmeta.Data)
			if err != nil {
				err = fmt.Errorf("could not write metadata data to file, err: %s", err)
				log.Error(err)
				return err
			}

		case *proto.InputVideoChunk_Meta:
			if video.Meta != nil {
				err = fmt.Errorf("duplicate metadata in stream")
				log.Error(err)
				return err
			}

			video.Meta = r
			log.Infof("Received metadata for video %s, category: %s", video.Meta.Meta.Title, video.Meta.Meta.Category)
		}
	}

	log.Infof("Handling video upload %s from website %s", video.Meta.Meta.OriginalID, video.Meta.Meta.OriginalSite)

	// Do some in-place edits for backwards compatibility...
	// FIXME
	switch {
	case strings.Contains(video.Meta.Meta.OriginalSite, "nicovideo"):
		video.Meta.Meta.OriginalSite = "0"
	case strings.Contains(video.Meta.Meta.OriginalSite, "bilibili"):
		video.Meta.Meta.OriginalSite = "1"
	case strings.Contains(video.Meta.Meta.OriginalSite, "youtube"):
		video.Meta.Meta.OriginalSite = "2"
	}

	err = ioutil.WriteFile(video.FileData.Name()+".thumb", video.Meta.Meta.Thumbnail, 0644)
	if err != nil {
		return LogAndRetErr("could not write thumbnail. Err: %s", err)
	}

	log.Infof("Finished receiving file data for %s, uploading to %v", video.Meta.Meta.Title, g.OriginFQDN)

	// If not local, upload the thumbnail and original video before returning
	if !g.Local {
		// FIXME did it again...
		log.Infof("Uploading thumbnail: %s", video.FileData.Name()+".thumb")
		err = g.Storage.Upload(video.FileData.Name()+".thumb", filepath.Base(video.FileData.Name()+".thumb"))
		if err != nil {
			return err
		}

		// Upload the raw metadata
		log.Infof("Uploading metadata: %s", video.MetaFileData.Name())
		err = g.Storage.Upload(video.MetaFileData.Name(), filepath.Base(video.MetaFileData.Name()))
		if err != nil {
			return err
		}

		// Upload the original video
		log.Infof("Uploading video: %s", video.FileData.Name())
		err = g.Storage.Upload(video.FileData.Name(), filepath.Base(video.FileData.Name()))
		if err != nil {
			return err
		}
	}

	f, err := g.getVideoDuration(video.FileData.Name())
	if err != nil {
		log.Errorf("Failed to get video duration, err: %v", err)
	}

	// TODO configurable
	videoLoc := fmt.Sprintf("%s/%s", "otomads", filepath.Base(video.FileData.Name()))
	u, err := url.Parse(fmt.Sprintf("%s/%s", g.OriginFQDN, filepath.Base(video.FileData.Name())))
	if err != nil {
		return err
	}
	// lol fixme
	u.Host = fmt.Sprintf("%v:%v", "host.docker.internal", "9000")

	log.Infof("Trying to reach origin file at %v", u.String())

	// We've uploaded the video... can we reach it?
	// If we can't reach it with a head request, don't commit it to the db
	res, err := http.Head(u.String())
	switch {
	case err != nil:
		log.Errorf("receied err trying to reach origin: %v", err)
		return err
	case res != nil && res.StatusCode >= 400:
		return fmt.Errorf("recieved bad status code %v for request to %v", res.StatusCode, videoLoc)
	}

	// This is MESSY
	// thumbnail and original video locations are inferred from the mpd location (which is dumb), so it's written even though
	// the video hasn't been transcoded/chunked and the mpd hasn't been uploaded yet
	// a better solution will be provided in the future... I will fix this... (I'm keeping it backwards compatible for now)
	// TODO: switch to struct for args
	// (FIXME)
	manifestLoc := videoLoc + ".mpd"

	videoID, err := g.VideoModel.SaveForeignVideo(context.TODO(), video.Meta.Meta.Title, video.Meta.Meta.Description,
		video.Meta.Meta.AuthorUsername, video.Meta.Meta.AuthorUID, video.Meta.Meta.OriginalSite,
		video.Meta.Meta.OriginalVideoLink, video.Meta.Meta.OriginalID, manifestLoc, video.Meta.Meta.Tags, video.Meta.Meta.DomesticAuthorID, f, video.Meta.Meta.Category)
	if err != nil {
		return LogAndRetErr("failed to save video to postgres. Err: %s", err)
	}

	gorse := client.NewGorseClient("http://gorse:8088", "api_key")
	_, err = gorse.InsertItem(context.TODO(), client.Item{
		ItemId:     fmt.Sprintf("%d", videoID),
		IsHidden:   true,
		Labels:     video.Meta.Meta.Tags,
		Categories: []string{video.Meta.Meta.Category},
		Timestamp:  time.Now().String(),
	})
	if err != nil {
		log.Errorf("failed to insert gorse item: %v", err)
	}

	uploadResp := proto.UploadResponse{
		VideoID: videoID,
	}

	log.Infof("Finished handling video %s", video.Meta.Meta.Title)
	return inpStream.SendAndClose(&uploadResp)
}

func (g GRPCServer) getVideoDuration(path string) (float64, error) {
	args := []string{
		"ffprobe",
		"-v",
		"error",
		"-show_entries",
		"format=duration",
		"-of",
		"default=noprint_wrappers=1:nokey=1",
		path,
	}
	cmd := exec.Command(args[0], args[1:]...)
	payload, err := cmd.Output()
	if err != nil {
		return 0.0, err
	}

	return strconv.ParseFloat(strings.TrimSuffix(string(payload), "\n"), 10)
}

func (g GRPCServer) isOverDailyUploadLimit(sizeBytes int) bool {
	sizeMB := sizeBytes / 1024 / 1024

	dateTS := time.Now().Format("01-02-2006")

	ret, err := g.RedisConn.IncrBy(context.Background(), dateTS, int64(sizeMB)).Result()
	if err != nil {
		log.Errorf("could not incr upload limit. Err: %v", err)
		return true
	}

	// log.Infof("current count: %v", ret)

	return ret > int64(g.MaxDailyUploadMB)
}

func LogAndRetErr(fmtStr string, err error) error {
	errWithMsg := fmt.Errorf(fmtStr, err)
	log.Error(errWithMsg)
	return errWithMsg
}

func (g GRPCServer) ForeignVideoExists(ctx context.Context, foreignVideoCheck *proto.ForeignVideoCheck) (*proto.VideoExistenceResponse, error) {
	switch {
	case strings.Contains(foreignVideoCheck.ForeignWebsite, "nicovideo"):
		foreignVideoCheck.ForeignWebsite = "0"
	case strings.Contains(foreignVideoCheck.ForeignWebsite, "bilibili"):
		foreignVideoCheck.ForeignWebsite = "1"
	case strings.Contains(foreignVideoCheck.ForeignWebsite, "youtube"):
		foreignVideoCheck.ForeignWebsite = "2"
	}

	exists, err := g.VideoModel.ForeignVideoExists(foreignVideoCheck.ForeignVideoID, foreignVideoCheck.ForeignWebsite)
	if err != nil {
		return nil, err
	}

	resp := proto.VideoExistenceResponse{Exists: exists}

	return &resp, nil

}

func (g GRPCServer) refreshMaterializedView() {
	for {
		if err := g.VideoModel.RefreshMaterializedView(); err != nil {
			log.Errorf("Refresh materialized view: err %v", err)
		}
		<-time.After(time.Second * 60)
	}
}

const NUM_TRANSCODING_WORKERS = 1

// TODO: graceful shutdown or something, lock video acquisition
func (g GRPCServer) transcodeAndUploadVideos(MaxDLFileSize int64) {
	gorse := client.NewGorseClient("http://gorse:8088", "api_key")

	for {
		<-time.After(time.Second * 10)
		videos, err := g.VideoModel.GetUnencodedVideos()
		if err != nil {
			log.Errorf("could not fetch unencoded videos. Err: %s", err)
			continue
		}

		if len(videos) == 0 {
			log.Infof("Failed to fetch unencoded videos, sleeping for 15 seconds")
			<-time.After(time.Second * 15)
			continue
		}

		for _, v := range videos {
			<-time.After(time.Second * 10)

			func(video models.UnencodedVideo) {
				// TODO: distributed lock goes here

				log.Infof("Transcoding/chunking video id %d uuid %s", video.ID, video.GetMPDUUID())

				vid, err := g.Storage.Fetch(video.GetMPDUUID())

				if err != nil {
					log.Errorf("could not fetch unencoded video id %d from backend. Err: %s", video.ID, err)
					return
				} else {
					defer func() {
						vid.Close()
						os.Remove(vid.Name())
					}()
				}

				if MaxDLFileSize != 0 {
					s, err := vid.Stat()
					if err != nil {
						log.Errorf("Could not stat video to encode. Err: %s", err)
						return
					}

					if s.Size() >= 1024*1024*MaxDLFileSize {
						err = g.VideoModel.MarkVideoAsTooBig(video)
						if err != nil {
							log.Errorf("failed to mark video as too big. Err: %s", err)
							return
						}

						log.Errorf("Video %d greater than 300mb, skipping and marking as too big", v.ID)
						return
					}
				}
				_, err = vid.Seek(0, 0)
				if err != nil {
					log.Errorf("Could not seek to 0 for video to encode. Err: %s", err)
					return
				}

				nullTranscoder := dashutils.H264Transcoder{}

				transcodeResults, err := nullTranscoder.TranscodeAndGenerateManifest(vid.Name(), g.Local)
				if err != nil {
					err := fmt.Errorf("failed to transcode and chunk. Err: %s", err)
					log.Error(err)
					return
				}

				err = g.UploadMPDSet(transcodeResults)
				if err != nil {
					log.Errorf("failed to upload mpd set. Err: %s", err)
					return
				}

				err = g.VideoModel.MarkVideoAsEncoded(video)
				if err != nil {
					log.Errorf("failed to mark video as encoded. Err: %s", err)
					return
				}

				f := false
				_, err = gorse.UpdateItem(context.TODO(), fmt.Sprintf("%d", video.ID), client.ItemPatch{
					IsHidden: &f,
				})
				if err != nil {
					log.Errorf("failed to update gorse item after transcoding: %v", err)
				}

				log.Infof("Video %d has been successfully encoded", video.ID)
			}(v)
		}
	}
}

// UploadMPDSet uploads the files to S3. Files may be overwritten (but they're versioned so they're safe).
// Need to ensure as a precondition that the video hasn't been uploaded before and the temp file ID hasn't been
// used.
func (g GRPCServer) UploadMPDSet(d *dashutils.DASHVideo) error {
	if d.ManifestPath == nil {
		return nil
	}

	// send manifest to origin
	err := g.Storage.Upload(*d.ManifestPath, filepath.Base(*d.ManifestPath))
	if err != nil {
		return err
	}

	// Send all of the chunked files
	for _, path := range d.QualityMap {
		err = g.Storage.Upload(path, filepath.Base(path))
		if err != nil {
			return err
		}

		err = os.Remove(path)
		if err != nil {
			log.Error(err)
		}

	}

	return nil
}

// Do we need this?
func (g GRPCServer) DownloadVideo(req *proto.VideoRequest, outputStream proto.VideoService_DownloadVideoServer) error {
	return nil
	// TODO
}

func (g GRPCServer) GetCategories(context.Context, *proto.Nothing) (*proto.CategoryList, error) {
	return g.VideoModel.GetCategories()
}

func (g GRPCServer) GetVideoList(ctx context.Context, queryConfig *proto.VideoQueryConfig) (*proto.VideoList, error) {
	switch queryConfig.OrderBy {
	case proto.OrderCategory_rating, proto.OrderCategory_views, proto.OrderCategory_upload_date, proto.OrderCategory_my_ratings:
		videos, n, categories, err := g.VideoModel.GetVideoList(queryConfig.Direction, queryConfig.PageNumber,
			queryConfig.FromUserID, queryConfig.SearchVal, queryConfig.ShowUnapproved, queryConfig.UnapprovedOnly, queryConfig.OrderBy, queryConfig.Category, false, nil, queryConfig.ShowMature)
		if err != nil {
			log.Errorf("Could not get video list. Err: %s", err)
			return nil, err
		}

		return &proto.VideoList{
			Videos:         videos,
			NumberOfVideos: int64(n),
			Categories:     categories,
		}, nil

	default:
		st := status.New(codes.InvalidArgument, "invalid order category")
		return nil, st.Err()
	}
}

func (g GRPCServer) RateVideo(ctx context.Context, rating *proto.VideoRating) (*proto.Nothing, error) {
	err := g.VideoModel.AddRatingToVideoID(rating.UserID, rating.VideoID, float64(rating.Rating))
	if err != nil {
		return nil, err
	}

	return &proto.Nothing{}, nil
}

func (g GRPCServer) ViewVideo(ctx context.Context, videoInp *proto.VideoViewing) (*proto.Nothing, error) {
	err := g.VideoModel.IncrementViewsForVideo(videoInp.VideoID)
	if err != nil {
		return nil, err
	}

	return &proto.Nothing{}, nil
}

func (g GRPCServer) GetVideo(ctx context.Context, req *proto.VideoRequest) (*proto.VideoMetadata, error) {
	videoMetadata, err := g.VideoModel.GetVideoInfo(req.VideoID)
	if err != nil {
		return nil, err
	}

	return videoMetadata, nil
}

func (g GRPCServer) ApproveVideo(ctx context.Context, req *proto.VideoApproval) (*proto.Nothing, error) {
	if err := g.VideoModel.ApproveVideo(int(req.UserID), int(req.VideoID), req.Mature); err != nil {
		return nil, err
	}

	return &proto.Nothing{}, nil
}

// TODO: note that this method only works for the basic method of encoding, and not for any form of transcoding
func (g GRPCServer) DeleteVideo(ctx context.Context, deleteReq *proto.VideoDeletionReq) (*proto.Nothing, error) {
	// Get the video info
	info, err := g.VideoModel.GetVideoInfo(deleteReq.VideoID)
	if err != nil {
		return nil, err
	}

	// Need to fix the mpd storage for this stuff LOL
	spl := strings.Split(info.VideoLoc, "/")
	r := spl[len(spl)-1]
	uuid := r[:len(r)-4]

	// Delete video from storage
	log.Errorf("Deleting video %s", uuid)
	err = g.Storage.Delete(uuid)
	if err != nil {
		return nil, err
	}

	// Delete thumb from storage
	log.Errorf("Deleting thumbnail %s", uuid+".thumb")
	err = g.Storage.Delete(uuid + ".thumb")
	if err != nil {
		return nil, err
	}

	// The rest of the files are ok, e.g. metadata and such

	// Delete from database
	return &proto.Nothing{}, g.VideoModel.DeleteVideo(deleteReq.VideoID)
}

func (g GRPCServer) MakeComment(ctx context.Context, commentReq *proto.VideoComment) (*proto.Nothing, error) {
	return &proto.Nothing{},
		g.VideoModel.MakeComment(commentReq.UserId, commentReq.VideoId,
			commentReq.ParentComment, commentReq.Comment)
}

func (g GRPCServer) DeleteComment(ctx context.Context, req *proto.CommentDeletionReq) (*proto.Nothing, error) {
	return &proto.Nothing{},
		g.VideoModel.DeleteComment(req.CommentID, req.UserID)
}

func (g GRPCServer) MakeCommentUpvote(ctx context.Context, upvoteReq *proto.CommentUpvote) (*proto.Nothing, error) {
	return &proto.Nothing{}, g.VideoModel.MakeUpvote(upvoteReq.UserId, upvoteReq.CommentId,
		int(upvoteReq.Score))
}

func (g GRPCServer) GetCommentsForVideo(ctx context.Context, commentListReq *proto.CommentRequest) (*proto.CommentListResponse, error) {
	list, err := g.VideoModel.GetComments(commentListReq.VideoID, commentListReq.CurrUserID)

	return &proto.CommentListResponse{
		Comments: list,
	}, err
}

func (g GRPCServer) GetVideoRecommendations(ctx context.Context, req *proto.RecReq) (*proto.RecResp, error) {
	resp, err := g.VideoModel.GetVideoRecommendations(req.UserId, req.VideoId, req.ShowMature)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (g GRPCServer) GetDanmaku(ctx context.Context, req *proto.DanmakuQueryReq) (*proto.DanmakuList, error) {
	resp, err := g.VideoModel.GetDanmaku(int(req.VideoId))
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (g GRPCServer) AddDanmaku(ctx context.Context, req *proto.Danmaku) (*proto.Nothing, error) {
	return &proto.Nothing{}, g.VideoModel.MakeDanmaku(int(req.VideoId), req.Timestamp, req.Message, int(req.AuthorId), req.Type, req.Color, req.FontSize)
}

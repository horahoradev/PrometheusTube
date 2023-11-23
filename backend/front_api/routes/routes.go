package routes

import (
	"encoding/base64"
	"net/http"
	"net/url"
	"strconv"
	"time"

	redis_store "github.com/eko/gocache/store/redis/v4"

	userproto "github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/user_service/protocol"
	socketio "github.com/googollee/go-socket.io"
	videoproto "github.com/horahoradev/PrometheusTube/backend/video_service/protocol"
	"github.com/horahoradev/horahora/front_api/config"
	schedulerproto "github.com/horahoradev/horahora/scheduler/protocol"
	"github.com/redis/go-redis/v9"

	"github.com/labstack/echo/v4"
)

type RouteHandler struct {
	v   videoproto.VideoServiceClient
	u   userproto.UserServiceClient
	s   schedulerproto.SchedulerClient
	srv *socketio.Server
}

func NewRouteHandler(v videoproto.VideoServiceClient, u userproto.UserServiceClient, s schedulerproto.SchedulerClient, srv *socketio.Server) *RouteHandler {
	return &RouteHandler{
		v:   v,
		u:   u,
		s:   s,
		srv: srv,
	}
}

func SetupRoutes(e *echo.Echo, cfg *config.Config, srv *socketio.Server) {
	r := NewRouteHandler(cfg.VideoClient, cfg.UserClient, cfg.SchedulerClient, srv)
	wrapper := ServerInterfaceWrapper{
		Handler: Server{
			r: *r,
			c: redis_store.NewRedis(redis.NewClient(&redis.Options{
				Addr: "redis:6379", // TODO configure this
			})),
		},
	}

	e.GET("/api/videos", wrapper.Videos)
	e.GET("/api/users/:id", wrapper.Users)
	e.GET("/api/currentuserprofile/", r.getCurrentUserProfile)
	e.GET("/api/audit-events", wrapper.AuditEvents)

	e.GET("/api/videos/:id", wrapper.VideoDetail)
	e.POST("/api/upvotevideo/:id", wrapper.UpvoteVideo)

	e.POST("/api/login", wrapper.Login)
	e.POST("/api/register", wrapper.Register)
	e.POST("/api/logout", wrapper.Logout)

	e.GET("/api/comments/:id", wrapper.Comments)
	e.GET("/api/recommendations/:id", wrapper.Recommendations)
	e.POST("/api/comment", wrapper.Comment)
	e.POST("/api/delete_comment", wrapper.DeleteComment)

	e.GET("/api/upvote/:id", wrapper.Upvote)
	e.POST("/api/upload", wrapper.Upload)

	e.POST("/api/ban/:id", r.handleBan)
	e.POST("/api/delete/:id", r.handleDelete)
	e.POST("/api/setrank/:userid/:rank", r.handleSetRank)
	e.POST("/api/reset_password", wrapper.ResetPassword)

	// Scheduler
	e.GET("/api/downloadsinprogress", r.handleGetDownloadsInProgress)
	e.GET("/api/archive-requests", wrapper.ArchiveRequests)
	e.GET("/api/archive-events", wrapper.ArchiveEvents)
	e.POST("/api/new-archive-request", wrapper.NewArchiveRequest)
	e.POST("/api/retry-archive-request", wrapper.RetryArchiveRequest)
	e.POST("/api/delete-archive-request", wrapper.DeleteArchiveRequest)

	e.POST("/api/follow/:id", wrapper.Follow)
	e.GET("/api/follow-feed", wrapper.FollowFeed)

	e.POST("/api/email-verification", wrapper.EmailValidation)

	e.POST("/api/update-profile", wrapper.UpdateProfile)

	// Danmaku goes here
	e.POST("/api/danmaku", wrapper.CreateDanmaku)
	e.GET("/api/danmaku/:id", wrapper.GetDanmaku)

	e.GET("/api/get-unapproved-videos", wrapper.GetUnapprovedVideos)
	e.POST("/api/unapprove-download", wrapper.UnapproveDownload)
	e.POST("/api/approve-download", wrapper.ApproveDownload)
	e.POST("/api/approve-video", wrapper.ApproveVideo)
}

type Video struct {
	Title         string
	VideoID       int64
	Views         uint64
	AuthorID      int64
	AuthorName    string
	ThumbnailLoc  string
	Rating        int64
	VideoDuration float32
	IsMature      bool
}

type Comment struct {
	ProfilePicture string
	Username       string
	Comment        string
}

type VideoInProgress struct {
	Website  string
	VideoID  string
	DlStatus string
}

type UnapprovedVideo struct {
	URL      string
	VideoID  string
	Category string
}

type Category struct {
	Name        string
	Cardinality int
}

type HomePageData struct {
	PaginationData PaginationData
	Videos         []Video
	Categories     []Category
}

type VideoDetail struct {
	Title             string
	MPDLoc            string
	Thumbnail         string
	Views             uint64
	Rating            int64
	VideoID           int64
	AuthorID          int64
	Username          string
	UserDescription   string
	VideoDescription  string
	UserSubscribers   uint64
	ProfilePicture    string
	UploadDate        string // should be a datetime
	Tags              []string
	RecommendedVideos []Video
	L                 *LoggedInUserData
	VideoDuration     float32
	IsMature          bool
}

type ProfileData struct {
	PaginationData    PaginationData
	UserID            int64
	Username          string
	ProfilePictureURL string
	Videos            []Video
	Banned            bool
	L                 *LoggedInUserData
	Gender            string
	Bio               string
	Birthdate         string
	JoinDate          string
}

type AuditEvent struct {
	ID        int64
	UserID    int64
	Message   string
	Timestamp string
}

type AuditData struct {
	Length int
	Events []AuditEvent
}

type PaginationData struct {
	NumberOfItems int
	CurrentPage   int
}

type ArchiveRequestsPageData struct {
	ArchivalRequests []ArchivalRequest
}

type ArchiveEventsData struct {
	ArchivalEvents []*schedulerproto.ArchivalEvent
}

type ArchivalRequest struct {
	UserID               int64
	Url                  string
	ArchivedVideos       uint64
	CurrentTotalVideos   uint64
	LastSynced           string
	BackoffFactor        uint32
	DownloadID           uint64
	UndownloadableVideos uint64
}

func setCookie(c echo.Context, jwt string) error {
	cookie := new(http.Cookie)
	cookie.Name = "jwt"

	cookie.Path = "/"
	cookie.Value = base64.StdEncoding.EncodeToString([]byte(jwt)) //
	cookie.Expires = time.Now().Add(24 * time.Hour)

	cookie.SameSite = http.SameSiteStrictMode
	//cookie.Secure = true // set this later
	cookie.HttpOnly = false

	c.SetCookie(cookie)

	return c.JSON(http.StatusOK, "Logged in")
}

type CommentData struct {
	ID                    int64  `json:"id"`
	CreationDate          string `json:"created"`
	Content               string `json:"content"`
	Username              string `json:"fullname"`
	ProfileImage          string `json:"profile_picture_url"`
	VoteScore             int64  `json:"upvote_count"`
	CurrUserHasUpvoted    bool   `json:"user_has_upvoted"`
	CurrUserHasDownvoted  bool   `json:"user_has_downvoted"`
	ParentID              int64  `json:"parent,omitempty"`
	AuthoredByCurrentUser bool   `json:"authored_by_current_user"`
}

const (
	videoKey               = "filename[0]"
	thumbnailKey           = "filename[1]"
	MINIMUM_NUMBER_OF_TAGS = 5
	fileUploadChunkSize    = 1024 * 1024
)

func getAsInt64(data url.Values, key string) (int64, error) {
	val, err := url.QueryUnescape(data.Get(key))
	if err != nil {
		return 0, err
	}

	valInt, err := strconv.ParseInt(val, 10, 64)
	if err != nil {
		return 0, err
	}

	return valInt, nil
}

func getAsBool(data url.Values, key string) (bool, error) {
	val, err := url.QueryUnescape(data.Get(key))
	if err != nil {
		return false, err
	}

	valBool, err := strconv.ParseBool(val)
	if err != nil {
		return false, err
	}

	return valBool, nil
}

package grpcserver

import (
	"context"
	"crypto/rsa"
	"errors"
	"fmt"
	"math/rand"
	"net"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/user_service/internal/auth"
	"github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/user_service/internal/model"
	"github.com/go-redis/redis"
	"github.com/mattevans/postmark-go"
	"github.com/opentracing/opentracing-go"

	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	"github.com/grpc-ecosystem/grpc-opentracing/go/otgrpc"

	grpc_prometheus "github.com/grpc-ecosystem/go-grpc-prometheus"

	"github.com/prometheus/client_golang/prometheus/promhttp"
	log "github.com/sirupsen/logrus"

	"github.com/jmoiron/sqlx"

	proto "github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/user_service/protocol"
	"google.golang.org/grpc"
)

type GRPCServer struct {
	proto.UnsafeUserServiceServer
	db         *sqlx.DB
	privateKey *rsa.PrivateKey
	um         *model.UserModel
	redis      *redis.Client
	pmClient   *postmark.Client
}

// Compile-time implementation check
var _ proto.UserServiceServer = (*GRPCServer)(nil)

func NewGRPCServer(db *sqlx.DB, privateKey *rsa.PrivateKey, port int64) error {
	um, err := model.NewUserModel(db)
	if err != nil {
		return err
	}

	redisConn := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%v:%v", "redis", "6379"),
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	auth := &http.Client{
		Transport: &postmark.AuthTransport{Token: os.Getenv("POSTMARK_API_TOKEN")},
	}
	pmClient := postmark.NewClient(auth)

	g := GRPCServer{
		db:         db,
		privateKey: privateKey,
		um:         um,
		redis:      redisConn,
		pmClient:   pmClient,
	}

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	log.Infof("Listening on port %d", port)
	tracer := opentracing.NoopTracer{}
	grpcServer := grpc.NewServer(grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(
		otgrpc.OpenTracingServerInterceptor(tracer))))
	proto.RegisterUserServiceServer(grpcServer, g)

	grpc_prometheus.Register(grpcServer)
	http.Handle("/metrics", promhttp.Handler())
	go http.ListenAndServe(":8081", nil)

	return grpcServer.Serve(lis)
}

func (g GRPCServer) Register(ctx context.Context, req *proto.RegisterRequest) (*proto.RegisterResponse, error) {
	if !req.ForeignUser {
		if err := req.Validate(); err != nil {
			return nil, err
		}

		status := g.redis.Get(req.Email)
		if err := status.Err(); err != nil {
			log.Error("Email verification key does not exist")
			return nil, err
		}

		res, err := status.Result()
		if err != nil {
			return nil, err
		}

		resInt, err := strconv.ParseInt(res, 10, 64)
		if err != nil {
			return nil, err
		}

		if resInt != req.VerificationCode {
			log.Error("Invalid verification code")
			return nil, errors.New("Invalid verification code")
		}

		_, err = g.um.GetUserWithUsername(req.Username)
		if err == nil {
			return nil, errors.New("user already registered with that name")
		}

		// err := auth.RegisterRevolt(req.Email)
		// if err != nil {
		// 	log.Errorf("revolt registration failed. Err: %v", err)
		// 	return nil, err
		// }
	}

	log.Infof("Handling registration for user %s", req.Username)
	jwt, err := auth.Register(req.Username, req.Email, req.Password, g.um, g.privateKey, req.ForeignUser, req.ForeignUserID, req.ForeignWebsite)
	if err != nil {
		log.Errorf("auth: failed to register user %s, failed with err %s", req.Username, err)
		return nil, err
	}

	p := proto.RegisterResponse{
		Jwt: jwt,
	}

	return &p, nil
}

func (g GRPCServer) Login(ctx context.Context, req *proto.LoginRequest) (*proto.LoginResponse, error) {
	log.Info("Handling login for user %s", req.Username)
	jwt, err := auth.Login(req.Username, req.Password, g.privateKey, g.um)
	if err != nil {
		log.Errorf("auth login failed with err: %s", err)
		return nil, err
	}

	p := proto.LoginResponse{
		Jwt: jwt,
	}

	return &p, nil
}

func (g GRPCServer) BanUser(ctx context.Context, req *proto.BanUserRequest) (*proto.BanUserResponse, error) {
	idToBan := req.UserID
	err := g.um.BanUser(idToBan)
	return &proto.BanUserResponse{}, err
}

func (g GRPCServer) GetUserFromID(ctx context.Context, req *proto.GetUserFromIDRequest) (*proto.UserResponse, error) {
	id := req.UserID

	user, err := g.um.GetUserWithID(id)
	if err != nil {
		log.Errorf("failed to fetch user with id %s, failed with err %s", id, err)
		return nil, err
	}

	bd := ""
	if user.Birthdate != nil {
		bd = *user.Birthdate
	}
	return &proto.UserResponse{
		Username:  user.Username,
		Email:     user.Email,
		Rank:      proto.UserRank(user.Rank),
		Banned:    user.Banned,
		Gender:    user.Gender,
		Bio:       user.Bio,
		Birthdate: bd,
		JoinDate:  user.JoinDate,
	}, nil
}

func (g GRPCServer) ValidateJWT(ctx context.Context, req *proto.ValidateJWTRequest) (*proto.ValidateJWTResponse, error) {
	uid, err := auth.ValidateJWT(req.Jwt, *g.privateKey)
	if err != nil {
		log.Errorf("failed to validate JWT, err: %s", err)
		return nil, err
	}

	banned, err := g.um.IsBanned(uid)
	if err != nil {
		return nil, err
	}

	if banned {
		return nil, errors.New("User is banned")
	}

	return &proto.ValidateJWTResponse{
		IsValid: true,
		Uid:     uid,
	}, nil
}

func (g GRPCServer) GetUserIDsForUsername(ctx context.Context, req *proto.GetUserIDsForUsernameRequest) (*proto.GetUserIDsForUsernameResponse, error) {
	ids, err := g.um.GetUserIDsForUsername(req.Username)
	if err != nil {
		log.Errorf("Failed to retrieve usernames for id. Err: %s", err)
		return nil, err
	}

	return &proto.GetUserIDsForUsernameResponse{
		UserIDs: ids,
	}, nil
}

func (g GRPCServer) GetUserForForeignUID(ctx context.Context, req *proto.GetForeignUserRequest) (*proto.GetForeignUserResponse, error) {
	uid, err := g.um.GetForeignUser(req.ForeignUserID, req.OriginalWebsite)
	if err != nil {
		log.Errorf("failed to get foreign UID, err: %s", err)
		return nil, err
	}

	return &proto.GetForeignUserResponse{
		NewUID: uid,
	}, nil
}

func (g GRPCServer) SetUserRank(ctx context.Context, req *proto.SetRankRequest) (*proto.None, error) {
	return &proto.None{}, g.um.SetUserRank(req.UserID, int64(req.Rank.Number()))
}

func (g GRPCServer) ResetPassword(ctx context.Context, req *proto.ResetPasswordRequest) (*proto.None, error) {
	// This is a little inefficient but whatever
	user, err := g.um.GetUserWithID(req.UserID)
	if err != nil {
		log.Errorf("failed to fetch user with id %s, failed with err %s", req.UserID, err)
		return nil, err
	}

	_, err = auth.Login(user.Username, req.OldPassword, g.privateKey, g.um)
	if err != nil {
		log.Errorf("Password reset auth failed with err: %s", err)
		return nil, err
	}

	// old password is valid, so we can proceed to creating a new hash
	passHash, err := auth.GenerateHash([]byte(req.NewPassword))
	if err != nil {
		return nil, err
	}

	return &proto.None{}, g.um.SetNewHash(req.UserID, passHash)
}

func (g GRPCServer) AddAuditEvent(ctx context.Context, req *proto.NewAuditEventRequest) (*proto.None, error) {
	return &proto.None{}, g.um.AddNewAuditEvent(req.User_ID, req.Message)
}

func (g GRPCServer) GetAuditEvents(ctx context.Context, req *proto.AuditEventsListRequest) (*proto.AuditListResponse, error) {
	events, count, err := g.um.GetAuditEvents(req.UserId, req.Page)
	if err != nil {
		return nil, err
	}
	auditEvents := make([]*proto.AuditEvent, 0, len(events))

	for _, event := range events {
		event := proto.AuditEvent{
			Id:        event.ID,
			Message:   event.Message,
			Timestamp: event.Timestamp,
			User_ID:   event.UserID,
		}

		auditEvents = append(auditEvents, &event)
	}

	return &proto.AuditListResponse{
		Events:    auditEvents,
		NumEvents: count,
	}, nil
}

func (g GRPCServer) GetFollowers(ctx context.Context, req *proto.FollowerReq) (*proto.FollowerResp, error) {
	users, err := g.um.GetFollowers(req.User_ID)
	if err != nil {
		return nil, err
	}
	return &proto.FollowerResp{Users: users}, nil
}

func (g GRPCServer) AddFolllower(ctx context.Context, req *proto.AddFollowReq) (*proto.None, error) {
	return &proto.None{}, g.um.AddFollower(req.FollowingId, req.FollowedId)
}

func (g GRPCServer) SetProfile(ctx context.Context, req *proto.ProfileReq) (*proto.None, error) {
	return &proto.None{}, g.um.UpdateProfile(req.Bio, req.Birthdate, req.Gender, req.Username, req.User_ID)
}

func (g GRPCServer) EmailValidation(ctx context.Context, in *proto.ValidationRequest) (*proto.None, error) {
	// 1. Generate number
	randNum := rand.Intn(6*10 ^ 6)

	// 2. Store in redis
	status := g.redis.Set(in.Email, randNum, time.Minute*15)
	if err := status.Err(); err != nil {
		return nil, err
	}

	// 3. Send the email
	email := &postmark.Email{
		From:       "otoman@prometheus.tube",
		To:         in.Email,
		TemplateID: 33247218,
		TemplateModel: map[string]interface{}{
			"name": in.Email,
			"code": fmt.Sprintf("%d", randNum),
		},
		Tag:        "registration",
		TrackOpens: false,
	}

	_, _, err := g.pmClient.Email.Send(email)
	if err != nil {
		return nil, err
	}

	return &proto.None{}, nil
}

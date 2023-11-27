package config

import (
	"fmt"
	"time"

	log "github.com/sirupsen/logrus"

	proto "github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/video_service/protocol"
	"github.com/caarlos0/env"
	"github.com/go-redsync/redsync"
	grpc_retry "github.com/grpc-ecosystem/go-grpc-middleware/retry"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"google.golang.org/grpc"
)

type PostgresInfo struct {
	Hostname string `env:"pgs_host,required"`
	Port     int    `env:"pgs_port,required"`
	Username string `env:"pgs_user"`
	Password string `env:"pgs_pass"`
	Db       string `env:"pgs_db,required"`
}

type config struct {
	PostgresInfo
	Redlock                 *redsync.Redsync
	VideoOutputLoc          string
	VideoServiceGRPCAddress string `env:"VideoServiceGRPCAddress,required"`
	NumberOfRetries         int    `env:"NumberOfRetries,required"`
	Conn                    *sqlx.DB
	GRPCConn                *grpc.ClientConn
	Client                  proto.VideoServiceClient
	SocksConnStr            string        `env:"SocksConn,required"`
	SyncPollDelay           time.Duration `env:"SyncPollDelay,required"`
	MaxFS                   uint64        `env:"MaxDLFileSize,required"`
	AcceptLanguage          string        `env:"AcceptLanguage"`
}

func New() (*config, error) {
	config := config{}
	err := env.Parse(&config.PostgresInfo)
	if err != nil {
		return nil, err
	}

	err = env.Parse(&config)
	if err != nil {
		return nil, err
	}
	config.VideoOutputLoc = "/tmp"

	// I'm putting this here because it makes it easier to do integration tests
	// https://www.calhoun.io/connecting-to-a-postgresql-database-with-gos-database-sql-package/
	config.Conn, err = sqlx.Connect("postgres", fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable connect_timeout=180",
		config.PostgresInfo.Hostname, config.PostgresInfo.Username, config.PostgresInfo.Password, config.PostgresInfo.Db))
	if err != nil {
		log.Fatalf("Could not connect to postgres. Err: %s", err)
	}

	config.Conn.SetMaxOpenConns(50)

	opts := []grpc_retry.CallOption{
		grpc_retry.WithBackoff(grpc_retry.BackoffExponential(100 * time.Millisecond)),
		grpc_retry.WithMax(5),
	}

	config.GRPCConn, err = grpc.Dial(config.VideoServiceGRPCAddress, grpc.WithInsecure(),
		//grpc.WithStreamInterceptor(grpc_retry.StreamClientInterceptor(opts...)),
		grpc.WithUnaryInterceptor(grpc_retry.UnaryClientInterceptor(opts...)))
	if err != nil {
		log.Fatal(err)
	}

	config.Client = proto.NewVideoServiceClient(config.GRPCConn)

	return &config, err
}

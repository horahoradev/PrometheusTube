package main

import (
	"embed"

	"github.com/horahoradev/PrometheusTube/backend/video_service/internal/config"
	"github.com/horahoradev/PrometheusTube/backend/video_service/internal/grpcserver"
	_ "github.com/lib/pq"
	log "github.com/sirupsen/logrus"

	"github.com/pressly/goose/v3"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

func main() {
	conf, err := config.New()
	if err != nil {
		log.Fatalf("Failed to initialize config. Err: %s", err)
	}

	goose.SetBaseFS(embedMigrations)

	if err := goose.SetDialect("postgres"); err != nil {
		log.Fatal(err)
	}

	if err := goose.Up(conf.SqlClient.DB, "migrations"); err != nil {
		log.Fatal(err)
	}

	err = grpcserver.NewGRPCServer(conf.BucketName, conf.SqlClient, conf.GRPCPort, conf.OriginFQDN, conf.Local,
		conf.UserClient, conf.Tracer, conf.StorageBackend, conf.StorageAPIID, conf.StorageAPIKey,
		conf.ApprovalThreshold, conf.StorageEndpoint, conf.MaxDLFileSize, conf.RedisConn, conf.MaxDailyUploadMB)
	if err != nil {
		log.Fatal(err)
	}

	log.Print("Video service finished executing")
}

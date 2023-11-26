package main

import (
	"log"

	"github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/user_service/internal/config"
	"github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend/user_service/internal/grpcserver"

	"embed"

	_ "github.com/lib/pq"

	"github.com/pressly/goose/v3"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

func main() {
	conf, err := config.New()
	if err != nil {
		log.Fatal(err)
	}

	goose.SetBaseFS(embedMigrations)

	if err := goose.SetDialect("postgres"); err != nil {
		log.Fatal(err)
	}

	if err := goose.Up(conf.DbConn.DB, "migrations"); err != nil {
		log.Fatal(err)
	}

	log.Print("Serving traffic")

	err = grpcserver.NewGRPCServer(conf.DbConn, conf.RSAKeypair, conf.GRPCPort)
	if err != nil {
		log.Fatalf("gRPC server terminated with error: %s", err)
	}

	log.Print("User service finished executing")
}

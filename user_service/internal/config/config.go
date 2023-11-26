package config

import (
	"crypto/rand"
	"crypto/rsa"
	"fmt"

	"github.com/caarlos0/env"
	"github.com/jmoiron/sqlx"
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
	RSAKeypair *rsa.PrivateKey
	GRPCPort   int64  `env:"GRPCPort,required"`
	DbConn     *sqlx.DB
}

func New() (*config, error) {
	config := config{}
	err := env.Parse(&config.PostgresInfo)
	if err != nil {
		return nil, err
	}

	err = env.Parse(&config)

	// https://www.calhoun.io/connecting-to-a-postgresql-database-with-gos-database-sql-package/
	conn, err := sqlx.Connect("postgres", fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable connect_timeout=180", config.Hostname, config.Username, config.Password, config.Db))
	if err != nil {
		return nil, fmt.Errorf("could not connect to postgres. Err: %s", err)
	}

	key, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, err
	}

	config.RSAKeypair = key

	// log.Infof("RSAKeypair: %s", config.RSAKeypair)

	config.DbConn = conn
	return &config, err
}

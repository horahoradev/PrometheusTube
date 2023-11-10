-- +goose Up
CREATE INDEX username_idx ON users (username);

-- +goose Up
ALTER TABLE users ADD COLUMN rank int DEFAULT 0; -- 0 normal user, 1 trusted/moderator, 2 administrator
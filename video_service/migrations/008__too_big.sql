-- +goose Up
ALTER TABLE videos ADD COLUMN too_big bool DEFAULT FALSE;

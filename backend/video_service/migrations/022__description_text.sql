-- +goose Up
ALTER TABLE videos ALTER COLUMN description TYPE text;
-- +goose Up
ALTER TABLE videos ADD COLUMN video_duration float DEFAULT 0.00;

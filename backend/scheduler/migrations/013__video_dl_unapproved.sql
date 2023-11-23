-- +goose Up
ALTER TABLE videos ADD COLUMN is_unapproved bool DEFAULT false;

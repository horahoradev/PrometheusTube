-- +goose Up
ALTER TABLE videos ADD COLUMN transcoded bool DEFAULT false;

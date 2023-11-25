-- +goose Up
ALTER TABLE ratings DROP COLUMN rating;
ALTER TABLE ratings ADD COLUMN thumbs integer;

ALTER TABLE videos DROP COLUMN rating;
ALTER TABLE videos ADD COLUMN rating integer DEFAULT 0;

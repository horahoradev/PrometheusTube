-- +goose Up
ALTER TABLE videos ADD COLUMN is_mature bool DEFAULT TRUE;
ALTER TABLE approvals ADD COLUMN mature bool DEFAULT FALSE;

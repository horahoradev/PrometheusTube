-- +goose Up
ALTER TABLE users ADD COLUMN join_date DATE DEFAULT now();
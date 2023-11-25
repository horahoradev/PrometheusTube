-- +goose Up
ALTER TABLE videos ADD COLUMN category varchar(255) DEFAULT '音MAD';

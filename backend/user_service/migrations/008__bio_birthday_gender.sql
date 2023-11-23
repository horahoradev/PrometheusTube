-- +goose Up
ALTER TABLE users ADD COLUMN gender varchar(255);
ALTER TABLE users ADD COLUMN birthdate DATE;
ALTER TABLE users ADD COLUMN bio text;
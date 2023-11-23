-- +goose Up
CREATE TABLE danmaku (
    id SERIAL primary key,
    video_id int REFERENCES videos(id),
    timestamp varchar(255),
    message varchar(255),
    author_id int,
    type varchar(255),
    color varchar(255),
    creation_date timestamp,
    font_size varchar(255)
);

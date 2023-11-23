-- +goose Up
CREATE TABLE favorites (
    user_id int,
    video_id int REFERENCES videos(id),
    primary key(user_id, video_id)
);

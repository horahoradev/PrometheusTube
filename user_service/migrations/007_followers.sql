-- +goose Up
CREATE TABLE is_following (
    following_id int REFERENCES users(id),
    followed_id int REFERENCES users(id),
    primary key(following_id, followed_id)
);

-- +goose Up
ALTER TABLE approvals ADD COLUMN ts TIMESTAMP DEFAULT now();
ALTER TABLE approvals DROP CONSTRAINT approvals_pkey;
CREATE UNIQUE INDEX approvals_pkey ON approvals (user_id, video_id, ts);
ALTER TABLE approvals ADD PRIMARY KEY USING INDEX approvals_pkey;

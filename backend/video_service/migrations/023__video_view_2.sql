-- +goose Up
DROP MATERIALIZED VIEW videos_denormalized;
CREATE MATERIALIZED VIEW videos_denormalized AS
WITH tags_arr as (select videos.id, array_agg(tags.tag) as tag_arr from videos LEFT JOIN tags on videos.id = tags.video_id GROUP BY videos.id),
favorites_arr as (select videos.id, array_agg(favorites.user_id) as favorite_arr from videos LEFT JOIN favorites on videos.id = favorites.video_id GROUP BY videos.id),
comments_count as (select videos.id, count(comments.*) as comment_count from videos LEFT JOIN comments on videos.id = comments.video_id GROUP BY videos.id)
select videos.id as videoid, videos.title::text, tags_arr.tag_arr as tags, comments_count.comment_count, category, favorites_arr.favorite_arr, upload_date, userID, newLink, video_duration, views, rating, is_deleted, transcoded, too_big, is_approved from videos INNER JOIN favorites_arr ON videos.id = favorites_arr.id INNER JOIN comments_count on videos.id = comments_count.id INNER JOIN tags_arr on videos.id = tags_arr.id;
-- +goose Up

DROP INDEX videos_denormalized_idxx;
CREATE INDEX videos_denormalized_idxx
    ON videos_denormalized 
    USING zombodb ((videos_denormalized.*))
    WITH (url='http://elasticsearch:9200/');
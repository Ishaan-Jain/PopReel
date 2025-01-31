CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE videos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Auto-incrementing ID
    user_id BIGINT NOT NULL,                            -- Foreign key linking to the uploader
    video_url TEXT NOT NULL,                            -- Stores the URL or path to the video file
    transcription TEXT,                                 -- (Optional) Stores transcription
    summary TEXT,                                       -- Caption or description for the video
    duration_seconds INT,                               -- (Optional) Stores the length of the video in seconds
    tags TEXT[] NOT NULL,                               -- Array of tags
    embedding vector(768),                              -- Vector embedding (requires pgvector extension)
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

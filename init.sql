CREATE TABLE meta (key TEXT PRIMARY KEY, value_int INT);

INSERT INTO meta(key, value_int) VALUES('status', 1)
  ON CONFLICT(key) DO UPDATE SET value_int=2;

CREATE TABLE suspects (
    -- id INT PRIMARY KEY,
    real_name TEXT NOT NULL,
    name TEXT NOT NULL,
    is_playing INT DEFAULT 0,
    votes INT DEFAULT 0,
    picture_data TEXT
);
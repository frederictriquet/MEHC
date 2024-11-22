CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value_int INT);

INSERT INTO meta(key, value_int) VALUES('status', 1)
  ON CONFLICT(key) DO UPDATE SET value_int=2;
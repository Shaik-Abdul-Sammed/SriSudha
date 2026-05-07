CREATE TABLE IF NOT EXISTS recent_searches (
  id BIGSERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  query TEXT NOT NULL,
  route_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT recent_searches_role_route_unique UNIQUE (role, route_path)
);

CREATE INDEX IF NOT EXISTS recent_searches_role_created_idx
  ON recent_searches (role, created_at DESC);

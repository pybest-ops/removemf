CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  contact TEXT,
  page_path TEXT,
  user_id TEXT,
  user_email TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_type_created_at ON feedback(type, created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_user_created_at ON feedback(user_id, created_at);

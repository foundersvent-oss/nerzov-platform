CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT DEFAULT 'admin',
  is_2fa_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);

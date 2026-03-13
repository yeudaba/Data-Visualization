CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin_users (username, password_hash, full_name, role)
VALUES (
  'yeuda',
  '$2b$10$wYBwUXy8R/SeuVssKovq3.ydjdbXO/XqH/CP2HnWq6fy29kVtGDuy',
  'Yeuda Baza',
  'admin'
)
ON CONFLICT (username) DO NOTHING;
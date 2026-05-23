-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(10) UNIQUE NOT NULL,
  login_token VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create check_ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mood VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_timestamp ON check_ins(timestamp);
CREATE INDEX IF NOT EXISTS idx_users_login_token ON users(login_token);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- RLS policies (public read/write for now - can restrict later)
CREATE POLICY "Public users read" ON users FOR SELECT USING (true);
CREATE POLICY "Public users insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public users update" ON users FOR UPDATE USING (true);

CREATE POLICY "Public check_ins read" ON check_ins FOR SELECT USING (true);
CREATE POLICY "Public check_ins insert" ON check_ins FOR INSERT WITH CHECK (true);
CREATE POLICY "Public check_ins delete" ON check_ins FOR DELETE USING (true);

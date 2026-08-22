-- ============================================================
-- WEALTHSAGE SOVEREIGN DATABASE SCHEMA
-- Run this in the Supabase SQL Editor to create all tables
-- ============================================================

-- 1. TRANSACTIONS (Income & Expenses)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user-id',
  name TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. GOALS (Financial Milestones)
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user-id',
  name TEXT NOT NULL,
  target NUMERIC(12, 2) NOT NULL DEFAULT 0,
  current NUMERIC(12, 2) NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#06B6D4',
  icon TEXT DEFAULT '🎯',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. SUBSCRIPTIONS (Recurring Commitments)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user-id',
  name TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  cycle TEXT NOT NULL DEFAULT 'Monthly',
  "nextDate" TEXT DEFAULT '1st',
  icon TEXT DEFAULT '💸',
  color TEXT DEFAULT '#10B981',
  status TEXT DEFAULT 'Active',
  "supportEmail" TEXT,
  "lastUsed" TEXT,
  "priceHikeAmount" NUMERIC(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. NOTES (Quant Notebook)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user-id',
  title TEXT NOT NULL DEFAULT 'Untitled Note',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. CHAT_MESSAGES (AI Conversation Memory)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user-id',
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. AUDIT_LOGS (Security Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user-id',
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL DEFAULT 'SYSTEM',
  resource_id TEXT DEFAULT '',
  severity TEXT DEFAULT 'INFO' CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
  ip_hash TEXT DEFAULT '',
  signature TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. NOTIFICATIONS (Center)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user-id',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'insight' CHECK (type IN ('alert', 'insight', 'security', 'sync')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. PLAID_CONNECTIONS (Bank Links)
CREATE TABLE IF NOT EXISTS plaid_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user-id',
  access_token TEXT,
  item_id TEXT,
  institution_name TEXT DEFAULT 'Connected Bank',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - Enable but allow demo access
-- ============================================================
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaid_connections ENABLE ROW LEVEL SECURITY;

-- Permissive policies for demo mode (no auth required)
-- In production, replace these with proper auth.uid() checks
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for demo' AND tablename = 'transactions') THEN
    CREATE POLICY "Allow all for demo" ON transactions FOR ALL USING (true) WITH CHECK (true);
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for demo' AND tablename = 'goals') THEN
    CREATE POLICY "Allow all for demo" ON goals FOR ALL USING (true) WITH CHECK (true);
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for demo' AND tablename = 'subscriptions') THEN
    CREATE POLICY "Allow all for demo" ON subscriptions FOR ALL USING (true) WITH CHECK (true);
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for demo' AND tablename = 'notes') THEN
    CREATE POLICY "Allow all for demo" ON notes FOR ALL USING (true) WITH CHECK (true);
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for demo' AND tablename = 'chat_messages') THEN
    CREATE POLICY "Allow all for demo" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for demo' AND tablename = 'audit_logs') THEN
    CREATE POLICY "Allow all for demo" ON audit_logs FOR ALL USING (true) WITH CHECK (true);
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for demo' AND tablename = 'notifications') THEN
    CREATE POLICY "Allow all for demo" ON notifications FOR ALL USING (true) WITH CHECK (true);
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for demo' AND tablename = 'plaid_connections') THEN
    CREATE POLICY "Allow all for demo" ON plaid_connections FOR ALL USING (true) WITH CHECK (true);
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

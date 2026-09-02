-- ============================================================
-- WEALTHSAGE SOVEREIGN DATABASE SCHEMA
-- Run this in the Supabase SQL Editor to create all tables
-- ============================================================

-- 1. TRANSACTIONS (Income & Expenses)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user-id',
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('inflow', 'outflow')),
  category TEXT NOT NULL DEFAULT 'General',
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. GOALS (Financial Milestones)
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user-id',
  title TEXT NOT NULL,
  target_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  target_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. SUBSCRIPTIONS (Recurring Commitments)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user-id',
  name TEXT NOT NULL,
  cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  billing_cycle TEXT NOT NULL DEFAULT 'Monthly',
  next_billing_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
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

-- ============================================================
-- GUARDIAN SHIELD SCHEMA EVOLUTION (NON-DESTRUCTIVE)
-- Safe ALTER TABLE — adds new columns with defaults
-- ============================================================

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS merchant TEXT DEFAULT 'Unknown';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS actor TEXT DEFAULT 'parent';

DO $$ BEGIN
  ALTER TABLE transactions ADD CONSTRAINT chk_tx_status CHECK (status IN ('approved', 'pending', 'flagged'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE transactions ADD CONSTRAINT chk_tx_actor CHECK (actor IN ('parent', 'child'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 9. UPI MANDATES (Recurring Autopay Subscriptions)
CREATE TABLE IF NOT EXISTS upi_mandates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user-id',
  merchant TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  frequency TEXT NOT NULL DEFAULT 'Monthly',
  last_charged TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'revoked')),
  is_dark_pattern BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. PAYMENT REQUESTS (UPI Circle Delegation Queue)
CREATE TABLE IF NOT EXISTS payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user-id',
  merchant TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  child_label TEXT DEFAULT 'Child Device',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_upi_mandates_user_id ON upi_mandates(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_actor ON transactions(actor);

ALTER TABLE upi_mandates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for demo' AND tablename = 'upi_mandates') THEN
    CREATE POLICY "Allow all for demo" ON upi_mandates FOR ALL USING (true) WITH CHECK (true);
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for demo' AND tablename = 'payment_requests') THEN
    CREATE POLICY "Allow all for demo" ON payment_requests FOR ALL USING (true) WITH CHECK (true);
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

-- 11. DEDUPLICATION (Survival Blueprint Hardening)
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS utr_reference TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_tx_ref ON transactions(utr_reference) WHERE utr_reference IS NOT NULL;

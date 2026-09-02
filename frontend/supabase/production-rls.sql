-- ============================================================
-- WEALTHSAGE SOVEREIGN DATABASE SCHEMA
-- PRODUCTION SECURITY ARCHITECTURE (JWT RLS)
-- ============================================================

-- This file is for production execution only. It replaces the
-- permissive 'Allow all for demo' policies with strict auth.uid()
-- checks via the Supabase Auth / Clerk JWT integration.

-- First, drop the demo permissive policies
DO $$ 
DECLARE
  table_name text;
BEGIN
  FOR table_name IN SELECT unnest(ARRAY[
    'transactions', 'goals', 'subscriptions', 'notes', 
    'chat_messages', 'audit_logs', 'notifications', 
    'plaid_connections', 'upi_mandates', 'payment_requests'
  ]) LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Allow all for demo" ON %I;', table_name);
  END LOOP;
END $$;

-- Enable RLS across all tables (Safety Catch)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaid_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE upi_mandates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- 1. TRANSACTIONS
CREATE POLICY "Users can only read own transactions" 
ON transactions FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can only insert own transactions" 
ON transactions FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can only update own transactions" 
ON transactions FOR UPDATE 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can only delete own transactions" 
ON transactions FOR DELETE 
USING (auth.uid()::text = user_id);

-- 2. GOALS
CREATE POLICY "Users can only read own goals" ON goals FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only insert own goals" ON goals FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can only update own goals" ON goals FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only delete own goals" ON goals FOR DELETE USING (auth.uid()::text = user_id);

-- 3. SUBSCRIPTIONS
CREATE POLICY "Users can only read own subscriptions" ON subscriptions FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can only update own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only delete own subscriptions" ON subscriptions FOR DELETE USING (auth.uid()::text = user_id);

-- 4. NOTES
CREATE POLICY "Users can only read own notes" ON notes FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only insert own notes" ON notes FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can only update own notes" ON notes FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only delete own notes" ON notes FOR DELETE USING (auth.uid()::text = user_id);

-- 5. CHAT MESSAGES
CREATE POLICY "Users can only read own chat_messages" ON chat_messages FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only insert own chat_messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- 6. AUDIT LOGS (Immutable in Production)
CREATE POLICY "Users can only read own audit_logs" ON audit_logs FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "System can insert audit_logs" ON audit_logs FOR INSERT WITH CHECK (auth.uid()::text = user_id);
-- No UPDATE or DELETE policies for audit logs

-- 7. NOTIFICATIONS
CREATE POLICY "Users can only read own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can only update own notifications" ON notifications FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only delete own notifications" ON notifications FOR DELETE USING (auth.uid()::text = user_id);

-- 8. PLAID CONNECTIONS / AA
CREATE POLICY "Users can only read own plaid_connections" ON plaid_connections FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only insert own plaid_connections" ON plaid_connections FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can only update own plaid_connections" ON plaid_connections FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only delete own plaid_connections" ON plaid_connections FOR DELETE USING (auth.uid()::text = user_id);

-- 9. UPI MANDATES
CREATE POLICY "Users can only read own mandates" ON upi_mandates FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only insert own mandates" ON upi_mandates FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can only update own mandates" ON upi_mandates FOR UPDATE USING (auth.uid()::text = user_id);

-- 10. PAYMENT REQUESTS
CREATE POLICY "Users can only read own payment_requests" ON payment_requests FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only insert own payment_requests" ON payment_requests FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can only update own payment_requests" ON payment_requests FOR UPDATE USING (auth.uid()::text = user_id);

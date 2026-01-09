-- ============================================================================
-- MIGRATION 004: User Subscriptions RLS Policies
-- ============================================================================
-- Description: Row Level Security policies for user_subscriptions table
-- Date: 2026-01-09
-- Related: IMPLEMENTAZIONE_SUBSCRIPTIONS.md
-- ============================================================================

-- Enable RLS on user_subscriptions table
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLICY 1: Users can view their own subscription
-- ============================================================================
-- Allows authenticated users to SELECT their own subscription data
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;

CREATE POLICY "Users can view own subscription"
ON public.user_subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================================
-- POLICY 2: Service can insert subscriptions
-- ============================================================================
-- Allows authenticated users to INSERT their own subscription
-- This is used during registration after payment
-- ============================================================================

DROP POLICY IF EXISTS "Service can insert subscriptions" ON public.user_subscriptions;

CREATE POLICY "Service can insert subscriptions"
ON public.user_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- POLICY 3: Service can update own subscriptions
-- ============================================================================
-- Allows authenticated users to UPDATE their own subscription
-- This is useful for status changes (active -> cancelled, etc.)
-- ============================================================================

DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions;

CREATE POLICY "Users can update own subscription"
ON public.user_subscriptions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- POLICY 4: Admin users can manage all subscriptions
-- ============================================================================
-- Allows admin users (service role) to manage all subscriptions
-- This is useful for admin dashboard and support operations
-- ============================================================================

DROP POLICY IF EXISTS "Admin can manage all subscriptions" ON public.user_subscriptions;

CREATE POLICY "Admin can manage all subscriptions"
ON public.user_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this to verify policies are correctly applied:
--
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'user_subscriptions';
-- ============================================================================

-- ============================================================================
-- TEST QUERIES
-- ============================================================================
-- Run these as authenticated user to test policies:
--
-- 1. Test SELECT (should return only user's subscription)
-- SELECT * FROM user_subscriptions;
--
-- 2. Test INSERT (should succeed for user's own data)
-- INSERT INTO user_subscriptions (user_id, plan_id, status, stripe_customer_id)
-- VALUES (auth.uid(), 1, 'active', 'cus_test123');
--
-- 3. Test UPDATE (should succeed for user's own subscription)
-- UPDATE user_subscriptions 
-- SET status = 'cancelled' 
-- WHERE user_id = auth.uid();
--
-- 4. Test unauthorized access (should fail)
-- SELECT * FROM user_subscriptions WHERE user_id != auth.uid();
-- ============================================================================

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
-- Create indexes for common queries
-- ============================================================================

-- Index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
ON public.user_subscriptions(user_id);

-- Index on status for filtering active subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status 
ON public.user_subscriptions(status);

-- Index on expires_at for finding expiring subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires_at 
ON public.user_subscriptions(expires_at);

-- Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_status 
ON public.user_subscriptions(user_id, status);

-- Index on Stripe customer ID for webhook lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer 
ON public.user_subscriptions(stripe_customer_id);

-- ============================================================================
-- HELPFUL QUERIES
-- ============================================================================

-- Find all active subscriptions
-- SELECT * FROM user_subscriptions WHERE status = 'active';

-- Find expiring subscriptions (within 7 days)
-- SELECT * FROM user_subscriptions 
-- WHERE status = 'active' 
-- AND expires_at IS NOT NULL 
-- AND expires_at BETWEEN NOW() AND NOW() + INTERVAL '7 days'
-- ORDER BY expires_at ASC;

-- Find expired subscriptions
-- SELECT * FROM user_subscriptions 
-- WHERE status = 'active' 
-- AND expires_at IS NOT NULL 
-- AND expires_at < NOW();

-- Count subscriptions by status
-- SELECT status, COUNT(*) as count 
-- FROM user_subscriptions 
-- GROUP BY status;

-- Find subscription by Stripe customer ID (for webhooks)
-- SELECT * FROM user_subscriptions 
-- WHERE stripe_customer_id = 'cus_xxx';

-- ============================================================================
-- ROLLBACK
-- ============================================================================
-- To rollback this migration (remove policies):
--
-- DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;
-- DROP POLICY IF EXISTS "Service can insert subscriptions" ON public.user_subscriptions;
-- DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions;
-- DROP POLICY IF EXISTS "Admin can manage all subscriptions" ON public.user_subscriptions;
-- ALTER TABLE public.user_subscriptions DISABLE ROW LEVEL SECURITY;
-- ============================================================================

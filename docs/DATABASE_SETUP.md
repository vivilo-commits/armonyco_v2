# Database Setup - Products & Features

## Schema Setup

### 1. Tabella Products

```sql
-- Create products table (se non esiste già)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('GUEST', 'REVENUE', 'OPS', 'PLAYBOOK', 'CORE')),
  credit_cost INTEGER NOT NULL DEFAULT 0,
  labor_reduction VARCHAR(50),
  value_generated VARCHAR(50),
  requires_external BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sort ON products(sort_order);
```

### 2. Tabella User Product Activations

```sql
-- Create user_product_activations table
CREATE TABLE IF NOT EXISTS user_product_activations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'paused', 'inactive')),
  activated_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure one record per user-product pair
  UNIQUE(user_id, product_id)
);

-- Indexes for performance
CREATE INDEX idx_user_products_user ON user_product_activations(user_id);
CREATE INDEX idx_user_products_product ON user_product_activations(product_id);
CREATE INDEX idx_user_products_status ON user_product_activations(status);
CREATE INDEX idx_user_products_composite ON user_product_activations(user_id, product_id, status);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_product_activations_updated_at
BEFORE UPDATE ON user_product_activations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on user_product_activations
ALTER TABLE user_product_activations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own activations
CREATE POLICY "Users can view own activations"
  ON user_product_activations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own activations (for self-service)
CREATE POLICY "Users can insert own activations"
  ON user_product_activations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own activations
CREATE POLICY "Users can update own activations"
  ON user_product_activations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Admin can manage all activations (requires custom role)
CREATE POLICY "Admins can manage all activations"
  ON user_product_activations
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Products table - everyone can read active products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  USING (is_active = true);

-- Only admins can modify products
CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );
```

## Seed Data - Products

```sql
-- Insert default products/features
INSERT INTO products (code, name, description, category, credit_cost, labor_reduction, value_generated, requires_external, sort_order) VALUES
  -- GUEST MANAGEMENT
  ('guest-check-in', 'Automated Check-In', 'Self-service check-in system for guests', 'GUEST', 1000, '40%', '€2,000/mo', false, 1),
  ('guest-messaging', 'Guest Messaging', 'Automated guest communication and responses', 'GUEST', 800, '60%', '€1,500/mo', false, 2),
  ('guest-concierge', 'AI Concierge', 'Virtual concierge for guest requests', 'GUEST', 1200, '70%', '€3,000/mo', false, 3),
  
  -- REVENUE MANAGEMENT
  ('dynamic-pricing', 'Dynamic Pricing', 'AI-powered dynamic pricing optimization', 'REVENUE', 2000, '30%', '€5,000/mo', true, 10),
  ('revenue-analytics', 'Revenue Analytics', 'Advanced revenue analytics and forecasting', 'REVENUE', 1500, '50%', '€4,000/mo', false, 11),
  ('upsell-engine', 'Upsell Engine', 'Automated upselling and cross-selling', 'REVENUE', 1000, '40%', '€2,500/mo', false, 12),
  
  -- OPERATIONS
  ('maintenance-tracker', 'Maintenance Tracker', 'Property maintenance scheduling and tracking', 'OPS', 800, '60%', '€1,800/mo', false, 20),
  ('housekeeping-scheduler', 'Housekeeping Scheduler', 'Automated housekeeping task management', 'OPS', 900, '50%', '€2,000/mo', false, 21),
  ('inventory-manager', 'Inventory Manager', 'Smart inventory tracking and alerts', 'OPS', 700, '40%', '€1,200/mo', false, 22),
  
  -- PLAYBOOK
  ('compliance-monitor', 'Compliance Monitor', 'Regulatory compliance tracking and alerts', 'PLAYBOOK', 1500, '80%', '€3,500/mo', false, 30),
  ('sop-automator', 'SOP Automator', 'Standard operating procedure automation', 'PLAYBOOK', 1200, '70%', '€2,800/mo', false, 31),
  ('quality-assurance', 'Quality Assurance', 'Automated quality checks and reports', 'PLAYBOOK', 1000, '60%', '€2,200/mo', false, 32),
  
  -- CORE (Always included)
  ('dashboard', 'Management Dashboard', 'Central management dashboard', 'CORE', 0, 'N/A', 'N/A', false, 100),
  ('basic-reporting', 'Basic Reporting', 'Standard reporting and exports', 'CORE', 0, 'N/A', 'N/A', false, 101)
ON CONFLICT (code) DO NOTHING;
```

## Default Activation Setup

### Option 1: Activate all CORE features for new users

```sql
-- Function to activate core features on user creation
CREATE OR REPLACE FUNCTION activate_core_features_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert activations for all CORE products
  INSERT INTO user_product_activations (user_id, product_id, status)
  SELECT NEW.id, p.id, 'active'
  FROM products p
  WHERE p.category = 'CORE' AND p.is_active = true
  ON CONFLICT (user_id, product_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_user_created_activate_core
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION activate_core_features_for_new_user();
```

### Option 2: Activate features based on plan

```sql
-- Function to activate features based on subscription plan
CREATE OR REPLACE FUNCTION activate_plan_features(
  p_user_id UUID,
  p_plan_name VARCHAR
)
RETURNS void AS $$
BEGIN
  -- Deactivate all current features
  UPDATE user_product_activations
  SET status = 'inactive'
  WHERE user_id = p_user_id;
  
  -- Activate features based on plan
  IF p_plan_name = 'STARTER' THEN
    -- STARTER: CORE + basic GUEST features
    INSERT INTO user_product_activations (user_id, product_id, status)
    SELECT p_user_id, p.id, 'active'
    FROM products p
    WHERE (p.category = 'CORE' OR p.code IN ('guest-check-in', 'guest-messaging'))
      AND p.is_active = true
    ON CONFLICT (user_id, product_id) 
    DO UPDATE SET status = 'active', updated_at = NOW();
    
  ELSIF p_plan_name = 'PROFESSIONAL' THEN
    -- PROFESSIONAL: CORE + all GUEST + some REVENUE
    INSERT INTO user_product_activations (user_id, product_id, status)
    SELECT p_user_id, p.id, 'active'
    FROM products p
    WHERE (p.category IN ('CORE', 'GUEST') OR p.code IN ('revenue-analytics', 'upsell-engine'))
      AND p.is_active = true
    ON CONFLICT (user_id, product_id) 
    DO UPDATE SET status = 'active', updated_at = NOW();
    
  ELSIF p_plan_name = 'ENTERPRISE' THEN
    -- ENTERPRISE: All features
    INSERT INTO user_product_activations (user_id, product_id, status)
    SELECT p_user_id, p.id, 'active'
    FROM products p
    WHERE p.is_active = true
    ON CONFLICT (user_id, product_id) 
    DO UPDATE SET status = 'active', updated_at = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Call this function when subscription is created/updated
-- Example: SELECT activate_plan_features('user-uuid', 'PROFESSIONAL');
```

## Migration Scripts

### Migrate existing users to new system

```sql
-- Activate all features for existing users (temporary during migration)
INSERT INTO user_product_activations (user_id, product_id, status)
SELECT u.id, p.id, 'active'
FROM auth.users u
CROSS JOIN products p
WHERE p.is_active = true
ON CONFLICT (user_id, product_id) DO NOTHING;
```

### Bulk operations

```sql
-- Pause all features for a specific user (e.g., subscription expired)
UPDATE user_product_activations
SET status = 'paused'
WHERE user_id = 'user-uuid-here';

-- Reactivate all paused features
UPDATE user_product_activations
SET status = 'active'
WHERE user_id = 'user-uuid-here' AND status = 'paused';

-- Deactivate specific feature for all users
UPDATE user_product_activations
SET status = 'inactive'
WHERE product_id = (SELECT id FROM products WHERE code = 'feature-code');
```

## Useful Queries

```sql
-- Get all active features for a user
SELECT p.code, p.name, p.category, upa.status
FROM user_product_activations upa
JOIN products p ON p.id = upa.product_id
WHERE upa.user_id = 'user-uuid'
  AND upa.status = 'active'
ORDER BY p.sort_order;

-- Count users per feature
SELECT p.name, COUNT(upa.user_id) as user_count
FROM products p
LEFT JOIN user_product_activations upa ON upa.product_id = p.id AND upa.status = 'active'
GROUP BY p.id, p.name
ORDER BY user_count DESC;

-- Find users without any active features
SELECT u.id, u.email
FROM auth.users u
LEFT JOIN user_product_activations upa ON upa.user_id = u.id AND upa.status = 'active'
WHERE upa.id IS NULL;

-- Feature adoption rate
SELECT 
  p.name,
  COUNT(DISTINCT CASE WHEN upa.status = 'active' THEN upa.user_id END) as active_users,
  COUNT(DISTINCT u.id) as total_users,
  ROUND(
    COUNT(DISTINCT CASE WHEN upa.status = 'active' THEN upa.user_id END)::numeric / 
    COUNT(DISTINCT u.id) * 100, 
    2
  ) as adoption_rate
FROM products p
CROSS JOIN auth.users u
LEFT JOIN user_product_activations upa ON upa.product_id = p.id AND upa.user_id = u.id
GROUP BY p.id, p.name
ORDER BY adoption_rate DESC;
```

## Backup & Restore

```bash
# Backup products and activations
pg_dump -h localhost -U postgres -d armonyco \
  -t products -t user_product_activations \
  > products_backup.sql

# Restore
psql -h localhost -U postgres -d armonyco < products_backup.sql
```

## Testing

```sql
-- Test user activation flow
BEGIN;
  -- Create test user
  INSERT INTO auth.users (id, email) VALUES ('test-uuid', 'test@example.com');
  
  -- Activate some features
  SELECT activate_plan_features('test-uuid', 'PROFESSIONAL');
  
  -- Verify activations
  SELECT p.code, upa.status 
  FROM user_product_activations upa
  JOIN products p ON p.id = upa.product_id
  WHERE upa.user_id = 'test-uuid';
ROLLBACK;
```

## Monitoring Queries

```sql
-- Recent activations
SELECT u.email, p.name, upa.status, upa.updated_at
FROM user_product_activations upa
JOIN auth.users u ON u.id = upa.user_id
JOIN products p ON p.id = upa.product_id
WHERE upa.updated_at > NOW() - INTERVAL '24 hours'
ORDER BY upa.updated_at DESC;

-- Users with paused features (potential churners)
SELECT u.email, COUNT(*) as paused_count
FROM user_product_activations upa
JOIN auth.users u ON u.id = upa.user_id
WHERE upa.status = 'paused'
GROUP BY u.id, u.email
HAVING COUNT(*) > 0;
```

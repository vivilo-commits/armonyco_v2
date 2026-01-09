-- ============================================================================
-- MIGRAZIONE 002: Aggiornamento tabella user_subscriptions
-- ============================================================================
-- Descrizione: Aggiunge colonne per tracciare Stripe Customer e Subscription IDs
-- Necessario per gestire abbonamenti ricorrenti e sincronizzare con Stripe
-- ============================================================================

-- Aggiungi colonne Stripe se non esistono già
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

-- Crea indici per query veloci su Stripe IDs
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer 
  ON user_subscriptions(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription 
  ON user_subscriptions(stripe_subscription_id);

-- Aggiungi constraint per garantire unicità dello Stripe Subscription ID
-- Un subscription ID può apparire solo una volta nella tabella
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription_unique 
  ON user_subscriptions(stripe_subscription_id) 
  WHERE stripe_subscription_id IS NOT NULL;

-- ============================================================================
-- COMMENTI COLONNE (documentazione)
-- ============================================================================

COMMENT ON COLUMN user_subscriptions.stripe_customer_id IS 
  'Stripe Customer ID (es. cus_xxxxx). Ogni utente ha un solo Customer ID che persiste anche cambiando piano.';

COMMENT ON COLUMN user_subscriptions.stripe_subscription_id IS 
  'Stripe Subscription ID (es. sub_xxxxx). Identifica univocamente l''abbonamento corrente.';

-- ============================================================================
-- QUERY DI VERIFICA
-- ============================================================================

-- Esegui queste query per verificare che tutto sia stato creato correttamente:

-- 1. Verifica le nuove colonne
-- SELECT column_name, data_type, character_maximum_length 
-- FROM information_schema.columns 
-- WHERE table_name = 'user_subscriptions' 
--   AND column_name IN ('stripe_customer_id', 'stripe_subscription_id');

-- 2. Verifica gli indici
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'user_subscriptions' 
--   AND indexname LIKE '%stripe%';

-- 3. Visualizza la struttura completa della tabella
-- SELECT * FROM information_schema.columns WHERE table_name = 'user_subscriptions';

-- ============================================================================
-- ROLLBACK (se necessario)
-- ============================================================================

-- Per annullare questa migrazione, esegui:
-- DROP INDEX IF EXISTS idx_user_subscriptions_stripe_subscription_unique;
-- DROP INDEX IF EXISTS idx_user_subscriptions_stripe_subscription;
-- DROP INDEX IF EXISTS idx_user_subscriptions_stripe_customer;
-- ALTER TABLE user_subscriptions DROP COLUMN IF EXISTS stripe_subscription_id;
-- ALTER TABLE user_subscriptions DROP COLUMN IF EXISTS stripe_customer_id;



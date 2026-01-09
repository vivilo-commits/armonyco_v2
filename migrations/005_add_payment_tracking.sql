-- ============================================================================
-- MIGRAZIONE 005: Payment Tracking per Lifecycle Management
-- ============================================================================
-- Descrizione: Aggiunge campi per tracciare fallimenti pagamenti e tentativi
-- Necessario per gestire automaticamente sospensioni/riattivazioni account
-- ============================================================================

-- Aggiungi colonne per tracking pagamenti
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS payment_failed_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_payment_attempt TIMESTAMP WITH TIME ZONE;

-- Crea indice per query veloci su subscription scadute/problematiche
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status_expires 
  ON user_subscriptions(status, expires_at);

-- Crea indice per utenti con pagamenti falliti
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_payment_failed 
  ON user_subscriptions(payment_failed_count) 
  WHERE payment_failed_count > 0;

-- ============================================================================
-- COMMENTI COLONNE (documentazione)
-- ============================================================================

COMMENT ON COLUMN user_subscriptions.payment_failed_count IS 
  'Numero di tentativi di pagamento falliti consecutivi. Reset a 0 quando pagamento riesce.';

COMMENT ON COLUMN user_subscriptions.last_payment_attempt IS 
  'Timestamp dell''ultimo tentativo di pagamento (riuscito o fallito).';

-- ============================================================================
-- QUERY DI VERIFICA
-- ============================================================================

-- Verifica le nuove colonne
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'user_subscriptions' 
--   AND column_name IN ('payment_failed_count', 'last_payment_attempt');

-- Verifica gli indici
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'user_subscriptions' 
--   AND indexname LIKE '%payment%';

-- ============================================================================
-- ROLLBACK (se necessario)
-- ============================================================================

-- DROP INDEX IF EXISTS idx_user_subscriptions_payment_failed;
-- DROP INDEX IF EXISTS idx_user_subscriptions_status_expires;
-- ALTER TABLE user_subscriptions DROP COLUMN IF EXISTS last_payment_attempt;
-- ALTER TABLE user_subscriptions DROP COLUMN IF EXISTS payment_failed_count;


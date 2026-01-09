-- ============================================================================
-- MIGRAZIONE 001: Creazione tabella user_tokens
-- ============================================================================
-- Descrizione: Crea la tabella per tracciare i tokens degli utenti
-- Formula: tokens = credits × 100
-- Esempio: Piano STARTER (25000 credits) = 2,500,000 tokens
-- ============================================================================

-- Crea la tabella user_tokens se non esiste già
CREATE TABLE IF NOT EXISTS user_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tokens BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_tokens_user_id_unique UNIQUE(user_id)
);

-- Crea indice per query veloci su user_id
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens(user_id);

-- Crea funzione per aggiornare automaticamente updated_at
CREATE OR REPLACE FUNCTION update_user_tokens_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crea trigger per aggiornare updated_at automaticamente
DROP TRIGGER IF EXISTS user_tokens_updated_at_trigger ON user_tokens;
CREATE TRIGGER user_tokens_updated_at_trigger
  BEFORE UPDATE ON user_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_user_tokens_timestamp();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Abilita RLS sulla tabella
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Gli utenti possono vedere solo i propri tokens
CREATE POLICY "Users can view their own tokens"
  ON user_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Solo il sistema può inserire/aggiornare tokens (tramite service role)
-- Gli utenti normali NON possono modificare direttamente i loro tokens
CREATE POLICY "Service role can insert tokens"
  ON user_tokens
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update tokens"
  ON user_tokens
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- QUERY DI VERIFICA
-- ============================================================================

-- Esegui queste query per verificare che tutto sia stato creato correttamente:

-- 1. Verifica che la tabella esista
-- SELECT * FROM information_schema.tables WHERE table_name = 'user_tokens';

-- 2. Verifica le colonne
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'user_tokens';

-- 3. Verifica gli indici
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'user_tokens';

-- 4. Verifica le policy RLS
-- SELECT * FROM pg_policies WHERE tablename = 'user_tokens';

-- ============================================================================
-- ROLLBACK (se necessario)
-- ============================================================================

-- Per annullare questa migrazione, esegui:
-- DROP TRIGGER IF EXISTS user_tokens_updated_at_trigger ON user_tokens;
-- DROP FUNCTION IF EXISTS update_user_tokens_timestamp();
-- DROP TABLE IF EXISTS user_tokens CASCADE;



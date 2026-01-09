-- ============================================================================
-- MIGRAZIONE 003: Creazione tabella token_history (OPZIONALE)
-- ============================================================================
-- Descrizione: Crea tabella per tracciare lo storico delle transazioni tokens
-- Utile per audit, debugging e visualizzazione dello storico utente
-- NOTA: Questa migrazione è OPZIONALE. Puoi saltarla se non necessaria.
-- ============================================================================

-- Crea enum per i tipi di transazione
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'token_transaction_type') THEN
    CREATE TYPE token_transaction_type AS ENUM (
      'subscription_initial',    -- Tokens iniziali dalla prima sottoscrizione
      'subscription_renewal',    -- Tokens da rinnovo mensile
      'subscription_upgrade',    -- Tokens da upgrade piano
      'subscription_downgrade',  -- Tokens da downgrade piano (se applicabile)
      'manual_adjustment',       -- Aggiustamento manuale da admin
      'consumption',             -- Consumo tokens da utilizzo piattaforma
      'refund'                   -- Rimborso tokens
    );
  END IF;
END $$;

-- Crea la tabella token_history
CREATE TABLE IF NOT EXISTS token_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,  -- Positivo per aggiunte, negativo per consumi
  balance_before BIGINT NOT NULL,  -- Saldo prima della transazione
  balance_after BIGINT NOT NULL,   -- Saldo dopo la transazione
  transaction_type token_transaction_type NOT NULL,
  description TEXT,  -- Descrizione opzionale della transazione
  reference_id VARCHAR(255),  -- ID di riferimento (es. Stripe invoice ID, session ID, etc.)
  metadata JSONB,  -- Metadati aggiuntivi in formato JSON
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indici per query veloci
CREATE INDEX IF NOT EXISTS idx_token_history_user_id 
  ON token_history(user_id);

CREATE INDEX IF NOT EXISTS idx_token_history_created_at 
  ON token_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_token_history_user_date 
  ON token_history(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_token_history_transaction_type 
  ON token_history(transaction_type);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Abilita RLS sulla tabella
ALTER TABLE token_history ENABLE ROW LEVEL SECURITY;

-- Policy: Gli utenti possono vedere solo il proprio storico
CREATE POLICY "Users can view their own token history"
  ON token_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Solo il sistema può inserire record nello storico
CREATE POLICY "Service role can insert token history"
  ON token_history
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- FUNZIONE HELPER: Registra transazione token
-- ============================================================================

-- Questa funzione può essere chiamata dal backend per registrare automaticamente
-- ogni transazione di tokens
CREATE OR REPLACE FUNCTION log_token_transaction(
  p_user_id UUID,
  p_amount BIGINT,
  p_transaction_type token_transaction_type,
  p_description TEXT DEFAULT NULL,
  p_reference_id VARCHAR(255) DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_balance_before BIGINT;
  v_balance_after BIGINT;
  v_history_id UUID;
BEGIN
  -- Ottieni saldo corrente
  SELECT tokens INTO v_balance_before
  FROM user_tokens
  WHERE user_id = p_user_id;

  -- Se l'utente non ha un record tokens, crealo
  IF v_balance_before IS NULL THEN
    INSERT INTO user_tokens (user_id, tokens)
    VALUES (p_user_id, 0);
    v_balance_before := 0;
  END IF;

  -- Calcola nuovo saldo
  v_balance_after := v_balance_before + p_amount;

  -- Aggiorna saldo tokens
  UPDATE user_tokens
  SET tokens = v_balance_after
  WHERE user_id = p_user_id;

  -- Registra transazione nello storico
  INSERT INTO token_history (
    user_id, 
    amount, 
    balance_before, 
    balance_after, 
    transaction_type,
    description,
    reference_id,
    metadata
  )
  VALUES (
    p_user_id,
    p_amount,
    v_balance_before,
    v_balance_after,
    p_transaction_type,
    p_description,
    p_reference_id,
    p_metadata
  )
  RETURNING id INTO v_history_id;

  RETURN v_history_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- QUERY DI VERIFICA
-- ============================================================================

-- Esegui queste query per verificare che tutto sia stato creato correttamente:

-- 1. Verifica che la tabella esista
-- SELECT * FROM information_schema.tables WHERE table_name = 'token_history';

-- 2. Verifica l'enum type
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'token_transaction_type'::regtype;

-- 3. Verifica le colonne
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'token_history';

-- 4. Verifica gli indici
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'token_history';

-- 5. Testa la funzione (SOLO PER TEST, sostituisci con un user_id reale)
-- SELECT log_token_transaction(
--   'user-uuid-here'::uuid,
--   250000,
--   'subscription_initial'::token_transaction_type,
--   'Piano STARTER - Sottoscrizione iniziale',
--   'sub_xxxxx',
--   '{"plan": "STARTER", "credits": 25000}'::jsonb
-- );

-- ============================================================================
-- ROLLBACK (se necessario)
-- ============================================================================

-- Per annullare questa migrazione, esegui:
-- DROP FUNCTION IF EXISTS log_token_transaction;
-- DROP TABLE IF EXISTS token_history CASCADE;
-- DROP TYPE IF EXISTS token_transaction_type CASCADE;



# 📦 Migrazioni Database - Sistema Tokens

Questa cartella contiene gli script SQL per creare le tabelle necessarie al sistema di abbonamenti con tokens.

## 📋 Prerequisiti

- Account Supabase attivo
- Accesso al SQL Editor del tuo progetto Supabase
- Tabelle esistenti: `auth.users` e `user_subscriptions`

## 🚀 Come Eseguire le Migrazioni

### Passo 1: Accedi al SQL Editor

1. Vai su [app.supabase.com](https://app.supabase.com)
2. Seleziona il tuo progetto
3. Nel menu laterale, clicca su **"SQL Editor"**

### Passo 2: Esegui le Migrazioni in Ordine

**IMPORTANTE:** Esegui gli script nell'ordine indicato!

#### 1️⃣ Migrazione 001: Tabella user_tokens

```bash
File: 001_create_user_tokens.sql
```

1. Apri il file `001_create_user_tokens.sql`
2. Copia tutto il contenuto
3. Nel SQL Editor, crea una nuova query
4. Incolla il contenuto
5. Clicca su **"Run"** (o premi Ctrl/Cmd + Enter)
6. ✅ Verifica che appaia "Success. No rows returned"

**Cosa crea:**
- Tabella `user_tokens` per tracciare il saldo tokens di ogni utente
- Indice su `user_id` per query veloci
- Trigger per aggiornare automaticamente `updated_at`
- Policy RLS per sicurezza

#### 2️⃣ Migrazione 002: Aggiornamento user_subscriptions

```bash
File: 002_alter_user_subscriptions.sql
```

1. Apri il file `002_alter_user_subscriptions.sql`
2. Copia tutto il contenuto
3. Nel SQL Editor, crea una nuova query
4. Incolla il contenuto
5. Clicca su **"Run"**
6. ✅ Verifica che appaia "Success"

**Cosa modifica:**
- Aggiunge colonne `stripe_customer_id` e `stripe_subscription_id`
- Crea indici per query veloci su questi campi
- Aggiunge constraint di unicità

#### 3️⃣ Migrazione 003: Storico Transazioni (OPZIONALE)

```bash
File: 003_create_token_history.sql
```

⚠️ **Questa migrazione è OPZIONALE**. Eseguila solo se vuoi tracciare lo storico completo delle transazioni tokens.

1. Apri il file `003_create_token_history.sql`
2. Copia tutto il contenuto
3. Nel SQL Editor, crea una nuova query
4. Incolla il contenuto
5. Clicca su **"Run"**
6. ✅ Verifica che appaia "Success"

**Cosa crea:**
- Tabella `token_history` per audit trail completo
- Enum `token_transaction_type` per tipologie transazione
- Funzione `log_token_transaction()` per registrare automaticamente le transazioni
- Policy RLS per sicurezza

## ✅ Verifica Installazione

Dopo aver eseguito le migrazioni, verifica che tutto sia stato creato correttamente:

### Verifica Tabelle

Esegui questa query nel SQL Editor:

```sql
-- Verifica che tutte le tabelle esistano
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_tokens', 'token_history', 'user_subscriptions');
```

Dovresti vedere 2 o 3 righe (3 se hai eseguito anche la migrazione opzionale).

### Verifica Colonne user_tokens

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_tokens';
```

Dovresti vedere:
- `id` (uuid)
- `user_id` (uuid)
- `tokens` (bigint)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

### Verifica Colonne Stripe

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_subscriptions' 
  AND column_name LIKE 'stripe%';
```

Dovresti vedere:
- `stripe_customer_id` (character varying)
- `stripe_subscription_id` (character varying)

### Test Inserimento (Opzionale)

**⚠️ SOLO PER TEST:** Prova a inserire un record di test:

```sql
-- Sostituisci 'your-user-id' con un UUID di test
INSERT INTO user_tokens (user_id, tokens)
VALUES ('your-user-id'::uuid, 2500000)
ON CONFLICT (user_id) DO NOTHING;

-- Verifica
SELECT * FROM user_tokens WHERE user_id = 'your-user-id'::uuid;

-- Pulisci
DELETE FROM user_tokens WHERE user_id = 'your-user-id'::uuid;
```

## 🔄 Rollback

Se qualcosa va storto, ogni file di migrazione contiene una sezione **ROLLBACK** in fondo.

### Rollback Completo (inverso)

Esegui in ordine inverso:

```sql
-- 3. Rollback migrazione 003 (se eseguita)
DROP FUNCTION IF EXISTS log_token_transaction;
DROP TABLE IF EXISTS token_history CASCADE;
DROP TYPE IF EXISTS token_transaction_type CASCADE;

-- 2. Rollback migrazione 002
DROP INDEX IF EXISTS idx_user_subscriptions_stripe_subscription_unique;
DROP INDEX IF EXISTS idx_user_subscriptions_stripe_subscription;
DROP INDEX IF EXISTS idx_user_subscriptions_stripe_customer;
ALTER TABLE user_subscriptions DROP COLUMN IF EXISTS stripe_subscription_id;
ALTER TABLE user_subscriptions DROP COLUMN IF EXISTS stripe_customer_id;

-- 1. Rollback migrazione 001
DROP TRIGGER IF EXISTS user_tokens_updated_at_trigger ON user_tokens;
DROP FUNCTION IF EXISTS update_user_tokens_timestamp();
DROP TABLE IF EXISTS user_tokens CASCADE;
```

## 📊 Schema Tokens per Piano

| Piano | Credits | Tokens (×100) | Prezzo/Mese |
|-------|---------|---------------|-------------|
| STARTER | 25,000 | 2,500,000 | €249 |
| PRO | 100,000 | 10,000,000 | €999 |
| ELITE | 250,000 | 25,000,000 | €2,499 |
| VIP | Custom | Custom | Custom |

## 🔒 Sicurezza (RLS)

Tutte le tabelle hanno Row Level Security (RLS) abilitato:

- **user_tokens**: Gli utenti vedono solo i propri tokens, ma NON possono modificarli direttamente
- **token_history**: Gli utenti vedono solo il proprio storico, ma NON possono modificarlo
- Solo il **service_role** (backend) può inserire/aggiornare tokens

## 📞 Supporto

Se riscontri errori durante l'esecuzione:

1. Leggi attentamente il messaggio di errore
2. Verifica di aver eseguito le migrazioni nell'ordine corretto
3. Controlla che le tabelle prerequisite esistano
4. Se necessario, esegui il rollback e riprova

## 🎯 Prossimi Passi

Dopo aver completato le migrazioni:

1. ✅ Verifica che tutte le tabelle siano state create
2. ✅ Testa le query di verifica
3. ➡️ Procedi con l'implementazione del **tokens.service.ts**
4. ➡️ Configura le API Stripe
5. ➡️ Implementa il webhook Stripe

---

**Versione:** 1.0.0  
**Data:** 2026-01-08  
**Progetto:** Armonyco v2 - Sistema Abbonamenti con Tokens


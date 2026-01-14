-- ============================================================================
-- FIX DATABASE COLUMNS - Armonyco v2
-- ============================================================================
-- Esegui questo script in Supabase SQL Editor se necessario
-- ============================================================================

-- 1. Aggiungi colonna is_disabled alla tabella profiles (se non esiste)
-- ============================================================================
-- Questa colonna permette di disabilitare utenti senza eliminarli

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'is_disabled'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN is_disabled BOOLEAN DEFAULT false;
        
        COMMENT ON COLUMN public.profiles.is_disabled IS 
        'Flag per disabilitare l''accesso di un utente senza eliminare il suo account';
        
        RAISE NOTICE 'Column is_disabled added to profiles table';
    ELSE
        RAISE NOTICE 'Column is_disabled already exists in profiles table';
    END IF;
END $$;


-- ============================================================================
-- 2. Verifica Schema Tabella organization_members
-- ============================================================================
-- Assicurati che la tabella abbia i nomi colonna corretti

SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'organization_members'
ORDER BY ordinal_position;

-- EXPECTED OUTPUT:
-- column_name       | data_type | is_nullable | column_default
-- ===============================================================
-- id                | uuid      | NO          | gen_random_uuid()
-- organization_id   | uuid      | NO          | 
-- user_id           | uuid      | NO          | 
-- role              | text      | NO          | 
-- created_at        | timestamp | YES         | now()
-- updated_at        | timestamp | YES         | now()


-- ============================================================================
-- 3. Verifica Constraint sui Ruoli organization_members
-- ============================================================================
-- I ruoli devono essere: 'Admin', 'User', 'Collaborator' (con maiuscola)

SELECT
    con.conname AS constraint_name,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE nsp.nspname = 'public'
AND rel.relname = 'organization_members'
AND con.contype = 'c'; -- CHECK constraints


-- ============================================================================
-- 4. Aggiungi/Aggiorna CHECK Constraint per i Ruoli (se necessario)
-- ============================================================================
-- Se il constraint non esiste o ha valori sbagliati, ricrealo

-- Rimuovi vecchio constraint se esiste
ALTER TABLE public.organization_members 
DROP CONSTRAINT IF EXISTS organization_members_role_check;

-- Aggiungi nuovo constraint con i ruoli corretti
ALTER TABLE public.organization_members
ADD CONSTRAINT organization_members_role_check 
CHECK (role IN ('Admin', 'User', 'Collaborator'));

COMMENT ON CONSTRAINT organization_members_role_check ON public.organization_members IS
'Valid organization roles: Admin (amministratore), User (utente standard), Collaborator (collaboratore solo lettura)';


-- ============================================================================
-- 5. Verifica Ruoli Esistenti nella tabella profiles
-- ============================================================================
-- Mostra tutti i ruoli distinti attualmente nel database

SELECT 
    role,
    COUNT(*) as count,
    ARRAY_AGG(email ORDER BY email) as users
FROM public.profiles
GROUP BY role
ORDER BY count DESC;

-- EXPECTED ROLES:
-- - AppAdmin   (super amministratore applicazione)
-- - AppUser    (utente normale registrato)


-- ============================================================================
-- 6. Fix Ruoli Sbagliati in profiles (se necessario)
-- ============================================================================
-- Se ci sono utenti con ruoli vecchi ('Executive', 'Operator', etc.), correggili

-- Converti tutti 'Executive' → 'AppUser'
UPDATE public.profiles
SET role = 'AppUser', updated_at = NOW()
WHERE role = 'Executive';

-- Converti altri ruoli obsoleti → 'AppUser'
UPDATE public.profiles
SET role = 'AppUser', updated_at = NOW()
WHERE role NOT IN ('AppAdmin', 'AppUser');

-- Mostra il risultato
SELECT 
    'Profiles aggiornati' as status,
    role,
    COUNT(*) as count
FROM public.profiles
GROUP BY role
ORDER BY role;


-- ============================================================================
-- 7. Verifica Ruoli in organization_members
-- ============================================================================

SELECT 
    role,
    COUNT(*) as count
FROM public.organization_members
GROUP BY role
ORDER BY count DESC;

-- EXPECTED ROLES:
-- - Admin        (amministratore organizzazione)
-- - User         (utente standard organizzazione)
-- - Collaborator (collaboratore solo lettura)


-- ============================================================================
-- 8. Fix Ruoli organization_members (se necessario)
-- ============================================================================
-- Se ci sono ruoli con maiuscole sbagliate, correggili

-- Converti 'admin' → 'Admin'
UPDATE public.organization_members
SET role = 'Admin'
WHERE role = 'admin';

-- Converti 'user' → 'User'
UPDATE public.organization_members
SET role = 'User'
WHERE role = 'user';

-- Converti 'collaborator' → 'Collaborator'
UPDATE public.organization_members
SET role = 'Collaborator'
WHERE role = 'collaborator';


-- ============================================================================
-- 9. TEST: Verifica che tutto sia corretto
-- ============================================================================

-- Check profiles
SELECT 
    '✅ Profiles' as table_name,
    role,
    COUNT(*) as count
FROM public.profiles
GROUP BY role
ORDER BY role;

-- Check organization_members
SELECT 
    '✅ Organization Members' as table_name,
    role,
    COUNT(*) as count
FROM public.organization_members
GROUP BY role
ORDER BY role;


-- ============================================================================
-- 10. TEST: Simula inserimento in organization_members
-- ============================================================================
-- Verifica che i constraint funzionino correttamente

DO $$
DECLARE
    test_user_id uuid;
    test_org_id uuid;
BEGIN
    -- Prendi un utente e un'organizzazione esistenti per il test
    SELECT id INTO test_user_id FROM public.profiles LIMIT 1;
    SELECT id INTO test_org_id FROM public.organizations LIMIT 1;
    
    IF test_user_id IS NOT NULL AND test_org_id IS NOT NULL THEN
        RAISE NOTICE 'Testing insert with role Admin...';
        
        -- Test insert (poi rollback)
        BEGIN
            INSERT INTO public.organization_members (user_id, organization_id, role)
            VALUES (test_user_id, test_org_id, 'Admin')
            ON CONFLICT DO NOTHING;
            
            RAISE NOTICE '✅ Insert with Admin role succeeded';
            ROLLBACK;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '❌ Insert failed: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE '⚠️ No test data available';
    END IF;
END $$;


-- ============================================================================
-- SUMMARY
-- ============================================================================
/*
Dopo aver eseguito questo script:

1. ✅ Colonna is_disabled aggiunta a profiles
2. ✅ Constraint sui ruoli organization_members verificato/corretto
3. ✅ Ruoli profiles aggiornati: AppAdmin, AppUser
4. ✅ Ruoli organization_members aggiornati: Admin, User, Collaborator

NOMI COLONNE CORRETTI:
- organization_members.user_id (CON underscore)
- organization_members.organization_id (CON underscore)

RUOLI CORRETTI:
- profiles.role: 'AppAdmin', 'AppUser' (CamelCase)
- organization_members.role: 'Admin', 'User', 'Collaborator' (Capitalized)
*/

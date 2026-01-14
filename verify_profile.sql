-- ============================================
-- Script di Verifica Profile
-- ============================================
-- Esegui queste query su Supabase per verificare il problema

-- ============================================
-- 1. TROVA L'UTENTE PER EMAIL
-- ============================================
-- Sostituisci 'your-email@example.com' con l'email che usi per il login
SELECT 
    id as user_id,
    email,
    created_at
FROM auth.users
WHERE email = 'your-email@example.com';

-- Nota: Copia l'ID dell'utente dalla query sopra e usalo nelle query seguenti


-- ============================================
-- 2. VERIFICA SE IL PROFILE ESISTE
-- ============================================
-- Sostituisci 'USER_ID_QUI' con l'ID copiato dalla query 1
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    created_at,
    updated_at
FROM profiles
WHERE id = 'USER_ID_QUI';

-- Cosa cercare:
-- - Se non ritorna righe → IL PROFILE NON ESISTE (problema grave!)
-- - Se role è NULL → IL ROLE NON È IMPOSTATO
-- - Se role è diverso da 'AppAdmin' → IL ROLE È SBAGLIATO


-- ============================================
-- 3. VERIFICA DETTAGLIATA DEL ROLE
-- ============================================
-- Questa query mostra il valore esatto del role con dettagli extra
SELECT 
    id,
    email,
    role,
    LENGTH(role) as role_length,              -- Lunghezza della stringa (utile per trovare spazi)
    role = 'AppAdmin' as is_exactly_app_admin, -- True se è esattamente 'AppAdmin'
    TRIM(role) as role_trimmed,               -- Role senza spazi
    LOWER(role) as role_lowercase              -- Role in minuscolo
FROM profiles
WHERE id = 'USER_ID_QUI';

-- Cosa cercare:
-- - role_length dovrebbe essere 8 (lunghezza di 'AppAdmin')
-- - is_exactly_app_admin dovrebbe essere TRUE
-- - Se role_length è > 8 → ci sono spazi bianchi extra


-- ============================================
-- 4. CERCA TUTTI GLI APP ADMIN
-- ============================================
-- Mostra tutti gli utenti che dovrebbero essere AppAdmin
SELECT 
    id,
    email,
    role,
    created_at
FROM profiles
WHERE role = 'AppAdmin'
   OR role ILIKE '%admin%';

-- Se non trovi nessuno, NESSUN utente è AppAdmin!


-- ============================================
-- 5. VEDI TUTTI I ROLE ESISTENTI
-- ============================================
-- Mostra tutti i valori unici del campo role
SELECT 
    role,
    COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY count DESC;

-- Questo ti dice quali role esistono nel sistema


-- ============================================
-- 6. FIX: IMPOSTA ROLE A 'AppAdmin'
-- ============================================
-- ⚠️ ESEGUI QUESTA QUERY SOLO SE VUOI CAMBIARE IL ROLE
-- Sostituisci 'USER_ID_QUI' con l'ID del tuo utente
/*
UPDATE profiles
SET 
    role = 'AppAdmin',
    updated_at = NOW()
WHERE id = 'USER_ID_QUI';
*/

-- Dopo aver eseguito l'UPDATE, verifica con la query 2


-- ============================================
-- 7. FIX: CREA IL PROFILE SE NON ESISTE
-- ============================================
-- ⚠️ ESEGUI QUESTA QUERY SOLO SE IL PROFILE NON ESISTE
-- Sostituisci i valori tra 'apici'
/*
INSERT INTO profiles (id, email, first_name, last_name, role, created_at, updated_at)
VALUES (
    'USER_ID_QUI',
    'your-email@example.com',
    'Nome',
    'Cognome',
    'AppAdmin',
    NOW(),
    NOW()
);
*/

-- Dopo aver eseguito l'INSERT, verifica con la query 2


-- ============================================
-- 8. VERIFICA RLS (Row Level Security)
-- ============================================
-- Mostra le policy RLS sulla tabella profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'profiles';

-- Se ci sono policy SELECT restrittive, potrebbero bloccare la lettura del profile


-- ============================================
-- 9. VERIFICA STRUTTURA TABELLA
-- ============================================
-- Mostra la struttura della tabella profiles
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Verifica che la colonna 'role' esista e sia di tipo TEXT o VARCHAR


-- ============================================
-- 10. TEST COMPLETO
-- ============================================
-- Questa query combina auth.users e profiles
SELECT 
    u.id,
    u.email as auth_email,
    u.created_at as auth_created_at,
    p.email as profile_email,
    p.role as profile_role,
    p.created_at as profile_created_at,
    CASE 
        WHEN p.id IS NULL THEN '❌ Profile mancante'
        WHEN p.role IS NULL THEN '⚠️ Role NULL'
        WHEN p.role = 'AppAdmin' THEN '✅ AppAdmin OK'
        ELSE '⚠️ Role: ' || p.role
    END as status
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'your-email@example.com';

-- Questo ti dà una vista completa dello stato dell'utente

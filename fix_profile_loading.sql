-- ============================================
-- Script per Fix Profile Loading Issue
-- ============================================
-- Esegui queste query su Supabase per verificare e risolvere il problema

-- ============================================
-- 1. VERIFICA UTENTE SPECIFICO (dal log: fe0b3bd4-e18e-4a28-b368-dcc0d1e02eea)
-- ============================================
SELECT 
    id,
    email,
    role,
    first_name,
    last_name,
    created_at
FROM public.profiles
WHERE id = 'fe0b3bd4-e18e-4a28-b368-dcc0d1e02eea';

-- Se NON ritorna nessun record → IL PROFILE NON ESISTE!


-- ============================================
-- 2. VERIFICA EMAIL NELL'AUTH
-- ============================================
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
WHERE id = 'fe0b3bd4-e18e-4a28-b368-dcc0d1e02eea';


-- ============================================
-- 3. CREA PROFILE SE MANCANTE
-- ============================================
-- ⚠️ Esegui SOLO se il profile non esiste (query 1 ritorna 0 righe)
INSERT INTO public.profiles (id, email, role, first_name, last_name, created_at, updated_at)
SELECT 
    u.id,
    u.email,
    'AppAdmin' as role,  -- Imposta come AppAdmin
    '' as first_name,
    '' as last_name,
    NOW() as created_at,
    NOW() as updated_at
FROM auth.users u
WHERE u.id = 'fe0b3bd4-e18e-4a28-b368-dcc0d1e02eea'
ON CONFLICT (id) DO UPDATE
SET 
    role = 'AppAdmin',
    updated_at = NOW();


-- ============================================
-- 4. AGGIORNA ROLE SE PROFILE ESISTE MA ROLE È SBAGLIATO
-- ============================================
-- ⚠️ Esegui SOLO se vuoi cambiare il role a AppAdmin
UPDATE public.profiles
SET 
    role = 'AppAdmin',
    updated_at = NOW()
WHERE id = 'fe0b3bd4-e18e-4a28-b368-dcc0d1e02eea';


-- ============================================
-- 5. VERIFICA CHE IL FIX SIA ANDATO A BUON FINE
-- ============================================
SELECT 
    id,
    email,
    role,
    role = 'AppAdmin' as is_app_admin,
    LENGTH(role) as role_length
FROM public.profiles
WHERE id = 'fe0b3bd4-e18e-4a28-b368-dcc0d1e02eea';

-- Verifica che:
-- - is_app_admin = true
-- - role_length = 8


-- ============================================
-- 6. VERIFICA RLS (Row Level Security)
-- ============================================
-- Controlla se RLS è abilitato sulla tabella profiles
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'profiles';

-- Se rls_enabled = true, verifica le policy:
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles';


-- ============================================
-- 7. DISABILITA RLS TEMPORANEAMENTE (se necessario)
-- ============================================
-- ⚠️ Esegui SOLO se RLS sta bloccando la query e vuoi testare
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;


-- ============================================
-- 8. AGGIUNGI POLICY PER LEGGERE PROPRIO PROFILE (se necessario)
-- ============================================
-- Permette agli utenti di leggere il proprio profile
CREATE POLICY "Users can view own profile" 
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Permette agli utenti di aggiornare il proprio profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);


-- ============================================
-- 9. TEST COMPLETO - Vista Combinata
-- ============================================
SELECT 
    u.id,
    u.email as auth_email,
    u.created_at as auth_created,
    p.email as profile_email,
    p.role as profile_role,
    p.created_at as profile_created,
    CASE 
        WHEN p.id IS NULL THEN '❌ Profile MANCANTE'
        WHEN p.role IS NULL THEN '⚠️ Role NULL'
        WHEN p.role = 'AppAdmin' THEN '✅ AppAdmin OK'
        ELSE '⚠️ Role: ' || p.role
    END as status
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.id = 'fe0b3bd4-e18e-4a28-b368-dcc0d1e02eea';


-- ============================================
-- 10. VERIFICA TUTTI I PROFILES (per debug generale)
-- ============================================
SELECT 
    p.id,
    p.email,
    p.role,
    CASE 
        WHEN p.role = 'AppAdmin' THEN '✅ AppAdmin'
        WHEN p.role IS NULL THEN '⚠️ NULL'
        ELSE '📋 ' || p.role
    END as role_status
FROM public.profiles p
ORDER BY p.created_at DESC
LIMIT 10;


-- ============================================
-- 11. CREA PROFILE PER TUTTI GLI UTENTI SENZA PROFILE
-- ============================================
-- ⚠️ Esegui per creare profiles per tutti gli utenti che non ce l'hanno
-- (con role 'User' di default)
INSERT INTO public.profiles (id, email, role, first_name, last_name, created_at, updated_at)
SELECT 
    u.id,
    u.email,
    'User' as role,  -- Role di default
    '' as first_name,
    '' as last_name,
    NOW() as created_at,
    NOW() as updated_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

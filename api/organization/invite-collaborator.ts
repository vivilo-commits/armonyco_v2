import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[Invite] Request received:', req.method);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verifica variabili ambiente
    if (!process.env.VITE_SUPABASE_URL) {
      console.error('[Invite] Missing VITE_SUPABASE_URL');
      return res.status(500).json({ error: 'Server configuration error: Missing SUPABASE_URL' });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[Invite] Missing SUPABASE_SERVICE_ROLE_KEY');
      return res.status(500).json({ error: 'Server configuration error: Missing SERVICE_ROLE_KEY' });
    }

    // Crea client Supabase
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { email, firstName, lastName, phone, organizationId } = req.body;

    console.log('[Invite] Request data:', { 
      email, 
      firstName, 
      lastName, 
      phone: phone || 'not provided',
      organizationId 
    });

    // Validazione
    if (!email || !firstName || !lastName || !organizationId) {
      console.error('[Invite] Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['email', 'firstName', 'lastName', 'organizationId'],
        received: { email: !!email, firstName: !!firstName, lastName: !!lastName, organizationId: !!organizationId }
      });
    }

    // Verifica formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // 1. Verifica se l'utente esiste già
    console.log('[Invite] Checking if user exists...');
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      console.log('[Invite] User already exists:', existingUser.id);
      return res.status(409).json({ 
        error: 'User with this email already exists',
        userId: existingUser.id 
      });
    }

    // 2. Genera password temporanea sicura
    const tempPassword = 
      Math.random().toString(36).slice(-8) + 
      Math.random().toString(36).slice(-8) +
      'Aa1!'; // Assicura requisiti password
    
    console.log('[Invite] Creating auth user...');

    // 3. Crea utente in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        firstName,
        lastName,
        phone: phone || '',
        mustChangePassword: true,
      },
    });

    if (authError) {
      console.error('[Invite] Auth error:', authError);
      return res.status(500).json({ 
        error: 'Failed to create user authentication',
        details: authError.message 
      });
    }

    console.log('[Invite] Auth user created:', authData.user.id);

    // 4. Crea profilo
    console.log('[Invite] Creating profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || '',
        role: 'AppUser',
        credits: 0,
      });

    if (profileError) {
      console.error('[Invite] Profile error:', profileError);
      // Rollback: elimina utente auth se fallisce profile
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ 
        error: 'Failed to create user profile',
        details: profileError.message 
      });
    }

    console.log('[Invite] Profile created');

    // 5. Aggiungi a organization_members
    console.log('[Invite] Adding to organization:', organizationId);
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        user_id: authData.user.id,
        organization_id: organizationId,
        role: 'Collaborator',
      });

    if (memberError) {
      console.error('[Invite] Member error:', memberError);
      // Rollback: elimina utente e profile
      await supabase.auth.admin.deleteUser(authData.user.id);
      await supabase.from('profiles').delete().eq('id', authData.user.id);
      return res.status(500).json({ 
        error: 'Failed to add user to organization',
        details: memberError.message 
      });
    }

    console.log('[Invite] ✅ Collaborator added successfully');

    return res.status(200).json({
      success: true,
      message: 'Collaborator invited successfully',
      user: {
        id: authData.user.id,
        email,
        firstName,
        lastName,
      },
      tempPassword,
    });

  } catch (error: any) {
    console.error('[Invite] Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Permetti CORS per sviluppo locale
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Usa SERVICE ROLE per bypassare RLS
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { email, firstName, lastName, phone, organizationId } = req.body;

  console.log('[Invite] Received request:', { email, firstName, lastName, organizationId });

  try {
    // Validazione
    if (!email || !firstName || !lastName || !organizationId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Genera password temporanea
    const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
    
    console.log('[Invite] Creating user in auth...');

    // 2. Crea utente in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Auto-conferma email
      user_metadata: {
        firstName,
        lastName,
        phone: phone || '',
        mustChangePassword: true,
      },
    });

    if (authError) {
      console.error('[Invite] Auth error:', authError);
      throw new Error(`Failed to create user: ${authError.message}`);
    }

    console.log('[Invite] User created:', authData.user.id);

    // 3. Crea profilo
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
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }

    console.log('[Invite] Profile created');

    // 4. Aggiungi a organization_members
    console.log('[Invite] Adding to organization...');
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        user_id: authData.user.id,
        organization_id: organizationId,
        role: 'Collaborator',
      });

    if (memberError) {
      console.error('[Invite] Member error:', memberError);
      throw new Error(`Failed to add to organization: ${memberError.message}`);
    }

    console.log('[Invite] Collaborator added successfully');

    // 5. TODO: Invia email con credenziali
    // await sendInviteEmail(email, tempPassword);

    return res.status(200).json({
      success: true,
      message: 'Collaborator invited successfully',
      user: {
        id: authData.user.id,
        email,
        firstName,
        lastName,
      },
      tempPassword, // Restituisci password temporanea
    });

  } catch (error: any) {
    console.error('[Invite] Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to invite collaborator',
      details: error.toString(),
    });
  }
}

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Extract path parameter
    const { organizationId } = req.query;
    const activeOnly = req.query.activeOnly !== 'false'; // Default true

    console.log('[API] Received organizationId:', organizationId);

    if (!organizationId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing organizationId' 
      });
    }

    // 1. Verify organization exists
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('id', organizationId as string)
      .single();

    if (orgError || !organization) {
      console.error('[API] Organization not found:', orgError);
      return res.status(404).json({ 
        success: false, 
        error: 'Organization not found' 
      });
    }

    // 2. Get hotels for organization
    let query = supabase
      .from('organization_hotels')
      .select(`
        id,
        hotel_name,
        hotel_id_in_pms,
        property_code,
        city,
        country,
        is_active,
        sync_enabled,
        last_sync_at,
        created_at
      `)
      .eq('organization_id', organizationId as string)
      .order('hotel_name', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data: hotels, error: hotelsError } = await query;

    if (hotelsError) {
      console.error('[API] Hotels error:', hotelsError);
      throw hotelsError;
    }

    // 3. Format response
    const formattedHotels = hotels?.map(hotel => ({
      id: hotel.id,
      hotelName: hotel.hotel_name,
      hotelIdInPms: hotel.hotel_id_in_pms,
      propertyCode: hotel.property_code,
      city: hotel.city,
      country: hotel.country,
      isActive: hotel.is_active,
      syncEnabled: hotel.sync_enabled,
      lastSyncAt: hotel.last_sync_at,
      createdAt: hotel.created_at
    })) || [];

    console.log('[API] Success - returning', formattedHotels.length, 'hotels');

    return res.status(200).json({
      success: true,
      data: {
        organizationId: organizationId as string,
        organizationName: organization.name,
        totalHotels: formattedHotels.length,
        hotels: formattedHotels
      }
    });

  } catch (error: any) {
    console.error('[API] Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

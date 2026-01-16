import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
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
    const { organizationId } = req.query;
    const activeOnly = req.query.activeOnly !== 'false';

    if (!organizationId || typeof organizationId !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing or invalid organizationId query parameter' 
      });
    }

    // Verify organization exists
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('id', organizationId)
      .single();

    if (orgError || !organization) {
      return res.status(404).json({ 
        success: false, 
        error: 'Organization not found' 
      });
    }

    // Get hotels
    let query = supabase
      .from('organization_hotels')
      .select('*')
      .eq('organization_id', organizationId)
      .order('hotel_name', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data: hotels, error: hotelsError } = await query;

    if (hotelsError) throw hotelsError;

    const formattedHotels = hotels?.map(h => ({
      id: h.id,
      hotelName: h.hotel_name,
      hotelIdInPms: h.hotel_id_in_pms,
      propertyCode: h.property_code,
      city: h.city,
      country: h.country,
      isActive: h.is_active,
      syncEnabled: h.sync_enabled,
      lastSyncAt: h.last_sync_at,
      createdAt: h.created_at
    })) || [];

    return res.status(200).json({
      success: true,
      data: {
        organizationId,
        organizationName: organization.name,
        totalHotels: formattedHotels.length,
        hotels: formattedHotels
      }
    });

  } catch (error: any) {
    console.error('[API hotels] Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error'
    });
  }
}

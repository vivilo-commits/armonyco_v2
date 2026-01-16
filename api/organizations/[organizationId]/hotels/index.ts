import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Verify environment variables
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[API] Missing environment variables');
    return res.status(500).json({ 
      success: false, 
      error: 'Server configuration error: Missing environment variables' 
    });
  }

  // Create Supabase client
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    const { organizationId } = req.query;
    const activeOnly = req.query.activeOnly !== 'false'; // Default true

    // Validate parameters
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
      if (orgError?.code === 'PGRST116') {
        return res.status(404).json({ 
          success: false, 
          error: 'Organization not found' 
        });
      }
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

    // Filter active only if requested
    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data: hotels, error: hotelsError } = await query;

    if (hotelsError) {
      // Don't throw if table doesn't exist yet
      if (hotelsError.code === 'PGRST116' || hotelsError.code === '42P01') {
        return res.status(200).json({
          success: true,
          data: {
            organizationId: organizationId as string,
            organizationName: organization.name,
            totalHotels: 0,
            hotels: []
          }
        });
      }
      throw hotelsError;
    }

    // 3. Format response
    const formattedHotels = hotels?.map(hotel => ({
      id: hotel.id,
      hotelName: hotel.hotel_name,
      hotelIdInPms: hotel.hotel_id_in_pms,
      propertyCode: hotel.property_code || null,
      city: hotel.city || null,
      country: hotel.country || null,
      isActive: hotel.is_active,
      syncEnabled: hotel.sync_enabled || false,
      lastSyncAt: hotel.last_sync_at || null,
      createdAt: hotel.created_at
    })) || [];

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
    console.error('[API] Error in get organization hotels:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

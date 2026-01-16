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
    const { organizationId, hotelId } = req.query;

    // Validate parameters
    if (!organizationId || !hotelId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing organizationId or hotelId' 
      });
    }

    // 1. Verify hotel belongs to organization
    const { data: hotel, error: hotelError } = await supabase
      .from('organization_hotels')
      .select('id, hotel_name, organization_id')
      .eq('id', hotelId as string)
      .eq('organization_id', organizationId as string)
      .single();

    if (hotelError || !hotel) {
      if (hotelError?.code === 'PGRST116') {
        return res.status(404).json({ 
          success: false, 
          error: 'Hotel not found' 
        });
      }
      return res.status(404).json({ 
        success: false, 
        error: 'Hotel not found or does not belong to this organization' 
      });
    }

    // 2. Get active products for this hotel
    const { data: activations, error: activationsError } = await supabase
      .from('hotel_product_activations')
      .select(`
        status,
        activated_at,
        products (
          id,
          code,
          name,
          description,
          category
        )
      `)
      .eq('hotel_id', hotelId as string)
      .eq('status', 'active');

    if (activationsError) {
      // Don't throw if table doesn't exist yet
      if (activationsError.code === 'PGRST116' || activationsError.code === '42P01') {
        return res.status(200).json({
          success: true,
          data: {
            organizationId: organizationId as string,
            hotelId: hotelId as string,
            hotelName: hotel.hotel_name,
            products: []
          }
        });
      }
      throw activationsError;
    }

    // 3. Format response
    const products = activations?.map((activation: any) => {
      const product = activation.products;
      if (!product) return null;
      
      return {
        id: product.id,
        code: product.code,
        name: product.name,
        description: product.description || '',
        category: product.category,
        status: activation.status,
        activatedAt: activation.activated_at
      };
    }).filter((p: any) => p !== null) || [];

    return res.status(200).json({
      success: true,
      data: {
        organizationId: organizationId as string,
        hotelId: hotelId as string,
        hotelName: hotel.hotel_name,
        products
      }
    });

  } catch (error: any) {
    console.error('[API] Error in get hotel products:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

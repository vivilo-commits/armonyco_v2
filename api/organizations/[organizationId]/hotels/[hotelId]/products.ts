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
    // Extract path parameters from query (Vercel puts them there)
    const { organizationId, hotelId } = req.query;

    console.log('[API] Received params:', { organizationId, hotelId });

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
      console.error('[API] Hotel not found:', hotelError);
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
      console.error('[API] Activations error:', activationsError);
      throw activationsError;
    }

    // 3. Format response
    const products = activations?.map((activation: any) => {
      if (!activation.products) return null;
      return {
        id: activation.products.id,
        code: activation.products.code,
        name: activation.products.name,
        description: activation.products.description || '',
        category: activation.products.category,
        status: activation.status,
        activatedAt: activation.activated_at
      };
    }).filter((p: any) => p !== null) || [];

    console.log('[API] Success - returning', products.length, 'products');

    return res.status(200).json({
      success: true,
      data: {
        organizationId: organizationId as string,
        hotelId: hotelId as string,
        hotelName: hotel.hotel_name,
        productsCount: products.length,
        products
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

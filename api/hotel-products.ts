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
    const { organizationId, hotelId } = req.query;

    if (!organizationId || typeof organizationId !== 'string' ||
        !hotelId || typeof hotelId !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing or invalid organizationId or hotelId query parameters' 
      });
    }

    // Verify hotel belongs to organization
    const { data: hotel, error: hotelError } = await supabase
      .from('organization_hotels')
      .select('id, hotel_name, organization_id')
      .eq('id', hotelId)
      .eq('organization_id', organizationId)
      .single();

    if (hotelError || !hotel) {
      return res.status(404).json({ 
        success: false, 
        error: 'Hotel not found or does not belong to organization' 
      });
    }

    // Get active products
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
      .eq('hotel_id', hotelId)
      .eq('status', 'active');

    if (activationsError) throw activationsError;

    const products = activations?.map((a: any) => {
      if (!a.products) return null;
      return {
        id: a.products.id,
        code: a.products.code,
        name: a.products.name,
        description: a.products.description || '',
        category: a.products.category,
        status: a.status,
        activatedAt: a.activated_at
      };
    }).filter((p: any) => p !== null) || [];

    return res.status(200).json({
      success: true,
      data: {
        organizationId,
        hotelId,
        hotelName: hotel.hotel_name,
        productsCount: products.length,
        products
      }
    });

  } catch (error: any) {
    console.error('[API hotel-products] Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error'
    });
  }
}

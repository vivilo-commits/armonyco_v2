import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * API Endpoint: Check if user has active product
 * 
 * GET /api/user/has-product?userId=xxx&productId=yyy
 * 
 * Response:
 * {
 *   "hasFeature": boolean,
 *   "status": "active" | "paused" | "inactive" | "not_activated",
 *   "userId": string,
 *   "productId": string
 * }
 */
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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, productId } = req.query;

  if (!userId || !productId) {
    return res.status(400).json({ 
      error: 'Missing required parameters: userId and productId' 
    });
  }

  try {
    const { data, error } = await supabase
      .from('user_product_activations')
      .select('status')
      .eq('user_id', userId as string)
      .eq('product_id', productId as string)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('[API] Error checking user product:', error);
      throw error;
    }

    const hasFeature = data?.status === 'active';
    const status = data?.status || 'not_activated';

    return res.status(200).json({ 
      hasFeature,
      status,
      userId,
      productId,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('[API] Error in has-product endpoint:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

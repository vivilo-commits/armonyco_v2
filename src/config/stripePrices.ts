/**
 * Stripe Price ID Mapping
 * 
 * Maps subscription plan IDs to their corresponding Stripe Price IDs.
 * These Price IDs must be created in the Stripe Dashboard first.
 * 
 * To update:
 * 1. Create a Price in Stripe Dashboard
 * 2. Copy the Price ID (format: price_xxxxx)
 * 3. Add or update the mapping below
 */

export const STRIPE_PRICE_IDS: Record<number, string> = {
  1: 'price_starter_monthly',   // Starter Plan - €249/month
  2: 'price_pro_monthly',       // Pro Plan - €999/month
  3: 'price_elite_monthly',     // Elite Plan - €2499/month
  4: 'price_vip_monthly',       // VIP Plan - Custom pricing
};

/**
 * Get Stripe Price ID for a given plan ID
 * @param planId - The subscription plan ID from database
 * @returns Stripe Price ID or null if not found
 */
export function getStripePriceId(planId: number): string | null {
  return STRIPE_PRICE_IDS[planId] || null;
}

/**
 * Check if a plan has a valid Stripe Price ID configured
 * @param planId - The subscription plan ID from database
 * @returns True if price ID is configured
 */
export function hasPriceIdConfigured(planId: number): boolean {
  return planId in STRIPE_PRICE_IDS && STRIPE_PRICE_IDS[planId] !== null;
}

/**
 * Get all configured plan IDs
 * @returns Array of plan IDs that have Stripe Price IDs configured
 */
export function getConfiguredPlanIds(): number[] {
  return Object.keys(STRIPE_PRICE_IDS).map(Number);
}

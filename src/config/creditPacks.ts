/**
 * ========================================
 * CONFIGURATION: Credit Packs
 * ========================================
 * 
 * Available credit packs for one-time purchase
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to Stripe Dashboard → Products
 * 2. Create a Product for each pack:
 *    - Type: One-time
 *    - Name: "5,000 ArmoCredits"
 *    - Price: €49
 * 3. Copy the Price ID (format: price_xxxxx)
 * 4. Replace the placeholder IDs below
 * 5. Add to .env file (optional, for production)
 */

export interface CreditPack {
  id: number;
  name: string;
  credits: number;
  price: number;
  stripePriceId: string;
  description: string;
  popular?: boolean;
  bonus?: number; // Bonus credits (e.g., buy 10k, get +1k bonus)
  discount?: number; // Discount percentage
}

/**
 * Available credit packs for purchase
 * 
 * NOTE: Update Stripe Price IDs after creating products in Stripe Dashboard
 */
export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 1,
    name: 'Starter Pack',
    credits: 5000,
    price: 49,
    stripePriceId: process.env.VITE_STRIPE_PRICE_5K || 'price_5k_credits_test',
    description: '5,000 ArmoCredits',
  },
  {
    id: 2,
    name: 'Popular Pack',
    credits: 10000,
    price: 89,
    stripePriceId: process.env.VITE_STRIPE_PRICE_10K || 'price_10k_credits_test',
    description: '10,000 ArmoCredits',
    popular: true,
    bonus: 1000, // Get 11k total
    discount: 10, // 10% off per credit
  },
  {
    id: 3,
    name: 'Professional Pack',
    credits: 25000,
    price: 199,
    stripePriceId: process.env.VITE_STRIPE_PRICE_25K || 'price_25k_credits_test',
    description: '25,000 ArmoCredits',
    bonus: 3000, // Get 28k total
    discount: 15, // 15% off per credit
  },
  {
    id: 4,
    name: 'Enterprise Pack',
    credits: 50000,
    price: 349,
    stripePriceId: process.env.VITE_STRIPE_PRICE_50K || 'price_50k_credits_test',
    description: '50,000 ArmoCredits',
    bonus: 10000, // Get 60k total
    discount: 20, // 20% off per credit
  }
];

/**
 * Find pack by ID
 */
export function getCreditPackById(id: number): CreditPack | undefined {
  return CREDIT_PACKS.find(pack => pack.id === id);
}

/**
 * Find pack by Stripe Price ID
 */
export function getCreditPackByStripeId(stripePriceId: string): CreditPack | undefined {
  return CREDIT_PACKS.find(pack => pack.stripePriceId === stripePriceId);
}

/**
 * Calculate total credits including bonus
 */
export function getTotalCredits(pack: CreditPack): number {
  return pack.credits + (pack.bonus || 0);
}

/**
 * Calculate price per credit (in cents)
 */
export function getPricePerCredit(pack: CreditPack): number {
  const totalCredits = getTotalCredits(pack);
  return (pack.price * 100) / totalCredits; // Price in cents per credit
}

/**
 * Get all packs sorted by price
 */
export function getAllCreditPacksSorted(): CreditPack[] {
  return [...CREDIT_PACKS].sort((a, b) => a.price - b.price);
}

/**
 * Check if pack has bonus
 */
export function hasBonus(pack: CreditPack): boolean {
  return !!pack.bonus && pack.bonus > 0;
}

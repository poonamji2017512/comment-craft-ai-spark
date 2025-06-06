
// Centralized configuration for Dodo Payments integration
export const DODO_CONFIG = {
  // Product IDs from Dodo Payments
  PRODUCT_IDS: {
    PRO: {
      monthly: 'pdt_nYgdsmbwvDujGIBBlA9LE',
      yearly: 'pdt_YQbqHvroDI6wJrRhBkEwj'
    },
    ULTRA: {
      monthly: 'pdt_APpHuTy5eP3DqNcs0WYR7',
      yearly: 'pdt_WAhDE7ydq4emw3hRu1dgp'
    }
  },
  
  // Pricing information (in USD)
  PRICING: {
    PRO: {
      monthly: 20,
      yearly: 192 // 20% discount
    },
    ULTRA: {
      monthly: 40,
      yearly: 384 // 20% discount
    }
  },
  
  // Trial configuration
  TRIAL: {
    enabled: true,
    period_days: 3
  },
  
  // API configuration - Updated to use correct endpoint
  API: {
    base_url: 'https://live.dodopayments.com',
    timeout: 30000
  }
};

export type PlanType = 'PRO' | 'ULTRA';
export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing';

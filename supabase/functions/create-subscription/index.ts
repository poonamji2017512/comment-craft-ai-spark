
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateSubscriptionRequest {
  planType: 'PRO' | 'ULTRA';
  billingCycle: 'monthly' | 'yearly';
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Updated Product ID mapping - these should match your Dodo dashboard
const PRODUCT_IDS = {
  PRO: {
    monthly: 'price_pro_monthly',
    yearly: 'price_pro_yearly'
  },
  ULTRA: {
    monthly: 'price_ultra_monthly', 
    yearly: 'price_ultra_yearly'
  }
};

// Correct Dodo Payments API base URL
const DODO_API_BASE = 'https://api.dodo.dev/v1';

async function dodoRequest(endpoint: string, options: RequestInit = {}) {
  const apiKey = Deno.env.get('DODO_PAYMENTS_SECRET_KEY');
  if (!apiKey) {
    throw new Error('DODO_PAYMENTS_SECRET_KEY not configured');
  }

  console.log(`Making request to: ${DODO_API_BASE}${endpoint}`);
  console.log('Request options:', JSON.stringify({
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body
  }, null, 2));

  const response = await fetch(`${DODO_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });

  console.log(`Response status: ${response.status}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Dodo API error: ${response.status} ${errorText}`);
    throw new Error(`Dodo API error: ${response.status} ${errorText}`);
  }

  const responseData = await response.json();
  console.log('Response data:', JSON.stringify(responseData, null, 2));
  return responseData;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Unauthorized');
    }

    const { planType, billingCycle }: CreateSubscriptionRequest = await req.json();

    console.log('Creating subscription for user:', user.id, 'Plan:', planType, 'Cycle:', billingCycle);

    // Get or create customer in Dodo Payments
    let dodoCustomerId: string;
    
    // Check if user already has a Dodo customer ID
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('dodo_customer_id')
      .eq('user_id', user.id)
      .single();

    if (existingSubscription?.dodo_customer_id) {
      dodoCustomerId = existingSubscription.dodo_customer_id;
      console.log('Using existing customer ID:', dodoCustomerId);
    } else {
      // Create new customer in Dodo Payments with correct format
      console.log('Creating new customer for:', user.email);
      
      const customerData = {
        email: user.email!,
        name: user.user_metadata?.full_name || user.email!.split('@')[0],
      };
      
      console.log('Customer data:', JSON.stringify(customerData, null, 2));
      
      const customer = await dodoRequest('/customers', {
        method: 'POST',
        body: JSON.stringify(customerData),
      });
      
      dodoCustomerId = customer.id;
      console.log('Created new customer:', dodoCustomerId);
    }

    // Get the product ID for the selected plan
    const productId = PRODUCT_IDS[planType][billingCycle];
    console.log('Using product ID:', productId);

    // Create subscription in Dodo Payments with correct format
    const subscriptionData = {
      customer_id: dodoCustomerId,
      price_id: productId,
      payment_behavior: 'default_incomplete',
      success_url: `${req.headers.get('origin')}/settings?tab=billing&success=true`,
      cancel_url: `${req.headers.get('origin')}/settings?tab=billing&canceled=true`,
    };

    console.log('Subscription data:', JSON.stringify(subscriptionData, null, 2));

    const subscription = await dodoRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });

    console.log('Dodo subscription created:', subscription.id);

    // Store subscription in our database
    const { error: dbError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        dodo_customer_id: dodoCustomerId,
        dodo_subscription_id: subscription.id,
        plan_type: planType,
        billing_cycle: billingCycle,
        status: subscription.status,
        current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null,
        current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store subscription');
    }

    // Return checkout URL or subscription details
    const result = {
      subscriptionId: subscription.id,
      status: subscription.status,
      checkoutUrl: subscription.checkout_url || null,
      clientSecret: subscription.client_secret || null,
    };

    console.log('Returning result:', JSON.stringify(result, null, 2));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

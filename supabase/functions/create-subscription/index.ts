
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

// Product ID mapping
const PRODUCT_IDS = {
  PRO: {
    monthly: 'pdt_nYgdsmbwvDujGIBBlA9LE',
    yearly: 'pdt_YQbqHvroDI6wJrRhBkEwj'
  },
  ULTRA: {
    monthly: 'pdt_APpHuTy5eP3DqNcs0WYR7',
    yearly: 'pdt_WAhDE7ydq4emw3hRu1dgp'
  }
};

const DODO_API_BASE = 'https://api.dodopayments.com/v1';

async function dodoRequest(endpoint: string, options: RequestInit = {}) {
  const apiKey = Deno.env.get('DODO_PAYMENTS_SECRET_KEY');
  if (!apiKey) {
    throw new Error('DODO_PAYMENTS_SECRET_KEY not configured');
  }

  console.log(`Making request to: ${DODO_API_BASE}${endpoint}`);

  const response = await fetch(`${DODO_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Dodo API error: ${response.status} ${error}`);
    throw new Error(`Dodo API error: ${response.status} ${error}`);
  }

  return response.json();
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
      // Create new customer in Dodo Payments
      console.log('Creating new customer for:', user.email);
      const customer = await dodoRequest('/customers', {
        method: 'POST',
        body: JSON.stringify({
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!,
        }),
      });
      dodoCustomerId = customer.id;
      console.log('Created new customer:', dodoCustomerId);
    }

    // Get the product ID for the selected plan
    const productId = PRODUCT_IDS[planType][billingCycle];
    console.log('Using product ID:', productId);

    // Create subscription in Dodo Payments
    const subscription = await dodoRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        customer: dodoCustomerId,
        items: [{
          product: productId,
          quantity: 1,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      }),
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

    // Return checkout URL or payment intent client secret
    let checkoutUrl = null;
    let clientSecret = null;

    if (subscription.latest_invoice?.payment_intent) {
      clientSecret = subscription.latest_invoice.payment_intent.client_secret;
    }

    // If subscription requires payment, create a checkout session
    if (subscription.status === 'incomplete') {
      const checkoutSession = await dodoRequest('/checkout/sessions', {
        method: 'POST',
        body: JSON.stringify({
          customer: dodoCustomerId,
          subscription: subscription.id,
          success_url: `${req.headers.get('origin')}/settings?tab=billing&success=true`,
          cancel_url: `${req.headers.get('origin')}/settings?tab=billing&canceled=true`,
        }),
      });
      
      checkoutUrl = checkoutSession.url;
      console.log('Created checkout session:', checkoutUrl);
    }

    return new Response(JSON.stringify({
      subscriptionId: subscription.id,
      status: subscription.status,
      checkoutUrl,
      clientSecret,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

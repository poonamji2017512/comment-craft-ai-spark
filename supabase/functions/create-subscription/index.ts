
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

// Product ID mapping based on your configuration
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

const DODO_API_BASE = 'https://live.dodopayments.com';

async function dodoRequest(endpoint: string, options: RequestInit = {}) {
  const timestamp = new Date().toISOString();
  const apiKey = Deno.env.get('DODO_PAYMENTS_SECRET_KEY');
  
  console.log(`[${timestamp}] create-subscription: Starting dodoRequest to endpoint: ${endpoint}`);
  
  if (!apiKey) {
    console.error(`[${timestamp}] create-subscription: CRITICAL - DODO_PAYMENTS_SECRET_KEY not configured`);
    throw new Error('DODO_PAYMENTS_SECRET_KEY not configured');
  }

  const fullUrl = `${DODO_API_BASE}${endpoint}`;
  console.log(`[${timestamp}] create-subscription: Making request to: ${fullUrl}`);

  const requestOptions = {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  console.log(`[${timestamp}] create-subscription: Request method: ${requestOptions.method || 'GET'}`);
  if (options.body) {
    console.log(`[${timestamp}] create-subscription: Request body:`, options.body);
  }

  let response;
  try {
    response = await fetch(fullUrl, requestOptions);
    console.log(`[${timestamp}] create-subscription: Response status: ${response.status}`);
  } catch (fetchError) {
    console.error(`[${timestamp}] create-subscription: Network error:`, fetchError.message);
    throw new Error(`Network error calling Dodo API: ${fetchError.message}`);
  }

  let responseText;
  try {
    responseText = await response.text();
    console.log(`[${timestamp}] create-subscription: Response body: ${responseText}`);
  } catch (readError) {
    console.error(`[${timestamp}] create-subscription: Error reading response:`, readError.message);
    throw new Error(`Error reading Dodo API response: ${readError.message}`);
  }

  if (!response.ok) {
    console.error(`[${timestamp}] create-subscription: Dodo API error. Status: ${response.status}, Body: ${responseText}`);
    
    let errorData;
    try {
      errorData = JSON.parse(responseText);
    } catch (parseError) {
      errorData = { message: responseText };
    }

    throw new Error(`Dodo API error: ${response.status} - ${errorData.message || responseText}`);
  }

  try {
    return JSON.parse(responseText);
  } catch (parseError) {
    console.error(`[${timestamp}] create-subscription: Error parsing response JSON:`, parseError.message);
    throw new Error(`Invalid JSON response from Dodo API: ${parseError.message}`);
  }
}

serve(async (req: Request) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] create-subscription: Function invoked. Method: ${req.method}`);

  if (req.method === 'OPTIONS') {
    console.log(`[${timestamp}] create-subscription: Handling OPTIONS preflight request`);
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Parse request
    let requestBody;
    try {
      requestBody = await req.json();
      console.log(`[${timestamp}] create-subscription: Request body:`, JSON.stringify(requestBody, null, 2));
    } catch (parseError) {
      console.error(`[${timestamp}] create-subscription: Error parsing request body:`, parseError.message);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        details: parseError.message 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Authenticate user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error(`[${timestamp}] create-subscription: No authorization header`);
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error(`[${timestamp}] create-subscription: Auth error:`, authError?.message || 'No user found');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[${timestamp}] create-subscription: Authenticated user: ${user.id}, email: ${user.email}`);

    const { planType, billingCycle }: CreateSubscriptionRequest = requestBody;

    // Validate planType and billingCycle
    if (!planType || !['PRO', 'ULTRA'].includes(planType)) {
      console.error(`[${timestamp}] create-subscription: Invalid planType: ${planType}`);
      return new Response(JSON.stringify({ 
        error: 'Invalid planType. Must be PRO or ULTRA' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
      console.error(`[${timestamp}] create-subscription: Invalid billingCycle: ${billingCycle}`);
      return new Response(JSON.stringify({ 
        error: 'Invalid billingCycle. Must be monthly or yearly' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[${timestamp}] create-subscription: Creating subscription for user: ${user.id}, Plan: ${planType}, Cycle: ${billingCycle}`);

    // Get or create customer in Dodo Payments
    let dodoCustomerId: string;
    
    // Check if user already has a Dodo customer ID
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('dodo_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingSubscription?.dodo_customer_id) {
      dodoCustomerId = existingSubscription.dodo_customer_id;
      console.log(`[${timestamp}] create-subscription: Using existing customer ID: ${dodoCustomerId}`);
    } else {
      console.log(`[${timestamp}] create-subscription: Creating new customer for: ${user.email}`);
      
      const customerData = {
        email: user.email!,
        name: user.user_metadata?.full_name || user.email!.split('@')[0],
      };
      
      console.log(`[${timestamp}] create-subscription: Customer data:`, JSON.stringify(customerData, null, 2));
      
      try {
        const customer = await dodoRequest('/customers', {
          method: 'POST',
          body: JSON.stringify(customerData),
        });
        
        dodoCustomerId = customer.customer_id;
        console.log(`[${timestamp}] create-subscription: Created new customer: ${dodoCustomerId}`);
      } catch (customerError) {
        console.error(`[${timestamp}] create-subscription: Error creating customer:`, customerError.message);
        return new Response(JSON.stringify({ 
          error: 'Failed to create customer with payment provider',
          details: customerError.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Get the product ID for the selected plan
    const productId = PRODUCT_IDS[planType][billingCycle];
    console.log(`[${timestamp}] create-subscription: Using product ID: ${productId}`);

    const origin = req.headers.get('origin') || 'https://your-app.com';
    const successUrl = `${origin}/settings?tab=billing&subscription_process=success`;
    const cancelUrl = `${origin}/settings?tab=billing&subscription_process=canceled`;

    // Create subscription with Dodo Payments API - including REQUIRED quantity field
    const subscriptionData = {
      customer_id: dodoCustomerId,
      product_id: productId,
      quantity: 1, // REQUIRED field for Dodo Payments
      payment_link: true,
      return_url: successUrl,
      metadata: {
        local_user_id: user.id,
        plan_type: planType,
        billing_cycle: billingCycle
      }
    };

    console.log(`[${timestamp}] create-subscription: Subscription data:`, JSON.stringify(subscriptionData, null, 2));

    let subscription;
    try {
      subscription = await dodoRequest('/subscriptions', {
        method: 'POST',
        body: JSON.stringify(subscriptionData),
      });
      
      console.log(`[${timestamp}] create-subscription: Dodo subscription created: ${subscription.id}`);
      console.log(`[${timestamp}] create-subscription: SUCCESS - Subscription created`, {
        subscription_id: subscription.id,
        user_id: user.id,
        plan_type: planType,
        billing_cycle: billingCycle,
        status: subscription.status
      });
    } catch (subscriptionError) {
      console.error(`[${timestamp}] create-subscription: Error creating subscription:`, subscriptionError.message);
      return new Response(JSON.stringify({ 
        error: 'Failed to create subscription with payment provider',
        details: subscriptionError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Store subscription in our database after successful Dodo creation
    try {
      const { error: dbError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          dodo_customer_id: dodoCustomerId,
          dodo_subscription_id: subscription.id,
          plan_type: planType,
          billing_cycle: billingCycle,
          status: subscription.status || 'incomplete',
          current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null,
          current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        });

      if (dbError) {
        console.error(`[${timestamp}] create-subscription: Database error:`, dbError.message);
        return new Response(JSON.stringify({ 
          error: 'Failed to store subscription in database',
          details: dbError.message,
          subscription_id: subscription.id
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (dbError) {
      console.error(`[${timestamp}] create-subscription: Database operation failed:`, dbError.message);
      return new Response(JSON.stringify({ 
        error: 'Database operation failed',
        details: dbError.message,
        subscription_id: subscription.id
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return success response with payment link
    const result = {
      success: true,
      subscriptionId: subscription.id,
      status: subscription.status,
      checkoutUrl: subscription.payment_link || null,
      paymentLink: subscription.payment_link || null
    };

    console.log(`[${timestamp}] create-subscription: Returning success response:`, JSON.stringify(result, null, 2));

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error(`[${timestamp}] create-subscription: Unhandled error:`, error.message);
    console.error(`[${timestamp}] create-subscription: Error stack:`, error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message,
      timestamp: timestamp
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});


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

// Updated Product ID mapping based on Dodo Payments standard format
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
  const timestamp = new Date().toISOString();
  const apiKey = Deno.env.get('DODO_PAYMENTS_SECRET_KEY');
  
  console.log(`[${timestamp}] create-subscription: Starting dodoRequest to endpoint: ${endpoint}`);
  
  if (!apiKey) {
    console.error(`[${timestamp}] create-subscription: CRITICAL - DODO_PAYMENTS_SECRET_KEY not configured`);
    throw new Error('DODO_PAYMENTS_SECRET_KEY not configured');
  }

  const fullUrl = `${DODO_API_BASE}${endpoint}`;
  console.log(`[${timestamp}] create-subscription: Making request to: ${fullUrl}`);
  
  // Log request details (sanitize sensitive data)
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
  console.log(`[${timestamp}] create-subscription: Request headers:`, JSON.stringify({
    'Content-Type': requestOptions.headers['Content-Type'],
    'Accept': requestOptions.headers['Accept'],
    'Authorization': 'Bearer [REDACTED]'
  }));
  
  if (options.body) {
    console.log(`[${timestamp}] create-subscription: Request body:`, options.body);
  }

  let response;
  try {
    response = await fetch(fullUrl, requestOptions);
    console.log(`[${timestamp}] create-subscription: Response received. Status: ${response.status} ${response.statusText}`);
    console.log(`[${timestamp}] create-subscription: Response headers:`, JSON.stringify(Object.fromEntries(response.headers.entries())));
  } catch (fetchError) {
    console.error(`[${timestamp}] create-subscription: Network error during fetch:`, fetchError.message);
    console.error(`[${timestamp}] create-subscription: Fetch error stack:`, fetchError.stack);
    throw new Error(`Network error calling Dodo API: ${fetchError.message}`);
  }

  // Read response as text first to handle non-JSON responses
  let responseText;
  try {
    responseText = await response.text();
    console.log(`[${timestamp}] create-subscription: Response body: ${responseText}`);
  } catch (readError) {
    console.error(`[${timestamp}] create-subscription: Error reading response body:`, readError.message);
    throw new Error(`Error reading Dodo API response: ${readError.message}`);
  }

  if (!response.ok) {
    console.error(`[${timestamp}] create-subscription: Dodo API error. Status: ${response.status}, Body: ${responseText}`);
    
    let errorData;
    try {
      errorData = JSON.parse(responseText);
    } catch (parseError) {
      console.warn(`[${timestamp}] create-subscription: Response was not valid JSON`);
      errorData = { message: responseText };
    }

    throw new Error(`Dodo API error: ${response.status} - ${errorData.message || responseText}`);
  }

  // Parse successful response
  let responseData;
  try {
    responseData = JSON.parse(responseText);
    console.log(`[${timestamp}] create-subscription: Successfully parsed response data:`, JSON.stringify(responseData, null, 2));
  } catch (parseError) {
    console.error(`[${timestamp}] create-subscription: Error parsing successful response as JSON:`, parseError.message);
    throw new Error(`Invalid JSON response from Dodo API: ${parseError.message}`);
  }

  return responseData;
}

serve(async (req: Request) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] create-subscription: Function invoked. Method: ${req.method}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[${timestamp}] create-subscription: Handling OPTIONS preflight request`);
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Parse and log incoming request
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

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error(`[${timestamp}] create-subscription: No authorization header provided`);
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

    if (!planType || !billingCycle) {
      console.error(`[${timestamp}] create-subscription: Missing required fields. planType: ${planType}, billingCycle: ${billingCycle}`);
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: planType and billingCycle' 
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
      .single();

    if (existingSubscription?.dodo_customer_id) {
      dodoCustomerId = existingSubscription.dodo_customer_id;
      console.log(`[${timestamp}] create-subscription: Using existing customer ID: ${dodoCustomerId}`);
    } else {
      // Create new customer in Dodo Payments
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
        
        dodoCustomerId = customer.id;
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

    // Create subscription in Dodo Payments
    const subscriptionData = {
      customer_id: dodoCustomerId,
      price_id: productId,
      payment_behavior: 'default_incomplete',
      success_url: `${req.headers.get('origin')}/settings?tab=billing&success=true`,
      cancel_url: `${req.headers.get('origin')}/settings?tab=billing&canceled=true`,
    };

    console.log(`[${timestamp}] create-subscription: Subscription data:`, JSON.stringify(subscriptionData, null, 2));

    let subscription;
    try {
      subscription = await dodoRequest('/subscriptions', {
        method: 'POST',
        body: JSON.stringify(subscriptionData),
      });
      
      console.log(`[${timestamp}] create-subscription: Dodo subscription created: ${subscription.id}`);
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

    // Store subscription in our database
    try {
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
        console.error(`[${timestamp}] create-subscription: Database error:`, dbError.message);
        return new Response(JSON.stringify({ 
          error: 'Failed to store subscription in database',
          details: dbError.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (dbError) {
      console.error(`[${timestamp}] create-subscription: Database operation failed:`, dbError.message);
      return new Response(JSON.stringify({ 
        error: 'Database operation failed',
        details: dbError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return checkout URL or subscription details
    const result = {
      subscriptionId: subscription.id,
      status: subscription.status,
      checkoutUrl: subscription.checkout_url || null,
      clientSecret: subscription.client_secret || null,
    };

    console.log(`[${timestamp}] create-subscription: Preparing to return success response:`, JSON.stringify(result, null, 2));

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

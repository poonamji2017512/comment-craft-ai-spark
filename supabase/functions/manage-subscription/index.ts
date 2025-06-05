
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ManageSubscriptionRequest {
  action: 'cancel' | 'upgrade' | 'downgrade';
  newPlanType?: 'PRO' | 'ULTRA';
  newBillingCycle?: 'monthly' | 'yearly';
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const DODO_API_BASE = 'https://api.dodo.dev/v1';

async function dodoRequest(endpoint: string, options: RequestInit = {}) {
  const timestamp = new Date().toISOString();
  const apiKey = Deno.env.get('DODO_PAYMENTS_SECRET_KEY');
  
  console.log(`[${timestamp}] manage-subscription: Starting dodoRequest to endpoint: ${endpoint}`);
  
  if (!apiKey) {
    console.error(`[${timestamp}] manage-subscription: CRITICAL - DODO_PAYMENTS_SECRET_KEY not configured`);
    throw new Error('DODO_PAYMENTS_SECRET_KEY not configured');
  }

  const fullUrl = `${DODO_API_BASE}${endpoint}`;
  console.log(`[${timestamp}] manage-subscription: Making request to: ${fullUrl}`);

  const requestOptions = {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  console.log(`[${timestamp}] manage-subscription: Request method: ${requestOptions.method || 'GET'}`);
  if (options.body) {
    console.log(`[${timestamp}] manage-subscription: Request body:`, options.body);
  }

  let response;
  try {
    response = await fetch(fullUrl, requestOptions);
    console.log(`[${timestamp}] manage-subscription: Response status: ${response.status}`);
  } catch (fetchError) {
    console.error(`[${timestamp}] manage-subscription: Network error:`, fetchError.message);
    throw new Error(`Network error calling Dodo API: ${fetchError.message}`);
  }

  let responseText;
  try {
    responseText = await response.text();
    console.log(`[${timestamp}] manage-subscription: Response body: ${responseText}`);
  } catch (readError) {
    console.error(`[${timestamp}] manage-subscription: Error reading response:`, readError.message);
    throw new Error(`Error reading Dodo API response: ${readError.message}`);
  }

  if (!response.ok) {
    console.error(`[${timestamp}] manage-subscription: Dodo API error. Status: ${response.status}, Body: ${responseText}`);
    
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
    console.error(`[${timestamp}] manage-subscription: Error parsing response JSON:`, parseError.message);
    throw new Error(`Invalid JSON response from Dodo API: ${parseError.message}`);
  }
}

serve(async (req: Request) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] manage-subscription: Function invoked. Method: ${req.method}`);

  if (req.method === 'OPTIONS') {
    console.log(`[${timestamp}] manage-subscription: Handling OPTIONS preflight request`);
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Parse request
    let requestBody;
    try {
      requestBody = await req.json();
      console.log(`[${timestamp}] manage-subscription: Request body:`, JSON.stringify(requestBody, null, 2));
    } catch (parseError) {
      console.error(`[${timestamp}] manage-subscription: Error parsing request body:`, parseError.message);
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
      console.error(`[${timestamp}] manage-subscription: No authorization header`);
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error(`[${timestamp}] manage-subscription: Auth error:`, authError?.message || 'No user found');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[${timestamp}] manage-subscription: Authenticated user: ${user.id}`);

    const { action, newPlanType, newBillingCycle }: ManageSubscriptionRequest = requestBody;

    // Get user's current subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      console.error(`[${timestamp}] manage-subscription: No active subscription found. Error:`, subError?.message);
      return new Response(JSON.stringify({ error: 'No active subscription found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[${timestamp}] manage-subscription: Managing subscription: ${subscription.dodo_subscription_id}, Action: ${action}`);

    let result;

    try {
      switch (action) {
        case 'cancel':
          console.log(`[${timestamp}] manage-subscription: Canceling subscription`);
          result = await dodoRequest(`/subscriptions/${subscription.dodo_subscription_id}/cancel`, {
            method: 'POST',
          });

          // Update in our database
          await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', subscription.id);

          break;

        case 'upgrade':
        case 'downgrade':
          if (!newPlanType || !newBillingCycle) {
            console.error(`[${timestamp}] manage-subscription: Missing plan details for ${action}`);
            return new Response(JSON.stringify({ 
              error: 'New plan type and billing cycle required for plan changes' 
            }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          console.log(`[${timestamp}] manage-subscription: ${action} to ${newPlanType} ${newBillingCycle}`);

          // Update subscription with new plan
          const productIds = {
            PRO: {
              monthly: 'price_pro_monthly',
              yearly: 'price_pro_yearly'
            },
            ULTRA: {
              monthly: 'price_ultra_monthly',
              yearly: 'price_ultra_yearly'
            }
          };

          const newPriceId = productIds[newPlanType][newBillingCycle];

          result = await dodoRequest(`/subscriptions/${subscription.dodo_subscription_id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              price_id: newPriceId,
            }),
          });

          // Update in our database
          await supabase
            .from('subscriptions')
            .update({
              plan_type: newPlanType,
              billing_cycle: newBillingCycle,
              updated_at: new Date().toISOString(),
            })
            .eq('id', subscription.id);

          break;

        default:
          console.error(`[${timestamp}] manage-subscription: Invalid action: ${action}`);
          return new Response(JSON.stringify({ error: 'Invalid action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
      }
    } catch (dodoError) {
      console.error(`[${timestamp}] manage-subscription: Error during ${action}:`, dodoError.message);
      return new Response(JSON.stringify({ 
        error: `Failed to ${action} subscription`,
        details: dodoError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const responseData = {
      success: true,
      subscription: result,
    };

    console.log(`[${timestamp}] manage-subscription: Returning success response:`, JSON.stringify(responseData, null, 2));

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error(`[${timestamp}] manage-subscription: Unhandled error:`, error.message);
    console.error(`[${timestamp}] manage-subscription: Error stack:`, error.stack);
    
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

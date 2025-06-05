
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
  const apiKey = Deno.env.get('DODO_PAYMENTS_SECRET_KEY');
  if (!apiKey) {
    throw new Error('DODO_PAYMENTS_SECRET_KEY not configured');
  }

  const response = await fetch(`${DODO_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Dodo API error: ${response.status} ${error}`);
  }

  return response.json();
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, newPlanType, newBillingCycle }: ManageSubscriptionRequest = await req.json();

    // Get user's current subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      throw new Error('No active subscription found');
    }

    console.log('Managing subscription:', subscription.dodo_subscription_id, 'Action:', action);

    let result;

    switch (action) {
      case 'cancel':
        // Cancel subscription 
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
          throw new Error('New plan type and billing cycle required for plan changes');
        }

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
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify({
      success: true,
      subscription: result,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error managing subscription:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

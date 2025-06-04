
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { DodoPayments } from "npm:@dodopayments/node@1.0.0";

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

const dodo = new DodoPayments({
  apiKey: Deno.env.get('DODO_PAYMENTS_SECRET_KEY') ?? '',
});

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
        // Cancel subscription at period end
        result = await dodo.subscriptions.update(subscription.dodo_subscription_id, {
          cancel_at_period_end: true,
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

        // Get current subscription from Dodo
        const currentSub = await dodo.subscriptions.retrieve(subscription.dodo_subscription_id);
        
        // Update subscription with new plan
        const productIds = {
          PRO: {
            monthly: 'pdt_nYgdsmbwvDujGIBBlA9LE',
            yearly: 'pdt_YQbqHvroDI6wJrRhBkEwj'
          },
          ULTRA: {
            monthly: 'pdt_APpHuTy5eP3DqNcs0WYR7',
            yearly: 'pdt_WAhDE7ydq4emw3hRu1dgp'
          }
        };

        const newProductId = productIds[newPlanType][newBillingCycle];

        result = await dodo.subscriptions.update(subscription.dodo_subscription_id, {
          items: [{
            id: currentSub.items.data[0].id,
            product: newProductId,
          }],
          proration_behavior: 'create_prorations',
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

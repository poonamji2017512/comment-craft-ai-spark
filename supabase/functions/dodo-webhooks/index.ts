
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verifyWebhookSignature } from "npm:@dodopayments/node@1.0.0";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const webhookSecret = Deno.env.get('DODO_WEBHOOK_SECRET') ?? '';

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('dodo-signature');

    if (!signature) {
      console.error('No Dodo signature header found');
      return new Response('No signature', { status: 400 });
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature, webhookSecret);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

    const event = JSON.parse(body);
    console.log('Received webhook event:', event.type, 'ID:', event.id);

    // Handle different event types
    switch (event.type) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response('OK', { status: 200 });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response('Internal error', { status: 500 });
  }
});

async function handlePaymentSucceeded(payment: any) {
  console.log('Payment succeeded:', payment.id);

  // Find subscription by customer ID
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('dodo_customer_id', payment.customer)
    .single();

  if (subscription) {
    // Record successful payment in billing history
    await supabase.from('billing_history').insert({
      user_id: subscription.user_id,
      subscription_id: subscription.id,
      dodo_payment_id: payment.id,
      amount: payment.amount / 100, // Convert from cents
      currency: payment.currency,
      status: 'succeeded',
      description: `${subscription.plan_type} Plan - ${subscription.billing_cycle}`,
      payment_date: new Date(payment.created * 1000).toISOString(),
    });

    // Update subscription status to active if it was incomplete
    if (subscription.status !== 'active') {
      await supabase
        .from('subscriptions')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', subscription.id);
    }
  }
}

async function handlePaymentFailed(invoice: any) {
  console.log('Payment failed for invoice:', invoice.id);

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('dodo_subscription_id', invoice.subscription)
    .single();

  if (subscription) {
    // Record failed payment
    await supabase.from('billing_history').insert({
      user_id: subscription.user_id,
      subscription_id: subscription.id,
      amount: invoice.total / 100,
      currency: invoice.currency,
      status: 'failed',
      description: `${subscription.plan_type} Plan - ${subscription.billing_cycle} (Failed)`,
      payment_date: new Date().toISOString(),
    });

    // Update subscription status to past_due
    await supabase
      .from('subscriptions')
      .update({ status: 'past_due', updated_at: new Date().toISOString() })
      .eq('id', subscription.id);
  }
}

async function handleSubscriptionCreated(subscription: any) {
  console.log('Subscription created:', subscription.id);
  // This is usually handled in the create-subscription function
  // but we can update here if needed
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log('Subscription updated:', subscription.id);

  // Update subscription in our database
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('dodo_subscription_id', subscription.id)
    .single();

  if (existingSub) {
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null,
        current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingSub.id);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log('Subscription deleted:', subscription.id);

  // Mark subscription as canceled in our database
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('dodo_subscription_id', subscription.id);
}

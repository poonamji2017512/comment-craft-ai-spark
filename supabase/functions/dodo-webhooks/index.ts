
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function verifyWebhookSignature(payload: string, signature: string) {
  const webhookSecret = Deno.env.get('DODO_WEBHOOK_SECRET');
  if (!webhookSecret) {
    throw new Error('DODO_WEBHOOK_SECRET not configured');
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const signatureBuffer = await crypto.subtle.verify(
    'HMAC',
    key,
    hexToArrayBuffer(signature.replace('sha256=', '')),
    encoder.encode(payload)
  );

  return signatureBuffer;
}

function hexToArrayBuffer(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

serve(async (req: Request) => {
  try {
    const payload = await req.text();
    const signature = req.headers.get('dodo-signature') || '';

    console.log('Received webhook payload:', payload);
    console.log('Webhook signature:', signature);

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(payload, signature);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

    const event = JSON.parse(payload);
    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'subscription.created':
      case 'subscription.updated':
        const subscription = event.data.object;
        
        // Update subscription in our database
        const { error: subError } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null,
            current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('dodo_subscription_id', subscription.id);

        if (subError) {
          console.error('Error updating subscription:', subError);
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        
        // Get subscription to find user_id
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('user_id, id')
          .eq('dodo_subscription_id', invoice.subscription)
          .single();

        if (subData) {
          // Record successful payment in billing history
          const { error: billingError } = await supabase
            .from('billing_history')
            .insert({
              user_id: subData.user_id,
              subscription_id: subData.id,
              dodo_payment_id: invoice.payment_intent,
              amount: invoice.amount_paid / 100, // Convert from cents
              currency: invoice.currency.toUpperCase(),
              status: 'succeeded',
              description: `Payment for ${invoice.lines.data[0]?.description || 'subscription'}`,
              payment_date: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
            });

          if (billingError) {
            console.error('Error recording payment:', billingError);
          }
        }
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        
        // Get subscription to find user_id
        const { data: failedSubData } = await supabase
          .from('subscriptions')
          .select('user_id, id')
          .eq('dodo_subscription_id', failedInvoice.subscription)
          .single();

        if (failedSubData) {
          // Record failed payment in billing history
          const { error: failedBillingError } = await supabase
            .from('billing_history')
            .insert({
              user_id: failedSubData.user_id,
              subscription_id: failedSubData.id,
              dodo_payment_id: failedInvoice.payment_intent,
              amount: failedInvoice.amount_due / 100, // Convert from cents
              currency: failedInvoice.currency.toUpperCase(),
              status: 'failed',
              description: `Failed payment for ${failedInvoice.lines.data[0]?.description || 'subscription'}`,
              payment_date: new Date().toISOString(),
            });

          if (failedBillingError) {
            console.error('Error recording failed payment:', failedBillingError);
          }

          // Update subscription status to past_due
          await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('dodo_subscription_id', failedInvoice.subscription);
        }
        break;

      case 'subscription.deleted':
        const deletedSubscription = event.data.object;
        
        // Update subscription status to canceled
        const { error: deleteError } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('dodo_subscription_id', deletedSubscription.id);

        if (deleteError) {
          console.error('Error updating deleted subscription:', deleteError);
        }
        break;

      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return new Response('Webhook processed successfully', { status: 200 });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
});

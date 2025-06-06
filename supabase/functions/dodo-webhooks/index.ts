
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function verifyWebhookSignature(payload: string, signature: string) {
  const timestamp = new Date().toISOString();
  const webhookSecret = Deno.env.get('DODO_WEBHOOK_SECRET');
  
  console.log(`[${timestamp}] dodo-webhooks: Verifying webhook signature`);
  
  // Bug Fix #3: Throw 500 if webhook secret is missing
  if (!webhookSecret) {
    console.error(`[${timestamp}] dodo-webhooks: DODO_WEBHOOK_SECRET not configured`);
    throw new Error('DODO_WEBHOOK_SECRET not configured');
  }

  try {
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

    console.log(`[${timestamp}] dodo-webhooks: Signature verification result: ${signatureBuffer}`);
    return signatureBuffer;
  } catch (verifyError) {
    console.error(`[${timestamp}] dodo-webhooks: Signature verification error:`, verifyError.message);
    throw new Error(`Signature verification failed: ${verifyError.message}`);
  }
}

function hexToArrayBuffer(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

serve(async (req: Request) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] dodo-webhooks: Webhook received. Method: ${req.method}`);
  console.log(`[${timestamp}] dodo-webhooks: Headers:`, JSON.stringify(Object.fromEntries(req.headers.entries())));

  try {
    // Bug Fix #1: Use req.text() for raw body — not req.json()
    let rawPayload;
    try {
      rawPayload = await req.text();
      console.log(`[${timestamp}] dodo-webhooks: Received raw payload:`, rawPayload);
    } catch (readError) {
      console.error(`[${timestamp}] dodo-webhooks: Error reading payload:`, readError.message);
      // Bug Fix #4: Return 400 for bad signatures; 500/503 for server failures
      return new Response('Error reading payload', { 
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const signature = req.headers.get('dodo-signature') || '';
    console.log(`[${timestamp}] dodo-webhooks: Webhook signature header:`, signature);

    // Bug Fix #2: Parse rawBody only after signature validation
    try {
      const isValid = await verifyWebhookSignature(rawPayload, signature);
      if (!isValid) {
        console.error(`[${timestamp}] dodo-webhooks: Invalid webhook signature`);
        // Bug Fix #4: Return 400 for bad signatures
        return new Response('Invalid signature', { 
          status: 400,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    } catch (signatureError) {
      console.error(`[${timestamp}] dodo-webhooks: Signature verification failed:`, signatureError.message);
      // Check if it's a configuration issue (500) vs bad signature (400)
      if (signatureError.message.includes('not configured')) {
        return new Response('Server configuration error', { 
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      return new Response('Signature verification failed', { 
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Now parse the verified payload
    let event;
    try {
      event = JSON.parse(rawPayload);
      // Bug Fix #7: Log event ID, user_id, event_type, etc. for observability
      console.log(`[${timestamp}] dodo-webhooks: Processing webhook event`, {
        event_id: event.id,
        event_type: event.type,
        object_id: event.data?.object?.id,
        timestamp: timestamp
      });
      console.log(`[${timestamp}] dodo-webhooks: Event data:`, JSON.stringify(event.data, null, 2));
    } catch (parseError) {
      console.error(`[${timestamp}] dodo-webhooks: Error parsing event JSON:`, parseError.message);
      return new Response('Invalid JSON payload', { 
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Return 200 quickly for idempotency (as per PRD guidelines)
    const quickResponse = new Response('Webhook received', { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });

    // Process event in background (non-blocking)
    const processEvent = async () => {
      try {
        // Bug Fix #6: Use event.data instead of manual parsing
        switch (event.type) {
          case 'subscription.created':
          case 'subscription.updated':
            console.log(`[${timestamp}] dodo-webhooks: Processing ${event.type}`);
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
              console.error(`[${timestamp}] dodo-webhooks: Error updating subscription:`, subError.message);
            } else {
              console.log(`[${timestamp}] dodo-webhooks: Successfully updated subscription: ${subscription.id}`);
            }
            break;

          case 'invoice.payment_succeeded':
            console.log(`[${timestamp}] dodo-webhooks: Processing payment succeeded`);
            const invoice = event.data.object;
            
            // Get subscription to find user_id
            const { data: subData } = await supabase
              .from('subscriptions')
              .select('user_id, id')
              .eq('dodo_subscription_id', invoice.subscription)
              .maybeSingle();

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
                console.error(`[${timestamp}] dodo-webhooks: Error recording payment:`, billingError.message);
              } else {
                console.log(`[${timestamp}] dodo-webhooks: Successfully recorded payment for user: ${subData.user_id}`);
              }
            } else {
              // Bug Fix #5: Handle orphan event edge cases
              console.warn(`[${timestamp}] dodo-webhooks: ORPHAN EVENT - No subscription found for invoice: ${invoice.subscription}`);
            }
            break;

          case 'invoice.payment_failed':
            console.log(`[${timestamp}] dodo-webhooks: Processing payment failed`);
            const failedInvoice = event.data.object;
            
            // Get subscription to find user_id
            const { data: failedSubData } = await supabase
              .from('subscriptions')
              .select('user_id, id')
              .eq('dodo_subscription_id', failedInvoice.subscription)
              .maybeSingle();

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
                console.error(`[${timestamp}] dodo-webhooks: Error recording failed payment:`, failedBillingError.message);
              }

              // Update subscription status to past_due
              await supabase
                .from('subscriptions')
                .update({
                  status: 'past_due',
                  updated_at: new Date().toISOString(),
                })
                .eq('dodo_subscription_id', failedInvoice.subscription);

              console.log(`[${timestamp}] dodo-webhooks: Updated subscription to past_due for failed payment`);
            } else {
              // Bug Fix #5: Handle orphan event edge cases
              console.warn(`[${timestamp}] dodo-webhooks: ORPHAN EVENT - No subscription found for failed invoice: ${failedInvoice.subscription}`);
            }
            break;

          case 'subscription.deleted':
            console.log(`[${timestamp}] dodo-webhooks: Processing subscription deleted`);
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
              console.error(`[${timestamp}] dodo-webhooks: Error updating deleted subscription:`, deleteError.message);
            } else {
              console.log(`[${timestamp}] dodo-webhooks: Successfully canceled subscription: ${deletedSubscription.id}`);
            }
            break;

          default:
            console.log(`[${timestamp}] dodo-webhooks: Unhandled webhook event type: ${event.type}`);
        }
      } catch (processingError) {
        console.error(`[${timestamp}] dodo-webhooks: Error processing event:`, processingError.message);
        console.error(`[${timestamp}] dodo-webhooks: Processing error stack:`, processingError.stack);
      }
    };

    // Start background processing but don't await it
    processEvent();

    return quickResponse;

  } catch (error: any) {
    console.error(`[${timestamp}] dodo-webhooks: Unhandled webhook error:`, error.message);
    console.error(`[${timestamp}] dodo-webhooks: Error stack:`, error.stack);
    
    return new Response(`Webhook error: ${error.message}`, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
});

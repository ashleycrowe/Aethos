/**
 * Webhook Subscription API - V4 Feature
 * 
 * PURPOSE: Real-time event notifications for third-party integrations
 * EVENTS: artifact.created, artifact.updated, workspace.created, compliance.alert, etc.
 * DELIVERY: HTTP POST to subscriber URL
 * 
 * WORKFLOW:
 * 1. Subscribe to webhook events
 * 2. Event occurs in Aethos
 * 3. Webhook delivered to subscriber URL
 * 4. Retry on failure (3 attempts)
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface WebhookSubscription {
  tenant_id: string;
  event_types: string[];
  url: string;
  secret: string; // For HMAC signature verification
  enabled: boolean;
}

// Create webhook subscription
async function createSubscription(subscription: WebhookSubscription) {
  const { data, error } = await supabase
    .from('webhook_subscriptions')
    .insert(subscription)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Trigger webhook delivery (called by event handlers)
export async function triggerWebhook(tenantId: string, eventType: string, payload: any) {
  // Find all subscriptions for this tenant and event type
  const { data: subscriptions } = await supabase
    .from('webhook_subscriptions')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('enabled', true)
    .contains('event_types', [eventType]);

  if (!subscriptions || subscriptions.length === 0) {
    return;
  }

  // Deliver webhook to each subscriber
  for (const subscription of subscriptions) {
    await deliverWebhook(subscription, eventType, payload);
  }
}

// Deliver webhook with retry logic
async function deliverWebhook(subscription: any, eventType: string, payload: any, attempt: number = 1) {
  const webhookPayload = {
    event_type: eventType,
    timestamp: new Date().toISOString(),
    data: payload,
  };

  try {
    // Generate HMAC signature for security
    const signature = await generateHmacSignature(JSON.stringify(webhookPayload), subscription.secret);

    const response = await fetch(subscription.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Aethos-Signature': signature,
        'X-Aethos-Event': eventType,
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!response.ok) {
      throw new Error(`Webhook delivery failed: ${response.status} ${response.statusText}`);
    }

    // Log successful delivery
    await supabase.from('webhook_deliveries').insert({
      subscription_id: subscription.id,
      event_type: eventType,
      status: 'success',
      attempt,
      delivered_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`Webhook delivery error (attempt ${attempt}):`, error);

    // Retry up to 3 times with exponential backoff
    if (attempt < 3) {
      const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      setTimeout(() => {
        deliverWebhook(subscription, eventType, payload, attempt + 1);
      }, delayMs);
    } else {
      // Log failed delivery after all retries
      await supabase.from('webhook_deliveries').insert({
        subscription_id: subscription.id,
        event_type: eventType,
        status: 'failed',
        attempt,
        error_message: error.message,
        delivered_at: new Date().toISOString(),
      });
    }
  }
}

// Generate HMAC signature for webhook verification
async function generateHmacSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(payload);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'POST') {
      // Create webhook subscription
      const { tenantId, eventTypes, url, secret } = req.body;

      if (!tenantId || !eventTypes || !url || !secret) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate event types
      const validEvents = [
        'artifact.created',
        'artifact.updated',
        'artifact.deleted',
        'workspace.created',
        'workspace.updated',
        'compliance.alert',
        'anomaly.detected',
        'retention.executed',
      ];

      const invalidEvents = eventTypes.filter((e: string) => !validEvents.includes(e));
      if (invalidEvents.length > 0) {
        return res.status(400).json({ error: `Invalid event types: ${invalidEvents.join(', ')}` });
      }

      const subscription = await createSubscription({
        tenant_id: tenantId,
        event_types: eventTypes,
        url,
        secret,
        enabled: true,
      });

      return res.status(201).json({
        success: true,
        subscription,
        message: 'Webhook subscription created',
      });
    }

    if (req.method === 'GET') {
      // List webhook subscriptions
      const { tenantId } = req.query;

      if (!tenantId) {
        return res.status(400).json({ error: 'Missing tenantId' });
      }

      const { data: subscriptions, error } = await supabase
        .from('webhook_subscriptions')
        .select('id, event_types, url, enabled, created_at')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({ subscriptions });
    }

    if (req.method === 'DELETE') {
      // Delete webhook subscription
      const { subscriptionId } = req.body;

      if (!subscriptionId) {
        return res.status(400).json({ error: 'Missing subscriptionId' });
      }

      const { error } = await supabase
        .from('webhook_subscriptions')
        .delete()
        .eq('id', subscriptionId);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Webhook subscription deleted',
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Webhook subscription error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

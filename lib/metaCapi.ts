import crypto from 'crypto';

const META_PIXEL_ID = process.env.META_PIXEL_ID || '1077955564560473';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_API_VERSION = 'v21.0';

function hashSHA256(value: string): string {
  return crypto
    .createHash('sha256')
    .update(value.trim().toLowerCase())
    .digest('hex');
}

interface UserData {
  email?: string;
  phone?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
}

interface CustomData {
  currency?: string;
  value?: number;
  content_name?: string;
  content_category?: string;
  contents?: Array<{ id?: string; quantity?: number; item_price?: number }>;
  [key: string]: any;
}

interface CapiEventParams {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
  userData: UserData;
  customData?: CustomData;
}

/**
 * Sends a server-side event to Meta Conversions API (CAPI).
 * Uses the same event_id as the browser Pixel event for deduplication.
 */
export async function sendMetaCapiEvent({
  eventName,
  eventId,
  eventSourceUrl,
  userData,
  customData,
}: CapiEventParams): Promise<void> {
  if (!META_ACCESS_TOKEN) {
    console.warn('META_ACCESS_TOKEN not configured. Skipping Meta CAPI event.');
    return;
  }

  const payloadUserData: Record<string, any> = {};

  if (userData.email) {
    payloadUserData.em = [hashSHA256(userData.email)];
  }
  if (userData.phone) {
    // Normalize phone: strip non-digits before hashing (Meta requirement)
    const normalizedPhone = userData.phone.replace(/[^0-9]/g, '');
    payloadUserData.ph = [hashSHA256(normalizedPhone)];
  }
  if (userData.clientIpAddress) {
    payloadUserData.client_ip_address = userData.clientIpAddress;
  }
  if (userData.clientUserAgent) {
    payloadUserData.client_user_agent = userData.clientUserAgent;
  }

  const body = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: eventSourceUrl,
        user_data: payloadUserData,
        custom_data: customData || {},
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      console.error('Meta CAPI error:', result);
    }
  } catch (error) {
    console.error('Failed to send Meta CAPI event:', error);
  }
}

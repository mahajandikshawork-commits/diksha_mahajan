declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    fbq?: (...args: any[]) => void;
  }
}

export function generateEventId() {
  return 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
}

async function hashPII(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface AppointmentData {
  name: string;
  city: string;
  email: string;
  phone: string;
  countryCode: string;
  event: string;
}

interface SubscribeData {
  name: string;
  email: string;
}

interface WelcomePopupData {
  name: string;
  email: string;
  phone: string;
}

interface PurchaseData {
  orderId: string;
  value: number;
  currency: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  customerName: string;
  customerEmail: string;
}

export async function trackAppointmentSubmit(data: AppointmentData, eventId: string = generateEventId()) {
  const fullPhone = `${data.countryCode}${data.phone}`;
  const [hashedEmail, hashedPhone] = await Promise.all([
    hashPII(data.email),
    hashPII(fullPhone),
  ]);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'book_appointment_submit',
    event_id: eventId,
    form_city: data.city,
    event_type: data.event,
    hashed_email: hashedEmail,
    hashed_phone: hashedPhone,
  });

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Schedule', {
      content_name: 'Appointment Booking',
      content_category: data.event,
      city: data.city,
    }, { eventID: eventId });
  }
}

export async function trackNewsletterSubscribe(data: SubscribeData, eventId: string = generateEventId()) {
  const hashedEmail = await hashPII(data.email);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'newsletter_subscribe',
    event_id: eventId,
    hashed_email: hashedEmail,
  });

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: 'Newsletter Subscription',
      content_category: 'Newsletter',
    }, { eventID: eventId });
  }
}

export async function trackWelcomePopupSubmit(data: WelcomePopupData, eventId: string = generateEventId()) {
  const [hashedEmail, hashedPhone] = await Promise.all([
    data.email ? hashPII(data.email) : Promise.resolve(undefined),
    data.phone ? hashPII(data.phone) : Promise.resolve(undefined),
  ]);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'welcome_popup_submit',
    event_id: eventId,
    hashed_email: hashedEmail,
    hashed_phone: hashedPhone,
  });

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: 'Welcome Popup Signup',
      content_category: 'Newsletter',
    }, { eventID: eventId });
  }
}

export async function trackPurchase(data: PurchaseData, eventId: string = generateEventId()) {
  const hashedEmail = await hashPII(data.customerEmail);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'purchase',
    event_id: eventId,
    transaction_id: data.orderId,
    value: data.value,
    currency: data.currency,
    items: data.items,
    hashed_email: hashedEmail,
  });

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Purchase', {
      value: data.value,
      currency: data.currency,
      content_type: 'product',
      contents: data.items.map(item => ({
        content_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    }, { eventID: eventId });
  }
}

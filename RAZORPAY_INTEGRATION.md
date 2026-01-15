# Razorpay Payment Gateway Integration

This document explains the complete Razorpay payment integration for the Diksha Mahajan website.

## Overview

The website uses Razorpay as the payment gateway to process customer orders securely. The integration includes:
- Order creation
- Payment processing
- Payment verification
- Invoice email delivery

## Environment Configuration

### Required Environment Variables

Add these to your `.env.local` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_S4FWdZFmaclzfJ
RAZORPAY_KEY_SECRET=AEm9l9Y6E5zPNS4IFw7ixTPf
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_S4FWdZFmaclzfJ
```

**Note:** 
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are used server-side
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` is exposed to the client for Razorpay checkout

## Payment Flow

### 1. Customer Journey

1. **Browse & Add to Cart**
   - Customer browses products and adds items to cart
   - Cart stores product details, size, and custom measurements

2. **Checkout**
   - Customer fills shipping details form
   - Form validates all required fields
   - Customer clicks "Proceed to Payment"

3. **Razorpay Order Creation**
   - API call to `/api/razorpay/create-order`
   - Creates a Razorpay order with amount and customer details
   - Returns order ID and amount

4. **Razorpay Payment Modal**
   - Razorpay checkout modal opens
   - Customer can pay via:
     - Credit/Debit Cards
     - Net Banking
     - UPI
     - Wallets
   - Pre-filled with customer details

5. **Payment Verification**
   - After successful payment, Razorpay returns payment details
   - API call to `/api/razorpay/verify-payment`
   - Verifies payment signature using HMAC SHA256
   - Sends invoice emails to customer and admin

6. **Order Success**
   - Customer redirected to order success page
   - Invoice displayed with order details
   - Cart cleared automatically

### 2. Technical Implementation

#### API Routes

**`/app/api/razorpay/create-order/route.ts`**
- Creates Razorpay order
- Converts amount to paise (multiply by 100)
- Returns order ID for checkout

**`/app/api/razorpay/verify-payment/route.ts`**
- Verifies payment signature
- Sends invoice emails to customer and admin
- Returns verification status

#### Frontend Integration

**`/app/layout.tsx`**
- Loads Razorpay checkout script
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

**`/app/checkout/page.tsx`**
- Handles checkout form
- Initiates Razorpay payment
- Processes payment response
- Redirects to success page

## Razorpay Configuration

### Payment Options

The Razorpay checkout is configured with:

```javascript
{
  key: NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: orderAmount, // in paise
  currency: 'INR',
  name: 'Diksha Mahajan',
  description: 'Luxury Bridal Couture',
  order_id: razorpayOrderId,
  prefill: {
    name: customerName,
    email: customerEmail,
    contact: customerPhone,
  },
  theme: {
    color: '#000000', // Black theme
  },
}
```

### Payment Verification

Payment signature is verified using:

```javascript
const generatedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest('hex');

if (generatedSignature === razorpay_signature) {
  // Payment verified
}
```

## Testing

### Test Mode

To test payments without real transactions:

1. **Switch to Test Keys**
   - Login to Razorpay Dashboard
   - Go to Settings → API Keys
   - Use Test Key ID and Secret
   - Update `.env.local` with test keys

2. **Test Card Details**
   ```
   Card Number: 4111 1111 1111 1111
   CVV: Any 3 digits
   Expiry: Any future date
   ```

3. **Test UPI**
   ```
   UPI ID: success@razorpay
   ```

### Live Mode

Currently configured with **LIVE** keys:
- `rzp_live_S4FWdZFmaclzfJ`

**⚠️ Important:** All transactions will be real and money will be charged.

## Email Notifications

After successful payment verification:

1. **Customer Email**
   - Sent to email entered in shipping form
   - Contains order invoice
   - Subject: "Order Confirmation - [ORDER_ID]"

2. **Admin Email**
   - Sent to: `mangal.ayush.4982@gmail.com`
   - Contains same invoice
   - Subject: "New Order Received - [ORDER_ID]"

## Security Best Practices

1. **Never expose Key Secret**
   - Keep `RAZORPAY_KEY_SECRET` server-side only
   - Never commit `.env.local` to git

2. **Always verify payments**
   - Never trust client-side payment success
   - Always verify signature on server

3. **Use HTTPS**
   - Razorpay requires HTTPS in production
   - Ensure SSL certificate is valid

## Troubleshooting

### Payment Not Opening

**Issue:** Razorpay modal doesn't open
**Solution:**
- Check if Razorpay script is loaded in `<head>`
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
- Check browser console for errors

### Payment Verification Failed

**Issue:** Payment succeeds but verification fails
**Solution:**
- Verify `RAZORPAY_KEY_SECRET` is correct
- Check server logs for signature mismatch
- Ensure order_id and payment_id are correct

### Emails Not Sending

**Issue:** Payment succeeds but no emails sent
**Solution:**
- Check email configuration in `.env.local`
- Verify Gmail App Password is correct
- Check server logs for email errors

## Razorpay Dashboard

Access your Razorpay dashboard at: https://dashboard.razorpay.com

### Key Features

1. **Payments** - View all transactions
2. **Orders** - Track order status
3. **Refunds** - Process refunds if needed
4. **Reports** - Download transaction reports
5. **Settings** - Manage API keys and webhooks

## Support

For Razorpay integration issues:
- Razorpay Docs: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

For website issues:
- Contact: mangal.ayush.4982@gmail.com

## Files Involved

- `/app/api/razorpay/create-order/route.ts` - Order creation
- `/app/api/razorpay/verify-payment/route.ts` - Payment verification
- `/app/checkout/page.tsx` - Checkout page with Razorpay integration
- `/app/layout.tsx` - Razorpay script loading
- `.env.local` - Environment configuration

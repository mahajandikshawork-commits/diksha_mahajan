# Email Configuration for Order Invoices

This document explains how to set up email functionality for sending order invoices to both customers and admin.

## Email Credentials

The application uses Gmail SMTP to send order confirmation emails and invoices.

### Admin Email Configuration

**Admin Email:** `mangal.ayush.4982@gmail.com`  
**Password:** `UP.80.ek.4982`

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Email Configuration
EMAIL_USER=mangal.ayush.4982@gmail.com
EMAIL_PASS=UP.80.ek.4982

# Razorpay Configuration (if using payment gateway)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## How It Works

### 1. Order Placement Flow

When a customer successfully places an order:

1. **Payment Verification** (`/api/razorpay/verify-payment`)
   - Verifies the Razorpay payment signature
   - Sends invoice email to customer's email (from shipping form)
   - Sends invoice email to admin email (`mangal.ayush.4982@gmail.com`)

2. **Order Creation** (`/api/orders/create`)
   - Creates order record
   - Sends confirmation email to customer
   - Sends notification email to admin

### 2. Invoice Email Content

Each invoice email includes:
- Order ID and date
- Customer shipping details
- Contact information (email and phone)
- Itemized list of products with:
  - Product name and tagline
  - Size (including custom measurements if applicable)
  - Quantity
  - Price
- Total amount
- Next steps and delivery timeline
- Contact information for support

### 3. Email Recipients

**Customer Email:**
- Sent to the email address entered in the shipping form
- Subject: "Order Confirmation - [ORDER_ID]"

**Admin Email:**
- Sent to: `mangal.ayush.4982@gmail.com`
- Subject: "New Order Received - [ORDER_ID]"
- Contains the same invoice information as customer email

## Gmail App Password Setup

If using Gmail with 2-factor authentication, you need to generate an App Password:

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Use this generated password in the `EMAIL_PASS` environment variable

## Testing Email Functionality

To test if emails are working:

1. Ensure `.env.local` is configured with correct credentials
2. Place a test order through the website
3. Check both customer email and admin email (`mangal.ayush.4982@gmail.com`)
4. Verify invoice content is correct

## Troubleshooting

### Emails Not Sending

1. **Check environment variables** - Ensure `.env.local` exists and has correct values
2. **Gmail security** - Make sure "Less secure app access" is enabled or use App Password
3. **Check logs** - Look for email errors in the server console
4. **Verify SMTP settings** - Gmail SMTP uses port 587 with TLS

### Email Goes to Spam

- Add sender email to contacts
- Check email content for spam triggers
- Ensure proper email headers are set

## Files Involved

- `/app/api/razorpay/verify-payment/route.ts` - Handles payment verification and sends emails
- `/app/api/orders/create/route.ts` - Creates orders and sends confirmation emails
- `/app/components/Invoice.tsx` - Invoice component for display on success page

## Security Notes

⚠️ **Important:** Never commit `.env.local` to version control. It's already included in `.gitignore`.

The email credentials should be kept secure and only shared with authorized personnel.

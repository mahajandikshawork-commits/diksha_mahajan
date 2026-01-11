# Razorpay Payment Integration Setup Guide

## Overview
This guide will help you set up Razorpay payment gateway with email notifications for order receipts.

## Prerequisites
- Razorpay account
- Gmail account for sending emails
- Node.js and npm installed

## Step 1: Razorpay Account Setup

1. **Sign up for Razorpay**
   - Go to [https://razorpay.com/](https://razorpay.com/)
   - Click "Sign Up" and create an account
   - Complete KYC verification (required for live mode)

2. **Get API Keys**
   - Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Go to Settings > API Keys
   - Generate keys for Test Mode (for testing)
   - Note: You'll get separate keys for Live Mode after KYC approval

3. **Test Mode vs Live Mode**
   - **Test Mode**: Use for development and testing (no real money)
   - **Live Mode**: Use for production (real transactions)
   - Start with Test Mode keys

## Step 2: Gmail App Password Setup

1. **Enable 2-Step Verification**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security > 2-Step Verification
   - Follow the steps to enable it

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter "Diksha Mahajan Website"
   - Click "Generate"
   - Copy the 16-character password (no spaces)

## Step 3: Environment Variables Setup

1. **Copy the example file**
   ```bash
   cp .env.example .env.local
   ```

2. **Update .env.local with your credentials**
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
   EMAIL_USER=dikshamahajan.work@gmail.com
   EMAIL_PASS=your_16_char_app_password
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   ```

3. **Important Notes**
   - Never commit `.env.local` to git
   - Use Test Mode keys for development
   - Switch to Live Mode keys only in production

## Step 4: Testing the Integration

### Test Payment Flow

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Add items to cart**
   - Browse products and add to cart
   - Go to cart page

3. **Proceed to checkout**
   - Click "Proceed to Checkout"
   - Fill in shipping details
   - Click "Proceed to Payment"

4. **Test Payment**
   Razorpay provides test card details:
   - **Card Number**: 4111 1111 1111 1111
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date
   - **Name**: Any name

5. **Verify Email**
   - Check buyer's email inbox
   - Check dikshamahajan.work@gmail.com inbox
   - Both should receive order confirmation

### Test Card Details (Razorpay Test Mode)

| Scenario | Card Number | Result |
|----------|-------------|--------|
| Success | 4111 1111 1111 1111 | Payment succeeds |
| Failure | 4000 0000 0000 0002 | Payment fails |

## Step 5: Going Live

1. **Complete KYC Verification**
   - Submit business documents to Razorpay
   - Wait for approval (usually 24-48 hours)

2. **Get Live API Keys**
   - Go to Razorpay Dashboard
   - Switch to Live Mode
   - Generate Live API keys

3. **Update Production Environment**
   - Update `.env.local` with Live keys
   - Deploy to production
   - Test with small real transaction

4. **Important Checklist**
   - [ ] KYC approved
   - [ ] Live API keys generated
   - [ ] Environment variables updated
   - [ ] Test transaction completed
   - [ ] Email notifications working
   - [ ] SSL certificate installed (HTTPS)

## Email Template Customization

The order receipt email includes:
- Order confirmation details
- Payment ID and Order ID
- Itemized order summary
- Shipping address
- Contact information

To customize the email template, edit:
`app/api/razorpay/verify-payment/route.ts` (line 60+)

## Troubleshooting

### Payment fails immediately
- Check if Razorpay keys are correct
- Verify you're using Test Mode keys in development
- Check browser console for errors

### Email not received
- Verify Gmail App Password is correct
- Check spam/junk folder
- Ensure 2-Step Verification is enabled
- Check email address is correct

### "Payment verification failed"
- Check Razorpay webhook secret
- Verify signature validation logic
- Check server logs for errors

### CORS errors
- Ensure Razorpay script is loaded
- Check if domain is whitelisted in Razorpay dashboard

## Security Best Practices

1. **Never expose secrets**
   - Keep `.env.local` private
   - Never commit API keys to git
   - Use environment variables

2. **Verify payments server-side**
   - Always verify payment signature
   - Don't trust client-side data
   - Log all transactions

3. **Use HTTPS in production**
   - Required for Razorpay
   - Protects customer data
   - SSL certificate needed

4. **Monitor transactions**
   - Check Razorpay dashboard regularly
   - Set up email alerts
   - Review failed payments

## Support

- **Razorpay Docs**: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Razorpay Support**: support@razorpay.com
- **Gmail Help**: [https://support.google.com/mail](https://support.google.com/mail)

## API Endpoints Created

- `POST /api/razorpay/create-order` - Creates Razorpay order
- `POST /api/razorpay/verify-payment` - Verifies payment and sends emails

## Pages Created

- `/checkout` - Checkout page with Razorpay integration
- `/order-success` - Order confirmation page

---

**Ready to test?** Follow Step 4 above to test the complete payment flow!

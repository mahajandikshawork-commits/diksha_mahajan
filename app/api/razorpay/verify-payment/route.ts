import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    // Check if Razorpay credentials are configured
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: 'Razorpay credentials not configured',
        },
        { status: 503 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
      customerDetails,
    } = await req.json();

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment verification failed',
        },
        { status: 400 }
      );
    }

    // Payment verified successfully

    // Send emails
    try {
      await sendOrderEmails(
        customerDetails,
        orderDetails,
        razorpay_payment_id,
        razorpay_order_id
      );
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Don't fail the payment if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      payment_id: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Payment verification failed',
      },
      { status: 500 }
    );
  }
}

async function sendOrderEmails(
  customerDetails: any,
  orderDetails: any,
  paymentId: string,
  orderId: string
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailTemplate = generateEmailTemplate(
    customerDetails,
    orderDetails,
    paymentId,
    orderId
  );

  // Send to customer
  await transporter.sendMail({
    from: `"Diksha Mahajan" <${process.env.EMAIL_USER}>`,
    to: customerDetails.email,
    subject: `Order Confirmation - ${orderId}`,
    html: emailTemplate,
  });

  // Send to admin email
  await transporter.sendMail({
    from: `"Diksha Mahajan" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Order Received - ${orderId}`,
    html: emailTemplate,
  });
}

function generateEmailTemplate(
  customerDetails: any,
  orderDetails: any,
  paymentId: string,
  orderId: string
): string {
  const itemsHtml = orderDetails.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br/>
        <small style="color: #666;">${item.tagline || ''}</small><br/>
        <small style="color: #666;">Size: ${item.size}</small>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price}</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">DIKSHA MAHAJAN</h1>
        <p style="margin: 5px 0 0 0; font-size: 12px; letter-spacing: 1px;">LUXURY BRIDAL COUTURE</p>
      </div>
      
      <div style="padding: 30px 20px;">
        <h2 style="color: #000; margin-top: 0;">Order Confirmation</h2>
        <p>Dear ${customerDetails.name},</p>
        <p>Thank you for your order! We're excited to create your bespoke piece.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #000;">
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${paymentId}</p>
          <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}</p>
        </div>

        <h3 style="margin-top: 30px;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #000;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #000;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #000;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right; border-top: 2px solid #000;"><strong>Total:</strong></td>
              <td style="padding: 12px; text-align: right; border-top: 2px solid #000;"><strong>${orderDetails.total}</strong></td>
            </tr>
          </tfoot>
        </table>

        <h3 style="margin-top: 30px;">Shipping Details</h3>
        <div style="background-color: #f9f9f9; padding: 15px; margin: 10px 0;">
          <p style="margin: 5px 0;"><strong>${customerDetails.name}</strong></p>
          <p style="margin: 5px 0;">${customerDetails.address}</p>
          <p style="margin: 5px 0;">${customerDetails.city}, ${customerDetails.state} - ${customerDetails.pincode}</p>
          <p style="margin: 5px 0;">Phone: ${customerDetails.phone}</p>
          <p style="margin: 5px 0;">Email: ${customerDetails.email}</p>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #f5f1e8; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px;">
            <strong>What's Next?</strong><br/>
            Your order will be processed within 2-3 business days. We'll send you shipping updates via email and WhatsApp.
          </p>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>For any queries, contact us at:</p>
          <p>
            📧 <a href="mailto:info@dikshamahajan.com" style="color: #000;">info@dikshamahajan.com</a><br/>
            📱 <a href="tel:+919871907315" style="color: #000;">+91-9871907315</a>
          </p>
        </div>
      </div>

      <div style="background-color: #000; color: #fff; padding: 20px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Diksha Mahajan. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">Luxury Bridal & Trousseau Couture</p>
      </div>
    </body>
    </html>
  `;
}

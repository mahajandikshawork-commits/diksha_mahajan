import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { orderDetails, customerDetails } = await req.json();

    // Generate order ID
    const orderId = `ORD${Date.now()}`;
    const orderDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Send emails only if credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await sendOrderEmails(customerDetails, orderDetails, orderId, orderDate);
        console.log('Order confirmation emails sent successfully');
      } catch (emailError) {
        console.error('Failed to send emails, but order created:', emailError);
        // Don't fail the order if email fails
      }
    } else {
      console.log('Email credentials not configured, skipping email notification');
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderDate,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create order',
      },
      { status: 500 }
    );
  }
}

async function sendOrderEmails(
  customerDetails: any,
  orderDetails: any,
  orderId: string,
  orderDate: string
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
    orderId,
    orderDate
  );

  // Send to customer
  await transporter.sendMail({
    from: `"Diksha Mahajan" <${process.env.EMAIL_USER}>`,
    to: customerDetails.email,
    subject: `Order Confirmation - ${orderId}`,
    html: emailTemplate,
  });

  // Send to owner
  await transporter.sendMail({
    from: `"Diksha Mahajan" <${process.env.EMAIL_USER}>`,
    to: 'mangal.ayush.4982@gmail.com',
    subject: `New Order Received - ${orderId}`,
    html: emailTemplate,
  });
}

function generateEmailTemplate(
  customerDetails: any,
  orderDetails: any,
  orderId: string,
  orderDate: string
): string {
  const itemsHtml = orderDetails.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br/>
        <small style="color: #666;">${item.tagline || ''}</small><br/>
        <small style="color: #666;">Size: ${item.size}</small>
        ${item.size === 'Custom' && item.customMeasurements ? `
          <div style="margin-top: 8px; padding: 8px; background-color: #f9f9f9; font-size: 11px;">
            <strong>Custom Measurements:</strong><br/>
            ${Object.entries(item.customMeasurements)
              .map(([key, value]) => `${key}: ${value}`)
              .join('<br/>')}
          </div>
        ` : ''}
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
      <title>Order Confirmation - Invoice</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #000; color: #fff; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; letter-spacing: 3px;">DIKSHA MAHAJAN</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px; letter-spacing: 2px;">LUXURY BRIDAL COUTURE</p>
      </div>
      
      <div style="padding: 40px 30px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #000; margin: 0 0 10px 0; font-size: 24px;">ORDER INVOICE</h2>
          <p style="color: #666; margin: 0;">Thank you for your order!</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
          <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #000;">
            <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase;">Order Details</h3>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${orderDate}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #22c55e;">Confirmed</span></p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #000;">
            <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase;">Shipping Address</h3>
            <p style="margin: 5px 0;"><strong>${customerDetails.name}</strong></p>
            <p style="margin: 5px 0; font-size: 14px;">${customerDetails.address}</p>
            <p style="margin: 5px 0; font-size: 14px;">${customerDetails.city}, ${customerDetails.state} - ${customerDetails.pincode}</p>
          </div>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; margin-bottom: 30px;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase;">Contact Information</h3>
          <p style="margin: 5px 0;">📧 ${customerDetails.email}</p>
          <p style="margin: 5px 0;">📱 ${customerDetails.phone}</p>
        </div>

        <h3 style="margin: 30px 0 15px 0; font-size: 18px;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background-color: #000; color: #fff;">
              <th style="padding: 15px; text-align: left; font-weight: 600;">Item</th>
              <th style="padding: 15px; text-align: center; font-weight: 600;">Qty</th>
              <th style="padding: 15px; text-align: right; font-weight: 600;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #f5f5f5;">
              <td colspan="2" style="padding: 15px; text-align: right; font-weight: 600; border-top: 2px solid #000;">TOTAL:</td>
              <td style="padding: 15px; text-align: right; font-weight: 600; font-size: 18px; border-top: 2px solid #000;">${orderDetails.total}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 40px; padding: 25px; background-color: #f5f1e8; border-radius: 5px;">
          <h3 style="margin: 0 0 10px 0; font-size: 16px;">📦 What's Next?</h3>
          <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
            <li>Your order will be processed within 2-3 business days</li>
            <li>We'll send you shipping updates via email and WhatsApp</li>
            <li>Estimated delivery: 15-20 business days (India) / 25-30 business days (International)</li>
          </ul>
        </div>

        <div style="margin-top: 30px; text-align: center; padding: 20px; border-top: 2px solid #eee;">
          <p style="margin: 0 0 10px 0; color: #666;">For any queries, contact us at:</p>
          <p style="margin: 5px 0;">
            📧 <a href="mailto:info@dikshamahajan.com" style="color: #000; text-decoration: none; font-weight: 600;">info@dikshamahajan.com</a>
          </p>
          <p style="margin: 5px 0;">
            📱 <a href="tel:+919871907315" style="color: #000; text-decoration: none; font-weight: 600;">+91-9871907315</a>
          </p>
          <p style="margin: 5px 0;">
            💬 <a href="https://wa.me/919871907315" style="color: #000; text-decoration: none; font-weight: 600;">WhatsApp</a>
          </p>
        </div>
      </div>

      <div style="background-color: #000; color: #fff; padding: 25px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Diksha Mahajan. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">Luxury Bridal & Trousseau Couture</p>
      </div>
    </body>
    </html>
  `;
}

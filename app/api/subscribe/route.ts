import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials not configured');
      return NextResponse.json(
        { success: false, message: 'Email service not configured' },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Montserrat', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: #1a1a1a; padding: 30px; text-align: center; }
          .header h1 { color: #DCC898; margin: 0; font-size: 24px; letter-spacing: 3px; text-transform: uppercase; }
          .content { padding: 30px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Diksha Mahajan</h1>
        </div>
        <div class="content">
          <h2>Welcome to the Diksha Mahajan Family!</h2>
          <p>Thank you for subscribing! You'll now receive updates on:</p>
          <ul>
            <li>New collection launches</li>
            <li>Journal stories and inspiration</li>
            <li>Exclusive releases and offers</li>
          </ul>
          <p>We're excited to have you with us on this journey of timeless elegance.</p>
          <p style="margin-top: 20px;">Warm regards,<br/>Team Diksha Mahajan</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Diksha Mahajan. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Send confirmation to subscriber
    await transporter.sendMail({
      from: `"Diksha Mahajan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Diksha Mahajan Updates',
      html: emailHtml,
    });

    // Notify admin
    await transporter.sendMail({
      from: `"Diksha Mahajan" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Newsletter Subscription - ${email}`,
      html: `<p>New subscriber: <strong>${email}</strong></p><p>Subscribed on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>`,
    });

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

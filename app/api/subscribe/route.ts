import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

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

    const firstName = name.trim().split(' ')[0];

    // Client email
    const clientHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Montserrat', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: #1a1a1a; padding: 30px; text-align: center; }
          .header h1 { color: #DCC898; margin: 0; font-size: 24px; letter-spacing: 3px; text-transform: uppercase; }
          .content { padding: 30px; line-height: 1.8; }
          .content ol { padding-left: 20px; }
          .content ol li { margin-bottom: 8px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Diksha Mahajan</h1>
        </div>
        <div class="content">
          <p>Dear ${firstName}🤍</p>
          <p>Thank you for subscribing to the Diksha Mahajan newsletter.</p>
          <p>You're now on our list for early access to new blogs, collection launches, and client stories from the house. We're delighted to have you with us as we share more of our world of couture, craftsmanship, and inspiration.</p>
          <p>You'll be among the first to receive updates on:</p>
          <ol>
            <li>Upcoming blog articles.</li>
            <li>New collection previews and launches.</li>
            <li>Client stories and special features.</li>
            <li>Exclusive updates from the atelier.</li>
          </ol>
          <p>We're so glad to have you with us.</p>
          <p>Warm regards,<br/>Team Diksha Mahajan✨</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Diksha Mahajan. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Admin email
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Montserrat', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: #1a1a1a; padding: 30px; text-align: center; }
          .header h1 { color: #DCC898; margin: 0; font-size: 24px; letter-spacing: 3px; text-transform: uppercase; }
          .content { padding: 30px; line-height: 1.8; }
          .content ul { padding-left: 20px; list-style: none; }
          .content ul li { margin-bottom: 8px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Diksha Mahajan</h1>
        </div>
        <div class="content">
          <p>Hello Admin,</p>
          <p>A new user has subscribed to the newsletter.</p>
          <p><strong>Subscriber details:</strong></p>
          <ul>
            <li>1. Name: ${name}</li>
            <li>2. Email: ${email}</li>
            <li>3. Subscription source: Website newsletter form</li>
          </ul>
          <p>The subscriber will receive updates and early access to blogs, collections, and client stories.</p>
          <p>Best,<br/>Website Notification System</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Diksha Mahajan. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Send to subscriber
    await transporter.sendMail({
      from: `"Diksha Mahajan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to Diksha Mahajan's Newsletter`,
      html: clientHtml,
    });

    // Send to admin
    await transporter.sendMail({
      from: `"Diksha Mahajan" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Newsletter Subscription Received`,
      html: adminHtml,
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

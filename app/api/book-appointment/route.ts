import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, city, countryCode, phone, email, event } = await req.json();

    if (!name || !email || !phone || !city || !event) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
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
          .details { background: #f5f5f5; padding: 20px; margin: 20px 0; border-left: 4px solid #DCC898; }
          .details p { margin: 8px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
          .btn { display: inline-block; background: #DCC898; color: #000; padding: 12px 30px; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Diksha Mahajan</h1>
        </div>
        <div class="content">
          <h2>Dear ${name},</h2>
          <p>Thank you for booking an appointment with us! We're delighted to help you find the perfect ensemble for your special occasion.</p>

          <div class="details">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>City:</strong> ${city}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${countryCode} ${phone}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Event:</strong> ${event}</p>
            <p style="margin: 5px 0;"><strong>Submitted on:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>

          <p>Please confirm your slot by clicking the button below:</p>
          <a href="https://calendly.com/dikshamahajan-info/30min" class="btn">Book Your Slot</a>

          <p>We look forward to seeing you at our design space!</p>
          <p style="margin-top: 20px;">Warm regards,<br/>Team Diksha Mahajan</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Diksha Mahajan. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Send to customer
    await transporter.sendMail({
      from: `"Diksha Mahajan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Appointment Confirmation - Diksha Mahajan`,
      html: emailHtml,
    });

    // Send to admin
    await transporter.sendMail({
      from: `"Diksha Mahajan" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Appointment Booking - ${name} (${event})`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Appointment booking error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
}

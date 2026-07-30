import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase';
import { sendMetaCapiEvent } from '@/lib/metaCapi';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, eventId } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
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

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Welcome Popup Submission</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">DIKSHA MAHAJAN</h1>
          <p style="margin: 5px 0 0 0; font-size: 12px; letter-spacing: 1px;">LUXURY BRIDAL COUTURE</p>
        </div>

        <div style="padding: 30px 20px;">
          <h2 style="color: #000; margin-top: 0;">New Welcome Popup Submission</h2>
          <p>A new visitor has shared their details via the website popup.</p>

          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #000;">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #000;">${email}</a></p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p style="margin: 5px 0;"><strong>Submitted on:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
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

    // Store in Supabase
    const { error: dbError } = await supabase
      .from('welcome_popup_submissions')
      .insert({ name, email, phone: phone || null });

    if (dbError) {
      console.error('Supabase error (welcome popup):', dbError);
    }

    await transporter.sendMail({
      from: `"Diksha Mahajan" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Welcome Popup Submission - ${name}`,
      html,
    });

    // Send Meta Conversions API event (server-side, deduped with browser Pixel via eventId)
    if (eventId) {
      await sendMetaCapiEvent({
        eventName: 'Lead',
        eventId,
        eventSourceUrl: req.headers.get('referer') || undefined,
        userData: {
          email,
          phone: phone || undefined,
          clientIpAddress: req.headers.get('x-forwarded-for') || undefined,
          clientUserAgent: req.headers.get('user-agent') || undefined,
        },
        customData: {
          content_name: 'Welcome Popup Signup',
          content_category: 'Newsletter',
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing welcome popup submission:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process submission' },
      { status: 500 }
    );
  }
}

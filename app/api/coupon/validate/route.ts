import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/couponUtils';

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal, userIdentifier } = await req.json();

    if (!code || !cartTotal || !userIdentifier) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = validateCoupon(code, cartTotal, userIdentifier);

    return NextResponse.json({
      success: result.valid,
      message: result.message,
      discount: result.discount || 0,
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}

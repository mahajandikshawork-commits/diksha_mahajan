import { NextRequest, NextResponse } from 'next/server';
import { markCouponAsUsed } from '@/lib/couponUtils';

export async function POST(req: NextRequest) {
  try {
    const { code, userIdentifier } = await req.json();

    if (!code || !userIdentifier) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    markCouponAsUsed(code, userIdentifier);

    return NextResponse.json({
      success: true,
      message: 'Coupon marked as used',
    });
  } catch (error) {
    console.error('Mark coupon as used error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to mark coupon as used' },
      { status: 500 }
    );
  }
}

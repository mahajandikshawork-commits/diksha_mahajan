import { Coupon, CouponValidationResult } from '@/types/coupon';
import {
  hasUserUsedCoupon,
  getCouponActivatedAt,
  addCouponUsage,
} from './couponStorage';

// Active promo codes. Add an entry here to make a code redeemable at checkout;
// remove it to retire the code. An empty object means no code will validate.
export const COUPON_DEFINITIONS: Record<string, Omit<Coupon, 'usedBy' | 'activatedAt'>> = {
  SYRUP6000: {
    code: 'SYRUP6000',
    discount: 6000,
    minCartValue: 50000,
    validityDays: 30,
  },
};

export async function validateCoupon(
  code: string,
  cartTotal: number,
  userIdentifier: string
): Promise<CouponValidationResult> {
  const normalizedCode = code.toUpperCase();
  const couponDef = COUPON_DEFINITIONS[normalizedCode];

  if (!couponDef) {
    return {
      valid: false,
      message: 'Invalid coupon code',
    };
  }

  if (cartTotal < couponDef.minCartValue) {
    return {
      valid: false,
      message: `Minimum cart value of ₹${couponDef.minCartValue.toLocaleString('en-IN')} required`,
    };
  }

  // Fail closed: if redemption history can't be read, refuse the coupon rather
  // than assume it is unused, which would let it be redeemed more than once.
  let alreadyUsed: boolean;
  let activatedAt: string | null;
  try {
    [alreadyUsed, activatedAt] = await Promise.all([
      hasUserUsedCoupon(normalizedCode, userIdentifier),
      getCouponActivatedAt(normalizedCode),
    ]);
  } catch (error) {
    console.error('Coupon usage lookup failed:', error);
    return {
      valid: false,
      message: 'Unable to verify this coupon right now. Please try again.',
    };
  }

  if (alreadyUsed) {
    return {
      valid: false,
      message: 'This coupon has already been used with this email/mobile',
    };
  }

  if (activatedAt) {
    const expiryDate = new Date(activatedAt);
    expiryDate.setDate(expiryDate.getDate() + couponDef.validityDays);

    if (new Date() > expiryDate) {
      return {
        valid: false,
        message: 'This coupon has expired',
      };
    }
  }

  return {
    valid: true,
    message: `Coupon applied! You saved ₹${couponDef.discount.toLocaleString('en-IN')}`,
    discount: couponDef.discount,
  };
}

export async function markCouponAsUsed(
  code: string,
  userIdentifier: string
): Promise<void> {
  await addCouponUsage(code.toUpperCase(), userIdentifier);
}

import { Coupon, CouponValidationResult } from '@/types/coupon';
import { getCouponUsage, addCouponUsage } from './couponStorage';

export const COUPON_DEFINITIONS: Record<string, Omit<Coupon, 'usedBy' | 'activatedAt'>> = {
  WLBAZAAR6000: {
    code: 'WLBAZAAR6000',
    discount: 6000,
    minCartValue: 50000,
    validityDays: 30,
  },
};

export function validateCoupon(
  code: string,
  cartTotal: number,
  userIdentifier: string
): CouponValidationResult {
  const couponDef = COUPON_DEFINITIONS[code.toUpperCase()];

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

  const usage = getCouponUsage(code.toUpperCase());
  
  if (usage.usedBy.includes(userIdentifier)) {
    return {
      valid: false,
      message: 'This coupon has already been used with this email/mobile',
    };
  }

  if (usage.activatedAt) {
    const activatedDate = new Date(usage.activatedAt);
    const expiryDate = new Date(activatedDate);
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

export function markCouponAsUsed(code: string, userIdentifier: string): void {
  addCouponUsage(code.toUpperCase(), userIdentifier);
}

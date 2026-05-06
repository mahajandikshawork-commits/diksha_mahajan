export interface Coupon {
  code: string;
  discount: number;
  minCartValue: number;
  validityDays: number;
  activatedAt?: string;
  usedBy: string[];
}

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  discount?: number;
}

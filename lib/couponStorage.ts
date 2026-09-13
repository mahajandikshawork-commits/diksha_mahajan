import { supabase } from './supabase';

const TABLE = 'coupon_usage';

/**
 * Coupon redemptions are stored in Supabase rather than on disk: the app runs on
 * an ephemeral filesystem in production, so a local file would be wiped on every
 * deploy and cold start, letting the same person redeem a code repeatedly and
 * preventing the validity window from ever expiring.
 *
 * One row per (code, user_identifier). The coupon's activation time — which
 * starts the validity countdown — is the earliest redemption of that code.
 *
 * These helpers throw on failure so callers can fail closed. Treating an
 * unreadable store as "not yet redeemed" would let a coupon be reused.
 */

/** True if this email/phone has already redeemed the code. */
export async function hasUserUsedCoupon(
  code: string,
  userIdentifier: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id')
    .eq('code', code)
    .eq('user_identifier', userIdentifier)
    .limit(1);

  if (error) {
    console.error('Error checking coupon usage:', error);
    throw new Error('Failed to check coupon usage');
  }

  return (data?.length ?? 0) > 0;
}

/** When the code was first redeemed by anyone, or null if never. */
export async function getCouponActivatedAt(code: string): Promise<string | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('used_at')
    .eq('code', code)
    .order('used_at', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error loading coupon activation:', error);
    throw new Error('Failed to load coupon activation');
  }

  return data?.[0]?.used_at ?? null;
}

/** Record a redemption. Re-redeeming by the same identifier is a no-op. */
export async function addCouponUsage(
  code: string,
  userIdentifier: string
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .upsert(
      { code, user_identifier: userIdentifier },
      { onConflict: 'code,user_identifier', ignoreDuplicates: true }
    );

  if (error) {
    console.error('Error recording coupon usage:', error);
    throw new Error('Failed to record coupon usage');
  }
}

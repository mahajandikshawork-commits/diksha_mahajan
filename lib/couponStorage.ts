import fs from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), 'data', 'coupon-usage.json');

interface CouponUsageData {
  [couponCode: string]: {
    activatedAt?: string;
    usedBy: string[];
  };
}

export function loadCouponUsage(): CouponUsageData {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading coupon usage data:', error);
  }
  return {};
}

export function saveCouponUsage(data: CouponUsageData): void {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving coupon usage data:', error);
  }
}

export function addCouponUsage(code: string, userIdentifier: string): void {
  const data = loadCouponUsage();
  
  if (!data[code]) {
    data[code] = {
      activatedAt: new Date().toISOString(),
      usedBy: [],
    };
  }
  
  if (!data[code].usedBy.includes(userIdentifier)) {
    data[code].usedBy.push(userIdentifier);
  }
  
  saveCouponUsage(data);
}

export function getCouponUsage(code: string): { activatedAt?: string; usedBy: string[] } {
  const data = loadCouponUsage();
  return data[code] || { usedBy: [] };
}

export interface ReferralSlabConfig {
  smallMaxPrice: number;
  smallPayout: number;
  regularMaxPrice: number;
  regularPayout: number;
  advancedMaxPrice: number;
  advancedPayout: number;
  packagePayout: number;
}

export const DEFAULT_REFERRAL_SLABS: ReferralSlabConfig = {
  smallMaxPrice: 349,
  smallPayout: 30,
  regularMaxPrice: 799,
  regularPayout: 60,
  advancedMaxPrice: 1299,
  advancedPayout: 120,
  packagePayout: 300,
};

/**
 * Calculates the referral commission for a given item or booking based on QuickLabz referral slabs.
 */
export function calculateReferralEarning(
  itemPrice: number,
  isPackage: boolean = false,
  slabs: ReferralSlabConfig = DEFAULT_REFERRAL_SLABS
): number {
  if (isPackage || itemPrice >= 2500) {
    return slabs.packagePayout;
  }

  if (itemPrice <= slabs.smallMaxPrice) {
    return slabs.smallPayout;
  }

  if (itemPrice <= slabs.regularMaxPrice) {
    return slabs.regularPayout;
  }

  if (itemPrice <= slabs.advancedMaxPrice) {
    return slabs.advancedPayout;
  }

  // Fallback for custom high-value single tests
  return Math.round(itemPrice * 0.1);
}

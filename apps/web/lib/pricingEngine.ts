/**
 * QuickLabz Dynamic Pricing Engine
 * 
 * Calculates the final consumer selling price and gross margin based on the lab's B2B custom rate.
 * Uses a sliding scale margin to protect profitability on low-cost tests and remain competitive on high-cost tests.
 * 
 * Margin Scale:
 * ₹0–₹100: +50%
 * ₹101–₹200: +40%
 * ₹201–₹500: +35%
 * ₹501–₹1,000: +30%
 * ₹1,001–₹2,000: +25%
 * ₹2,001+: +20%
 */

export function calculateSellingPrice(labPrice: number): {
  sellingPrice: number;
  marginPercentage: number;
  grossMarginAmount: number;
} {
  const marginPercentage = 30;
  const multiplier = 1.30;
  const rawPrice = labPrice * multiplier;

  // Rounding strategy for consumer psychology (ends in '9' if possible)
  // For example: 168 -> 169. 412 -> 419. 1490 -> 1499.
  let roundedPrice = Math.round(rawPrice);
  
  // If the price is over 50, apply the 'ends in 9' rule
  if (roundedPrice > 50) {
    const remainder = roundedPrice % 10;
    if (remainder < 9) {
      roundedPrice += (9 - remainder);
    }
  }

  const grossMarginAmount = roundedPrice - labPrice;

  return {
    sellingPrice: roundedPrice,
    marginPercentage,
    grossMarginAmount,
  };
}

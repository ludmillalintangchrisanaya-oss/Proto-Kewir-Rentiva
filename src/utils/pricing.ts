import { DeliveryMethod, OrderBreakdown, PromoCode } from '../types/rentiva';

export function formatIDR(amount: number): string {
  return 'Rp' + Math.round(amount).toLocaleString('id-ID');
}

export function getCourierFee(method: DeliveryMethod): number {
  switch (method) {
    case 'hotel_courier':
      return 25000;
    case 'yia_courier':
      return 45000;
    case 'pickup_hub':
      return 0;
  }
}

export function calculateEscrowBreakdown(params: {
  pricePerDay: number;
  durationDays: number;
  deposit: number;
  deliveryMethod: DeliveryMethod;
  promo?: PromoCode | null;
}): OrderBreakdown {
  const { pricePerDay, durationDays, deposit, deliveryMethod, promo } = params;
  const safeDays = Math.max(1, durationDays);
  const baseRent = pricePerDay * safeDays;

  // Proposal rule: min 3 days = 10% discount, min 7 days = 20% discount
  const durationDiscountRate = safeDays >= 7 ? 0.2 : safeDays >= 3 ? 0.1 : 0;
  const durationDiscountAmount = Math.round(baseRent * durationDiscountRate);
  const afterDuration = baseRent - durationDiscountAmount;

  let promoDiscountAmount = 0;
  if (promo) {
    if (promo.type === 'flat') {
      promoDiscountAmount = Math.min(afterDuration, promo.value);
    } else {
      const raw = Math.round(afterDuration * (promo.value / 100));
      promoDiscountAmount = promo.maxDiscount ? Math.min(raw, promo.maxDiscount) : raw;
    }
  }

  const rentAfterDiscounts = Math.max(0, afterDuration - promoDiscountAmount);
  // Proposal rule: 8% renter service fee
  const renterServiceFee8 = Math.round(rentAfterDiscounts * 0.08);
  const courierFee = getCourierFee(deliveryMethod);
  const depositAmount = deposit;
  const totalEscrow = rentAfterDiscounts + renterServiceFee8 + courierFee + depositAmount;

  // Proposal rule: 12% platform commission -> 88% net owner payout
  const platformCommission12 = Math.round(rentAfterDiscounts * 0.12);
  const ownerNet88 = rentAfterDiscounts - platformCommission12;

  return {
    durationDays: safeDays,
    baseRent,
    durationDiscountRate,
    durationDiscountAmount,
    promoDiscountAmount,
    rentAfterDiscounts,
    renterServiceFee8,
    courierFee,
    depositAmount,
    totalEscrow,
    platformCommission12,
    ownerNet88,
  };
}

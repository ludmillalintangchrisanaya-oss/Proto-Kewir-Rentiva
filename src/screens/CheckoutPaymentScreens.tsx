import React, { useEffect, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  Lock,
  MapPin,
  Plane,
  QrCode,
  ShieldCheck,
  Store,
  Tag,
  Truck,
} from 'lucide-react';
import {
  DeliveryMethod,
  EkycState,
  Language,
  PaymentMethod,
  PromoCode,
  RentalItem,
} from '../types/rentiva';
import { TopBar } from '../components/PhoneChrome';
import { ProductImage } from '../components/ProductImage';
import { DELIVERY_PRESETS, PROMO_CODES } from '../data/mockCatalog';
import { calculateEscrowBreakdown, formatIDR } from '../utils/pricing';
import { t } from '../data/i18n';

interface CheckoutScreenProps {
  lang: Language;
  onToggleLang: () => void;
  item: RentalItem;
  startDay: number;
  durationDays: number;
  deliveryMethod: DeliveryMethod;
  deliveryLocationName: string;
  deliveryAddress: string;
  appliedPromo: PromoCode | null;
  ekyc: EkycState;
  onChangeDelivery: (method: DeliveryMethod, name: string, address: string) => void;
  onApplyPromo: (promo: PromoCode | null) => void;
  onRequireEkyc: () => void;
  onBack: () => void;
  onProceedToPayment: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  lang,
  onToggleLang,
  item,
  startDay,
  durationDays,
  deliveryMethod,
  deliveryLocationName,
  deliveryAddress,
  appliedPromo,
  ekyc,
  onChangeDelivery,
  onApplyPromo,
  onRequireEkyc,
  onBack,
  onProceedToPayment,
}) => {
  const copy = t(lang);
  const [promoInput, setPromoInput] = useState(appliedPromo?.code || '');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const breakdown = calculateEscrowBreakdown({
    pricePerDay: item.pricePerDay,
    durationDays,
    deposit: item.deposit,
    deliveryMethod,
    promo: appliedPromo,
  });

  const handleApplyPromoCode = (codeStr?: string) => {
    const code = (codeStr ?? promoInput).trim().toUpperCase();
    if (!code) {
      onApplyPromo(null);
      setPromoError(null);
      return;
    }
    const found = PROMO_CODES.find((p) => p.code === code);
    if (found) {
      onApplyPromo(found);
      setPromoInput(found.code);
      setPromoError(null);
    } else {
      setPromoError(
        lang === 'id'
          ? 'Kode tidak ditemukan. Coba JOGJA10, HEMAT15, atau REF-AJENG.'
          : 'Invalid code. Try JOGJA10, HEMAT15, or REF-AJENG.'
      );
    }
  };

  return (
    <div className="min-h-full bg-[#F5F8FB] flex flex-col pb-24">
      <TopBar
        title={copy.checkoutTitle}
        onBack={onBack}
        lang={lang}
        onToggleLang={onToggleLang}
      />

      <div className="p-4 space-y-4">
        {/* Item Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex gap-3">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
            <ProductImage
              src={item.image}
              alt={lang === 'id' ? item.name : item.nameEn}
              className="w-full h-full"
            />
          </div>
          <div className="min-w-0 flex-1 flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-semibold text-teal-700">
                {item.ownerName} · {item.ownerBadge}
              </p>
              <h2 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                {lang === 'id' ? item.name : item.nameEn}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-mono-num">
                {durationDays} {lang === 'id' ? 'hari' : 'days'} ({startDay}–{startDay + durationDays} Des 2026)
              </p>
            </div>
            <p className="text-xs font-bold text-[#273469] font-mono-num">
              {formatIDR(item.pricePerDay)} {copy.perDay}
            </p>
          </div>
        </div>

        {/* Delivery / Handover Method */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">{copy.deliveryMethodTitle}</h3>

          <div className="space-y-2">
            {/* Hotel / Homestay Courier */}
            <button
              type="button"
              onClick={() =>
                onChangeDelivery(
                  'hotel_courier',
                  'Hotel Tentrem Yogyakarta',
                  'Jl. P. Mangkubumi No.72A, Jetis, Kota Yogyakarta · Resepsionis'
                )
              }
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                deliveryMethod === 'hotel_courier'
                  ? 'bg-[#EFF5FB] border-[#273469]'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{copy.hotelDelivery}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {lang === 'id'
                      ? 'Kurir lokal antar & jemput ke hotel/homestay Kota Yogyakarta, Sleman, atau Bantul.'
                      : 'Local courier delivers & picks up at hotels/homestays in Yogyakarta, Sleman, or Bantul.'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#273469] font-mono-num shrink-0">
                Rp25.000
              </span>
            </button>

            {/* Bandara YIA Courier */}
            <button
              type="button"
              onClick={() =>
                onChangeDelivery(
                  'yia_courier',
                  'Bandara Internasional Yogyakarta (YIA)',
                  'Terminal Kedatangan Domestik / Internasional · Gate B Meet Point'
                )
              }
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                deliveryMethod === 'yia_courier'
                  ? 'bg-[#EFF5FB] border-[#273469]'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{copy.yiaDelivery}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {lang === 'id'
                      ? 'Temu langsung di Gate Kedatangan/Keberangkatan YIA sesuai jadwal pesawat.'
                      : 'Direct meet-and-greet at YIA Arrival/Departure gate synced to your flight.'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#273469] font-mono-num shrink-0">
                Rp45.000
              </span>
            </button>

            {/* Pickup at Partner Store */}
            <button
              type="button"
              onClick={() =>
                onChangeDelivery(
                  'pickup_hub',
                  `${item.ownerName} Hub`,
                  `${item.hubAddress} · ${item.hubHours}`
                )
              }
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                deliveryMethod === 'pickup_hub'
                  ? 'bg-[#EFF5FB] border-[#273469]'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#273469] flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{copy.pickupHub}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {item.hubAddress} · {item.hubHours}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-700 shrink-0">{copy.free}</span>
            </button>
          </div>

          {/* Selected Destination Box */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#273469]" />
                {deliveryMethod === 'pickup_hub'
                  ? lang === 'id'
                    ? 'Lokasi Hub Mitra'
                    : 'Partner Hub Location'
                  : lang === 'id'
                  ? 'Tujuan Pengantaran'
                  : 'Delivery Destination'}
              </span>
              <button
                type="button"
                onClick={() => setShowLocationPicker((v) => !v)}
                className="text-[11px] font-semibold text-[#273469] hover:underline"
              >
                {lang === 'id' ? 'Ubah Titik' : 'Change Point'}
              </button>
            </div>
            <p className="text-xs font-bold text-slate-900">{deliveryLocationName}</p>
            <p className="text-[11px] text-slate-600">{deliveryAddress}</p>

            {showLocationPicker && (
              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                {DELIVERY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onChangeDelivery(preset.method, preset.name, preset.address);
                      setShowLocationPicker(false);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-[#273469] text-[11px]"
                  >
                    <p className="font-semibold text-slate-900">{preset.name}</p>
                    <p className="text-slate-500 truncate">{preset.address}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Promo / Voucher / Referral */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#273469]" />
            <h3 className="text-sm font-bold text-slate-900">{copy.promoTitle}</h3>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="JOGJA10 / HEMAT15 / REF-AJENG"
              className="flex-1 h-11 px-3 rounded-xl border border-slate-200 text-xs font-mono-num uppercase text-slate-900 focus:outline-none focus:border-[#273469]"
            />
            <button
              type="button"
              onClick={() => handleApplyPromoCode()}
              className="h-11 px-4 rounded-xl bg-[#273469] text-white text-xs font-semibold hover:bg-[#1e2854]"
            >
              {copy.apply}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PROMO_CODES.map((p) => (
              <button
                key={p.code}
                type="button"
                onClick={() => handleApplyPromoCode(p.code)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                  appliedPromo?.code === p.code
                    ? 'bg-teal-50 border-teal-400 text-teal-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p.code}
              </button>
            ))}
          </div>

          {promoError && <p className="text-[11px] text-rose-600 font-medium">{promoError}</p>}
          {appliedPromo && (
            <div className="flex items-center justify-between text-xs text-teal-700 font-semibold pt-1">
              <span>
                {appliedPromo.code} · {lang === 'id' ? appliedPromo.labelId : appliedPromo.labelEn}
              </span>
              <button
                type="button"
                onClick={() => {
                  onApplyPromo(null);
                  setPromoInput('');
                }}
                className="text-slate-500 hover:text-slate-800 underline"
              >
                {lang === 'id' ? 'Hapus' : 'Remove'}
              </button>
            </div>
          )}
        </div>

        {/* Transparent Escrow Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{copy.paymentBreakdownTitle}</h3>
            <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              Escrow
            </span>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between text-slate-600">
              <span>
                {copy.rentBase} ({durationDays}× {formatIDR(item.pricePerDay)})
              </span>
              <span className="font-mono-num text-slate-900">{formatIDR(breakdown.baseRent)}</span>
            </div>

            {breakdown.durationDiscountAmount > 0 && (
              <div className="flex justify-between text-teal-700 font-medium">
                <span>
                  {copy.durationDiscount} ({Math.round(breakdown.durationDiscountRate * 100)}%)
                </span>
                <span className="font-mono-num">
                  -{formatIDR(breakdown.durationDiscountAmount)}
                </span>
              </div>
            )}

            {breakdown.promoDiscountAmount > 0 && (
              <div className="flex justify-between text-teal-700 font-medium">
                <span>
                  {copy.promoDiscount} ({appliedPromo?.code})
                </span>
                <span className="font-mono-num">-{formatIDR(breakdown.promoDiscountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>{copy.serviceFee8}</span>
              <span className="font-mono-num text-slate-900">
                {formatIDR(breakdown.renterServiceFee8)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>{copy.courierFee}</span>
              <span className="font-mono-num text-slate-900">
                {breakdown.courierFee === 0 ? copy.free : formatIDR(breakdown.courierFee)}
              </span>
            </div>

            <div className="flex justify-between text-slate-700 font-medium">
              <span>{copy.depositRefundable}</span>
              <span className="font-mono-num text-slate-900">
                {formatIDR(breakdown.depositAmount)}
              </span>
            </div>

            <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-slate-900">{copy.totalEscrow}</span>
                <p className="text-[10px] text-slate-500">
                  {lang === 'id'
                    ? 'Dana aman di escrow, deposit kembali 100% pasca inspeksi'
                    : 'Held in escrow, 100% deposit returned post-inspection'}
                </p>
              </div>
              <span className="text-lg font-bold text-[#273469] font-mono-num">
                {formatIDR(breakdown.totalEscrow)}
              </span>
            </div>
          </div>
        </div>

        {/* eKYC Status Gate */}
        <div
          className={`rounded-2xl border p-3.5 flex items-center justify-between gap-3 ${
            ekyc.verified
              ? 'bg-teal-50/70 border-teal-200'
              : 'bg-amber-50 border-amber-300'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldCheck
              className={`w-5 h-5 shrink-0 ${
                ekyc.verified ? 'text-teal-700' : 'text-amber-700'
              }`}
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {ekyc.verified
                  ? lang === 'id'
                    ? `eKYC Terverifikasi · ${ekyc.fullName}`
                    : `eKYC Verified · ${ekyc.fullName}`
                  : lang === 'id'
                  ? 'Verifikasi eKYC Diperlukan'
                  : 'eKYC Verification Required'}
              </p>
              <p className="text-[11px] text-slate-600 truncate font-mono-num">
                {ekyc.verified
                  ? `${ekyc.docType.toUpperCase()} ${ekyc.docNumberMasked}`
                  : lang === 'id'
                  ? 'Pindai KTP/Paspor sebelum bayar ke escrow'
                  : 'Scan ID/Passport before escrow payment'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRequireEkyc}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#273469] shrink-0"
          >
            {ekyc.verified ? (lang === 'id' ? 'Detail' : 'View') : lang === 'id' ? 'Verifikasi' : 'Verify'}
          </button>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3">
        <button
          type="button"
          onClick={() => {
            if (!ekyc.verified) {
              onRequireEkyc();
              return;
            }
            onProceedToPayment();
          }}
          className="w-full h-12 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Lock className="w-4 h-4" />
          <span>
            {ekyc.verified
              ? `${copy.payEscrow} · ${formatIDR(breakdown.totalEscrow)}`
              : lang === 'id'
              ? 'Lanjut Verifikasi eKYC →'
              : 'Verify eKYC to Continue →'}
          </span>
        </button>
      </div>
    </div>
  );
};

interface PaymentScreenProps {
  lang: Language;
  onToggleLang: () => void;
  orderId: string;
  itemName: string;
  totalEscrow: number;
  depositAmount: number;
  paymentMethod: PaymentMethod;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onBack: () => void;
  onConfirmPaid: () => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  lang,
  onToggleLang,
  orderId,
  itemName,
  totalEscrow,
  depositAmount,
  paymentMethod,
  onSelectPaymentMethod,
  onBack,
  onConfirmPaid,
}) => {
  const copy = t(lang);
  const [secondsLeft, setSecondsLeft] = useState(899);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="min-h-full bg-[#F5F8FB] flex flex-col pb-24">
      <TopBar
        title={copy.paymentTitle}
        onBack={onBack}
        lang={lang}
        onToggleLang={onToggleLang}
      />

      <div className="p-4 space-y-4">
        {/* Invoice & Countdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono-num font-semibold text-slate-600">#{orderId}</span>
            <span className="font-mono-num font-semibold text-amber-700">
              {lang === 'id' ? 'Bayar dalam' : 'Pay within'} {mins}:{secs}
            </span>
          </div>
          <p className="text-sm font-bold text-slate-900">{itemName}</p>
          <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {lang === 'id' ? 'Total Masuk Escrow (termasuk deposit)' : 'Total Escrow (incl. deposit)'}
            </span>
            <span className="text-lg font-bold text-[#273469] font-mono-num">
              {formatIDR(totalEscrow)}
            </span>
          </div>
          <p className="text-[11px] text-teal-700 font-medium">
            {lang === 'id'
              ? `Termasuk deposit refundable ${formatIDR(depositAmount)}`
              : `Includes ${formatIDR(depositAmount)} refundable deposit`}
          </p>
        </div>

        {/* Escrow Guarantee Note */}
        <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-teal-900">
          <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {lang === 'id'
              ? 'Dana ditahan aman di rekening escrow Rentiva. Dana sewa baru diteruskan ke pemilik (88% bersih) setelah barang dikembalikan sesuai kondisi.'
              : 'Funds are safely held in Rentiva Escrow. Net rental payout (88%) releases to the owner only after return inspection.'}
          </p>
        </div>

        {/* Payment Method Selector */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
          <h3 className="text-sm font-bold text-slate-900">
            {lang === 'id' ? 'Metode Pembayaran' : 'Payment Method'}
          </h3>

          {[
            {
              key: 'qris' as const,
              title: 'QRIS Instan',
              sub: 'GoPay, OVO, ShopeePay, BCA, Dana',
              icon: QrCode,
            },
            {
              key: 'va' as const,
              title: 'Virtual Account',
              sub: 'BCA, Mandiri, BNI, BRI',
              icon: Building2,
            },
            {
              key: 'card' as const,
              title: lang === 'id' ? 'Kartu Kredit / Debit' : 'Credit / Debit Card',
              sub: 'Visa, Mastercard, JCB (3D Secure)',
              icon: CreditCard,
            },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => onSelectPaymentMethod(m.key)}
                className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  paymentMethod === m.key
                    ? 'bg-[#EFF5FB] border-[#273469]'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#273469] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{m.title}</p>
                    <p className="text-[11px] text-slate-500">{m.sub}</p>
                  </div>
                </div>
                {paymentMethod === m.key && (
                  <CheckCircle2 className="w-4 h-4 text-[#273469] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Payment Instruction / QRIS Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 text-center">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {lang === 'id' ? 'Kode Referensi' : 'Reference Code'}
            </span>
            <button
              type="button"
              onClick={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              }}
              className="flex items-center gap-1 font-mono-num font-semibold text-[#273469]"
            >
              <span>8808 1234 5678 8812</span>
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          {copied && (
            <p className="text-[11px] text-teal-700 font-semibold">
              {lang === 'id' ? 'Kode disalin!' : 'Code copied!'}
            </p>
          )}

          {paymentMethod === 'qris' ? (
            <div className="py-3 flex flex-col items-center gap-2">
              <div className="w-40 h-40 rounded-2xl border border-slate-200 bg-[#F8FBFF] flex items-center justify-center p-3">
                <QrCode className="w-full h-full text-[#152D5B]" strokeWidth={1.5} />
              </div>
              <p className="text-xs text-slate-600">
                {lang === 'id'
                  ? 'Pindai QRIS Standar BI atas nama Rentiva Yogyakarta'
                  : 'Scan BI Standard QRIS for Rentiva Yogyakarta'}
              </p>
            </div>
          ) : (
            <div className="py-4 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <p className="font-semibold">
                {paymentMethod === 'va' ? 'Virtual Account BCA / Mandiri' : '3D Secure Gateway'}
              </p>
              <p className="font-mono-num text-base font-bold text-[#273469]">8808 1234 5678 8812</p>
              <p className="text-[11px] text-slate-500">
                {lang === 'id'
                  ? 'Terverifikasi otomatis dalam < 1 menit'
                  : 'Auto-verified within < 1 minute'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Confirm Payment */}
      <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3">
        <button
          type="button"
          onClick={onConfirmPaid}
          className="w-full h-12 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Lock className="w-4 h-4" />
          <span>
            {copy.payNow} · {formatIDR(totalEscrow)}
          </span>
        </button>
      </div>
    </div>
  );
};

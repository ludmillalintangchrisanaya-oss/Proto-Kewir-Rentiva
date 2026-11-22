import React, { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Heart,
  MapPin,
  MessageSquare,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { Language, RentalItem } from '../types/rentiva';
import { TopBar } from '../components/PhoneChrome';
import { ProductImage } from '../components/ProductImage';
import { calculateEscrowBreakdown, formatIDR } from '../utils/pricing';
import { t } from '../data/i18n';

interface DetailScreenProps {
  lang: Language;
  onToggleLang: () => void;
  item: RentalItem;
  durationDays: number;
  startDay: number;
  onChangeDates: (startDay: number, durationDays: number) => void;
  onBack: () => void;
  onProceedToCheckout: () => void;
  onChatOwner: (ownerName: string) => void;
}

export const DetailScreen: React.FC<DetailScreenProps> = ({
  lang,
  onToggleLang,
  item,
  durationDays,
  startDay,
  onChangeDates,
  onBack,
  onProceedToCheckout,
  onChatOwner,
}) => {
  const copy = t(lang);
  const [liked, setLiked] = useState(false);
  const [shareNote, setShareNote] = useState(false);

  const previewBreakdown = calculateEscrowBreakdown({
    pricePerDay: item.pricePerDay,
    durationDays,
    deposit: item.deposit,
    deliveryMethod: 'hotel_courier',
  });

  const endDay = startDay + durationDays;
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-h-full bg-[#F5F8FB] flex flex-col pb-24">
      <TopBar
        title={lang === 'id' ? 'Detail Perlengkapan' : 'Gear Details'}
        onBack={onBack}
        lang={lang}
        onToggleLang={onToggleLang}
        rightSlot={
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Share"
              onClick={() => {
                setShareNote(true);
                setTimeout(() => setShareNote(false), 2000);
              }}
              className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Favorite"
              onClick={() => setLiked((v) => !v)}
              className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        }
      />

      {shareNote && (
        <div className="mx-4 mt-2 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs text-center">
          {lang === 'id' ? 'Tautan produk disalin!' : 'Item link copied!'}
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Hero Product Image */}
        <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200/80 aspect-[4/3]">
          <ProductImage
            src={item.image}
            alt={lang === 'id' ? item.name : item.nameEn}
            className="w-full h-full"
          />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-sm text-[11px] font-semibold text-slate-900 shadow-sm">
              {item.conditionGrade}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-teal-700/95 text-white text-[11px] font-semibold shadow-sm">
              {item.instantConfirm
                ? lang === 'id'
                  ? 'Instan Siap'
                  : 'Instant Ready'
                : lang === 'id'
                ? 'Konfirmasi Mitra'
                : 'Owner Confirm'}
            </span>
          </div>
        </div>

        {/* Title, Price & Location */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {lang === 'id' ? item.name : item.nameEn}
            </h2>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 shrink-0 pt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono-num">{item.rating.toFixed(1)}</span>
              <span className="text-slate-400">({item.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-[#273469] font-mono-num">
              {formatIDR(item.pricePerDay)}
            </span>
            <span className="text-xs text-slate-500">{copy.perDay}</span>
            <span className="text-xs text-slate-400 mx-1">·</span>
            <span className="text-xs text-slate-600 font-mono-num">
              Deposit {formatIDR(item.deposit)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>
              {item.distanceKm} km · {item.district}, {item.area}
            </span>
          </div>

          {item.isBundle && item.bundleItems && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-[#273469] mb-1">
                {lang === 'id' ? 'Isi Paket Bundel:' : 'Bundle Includes:'}
              </p>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                {(lang === 'id' ? item.bundleItems : item.bundleItemsEn || item.bundleItems).map(
                  (b, idx) => (
                    <li key={idx}>{b}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Owner / Partner Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-slate-900 truncate">{item.ownerName}</p>
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {item.ownerBadge} · {lang === 'id' ? 'Respon' : 'Response'} {item.ownerResponseRate}%
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChatOwner(item.ownerName)}
            className="min-h-[40px] px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#273469] flex items-center gap-1.5 shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
        </div>

        {/* Interactive Duration & Calendar Picker (Proposal: 3+ days 10%, 7+ days 20%) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#273469]" />
              <h3 className="text-sm font-bold text-slate-900">{copy.selectDatesTitle}</h3>
            </div>
            <span className="text-xs font-semibold text-[#273469] font-mono-num">
              {durationDays} {lang === 'id' ? 'Hari' : 'Days'}
            </span>
          </div>

          {/* Quick Duration Presets */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { days: 1, label: lang === 'id' ? '1 Hari' : '1 Day', tag: '' },
              { days: 3, label: lang === 'id' ? '3 Hari' : '3 Days', tag: '-10%' },
              { days: 5, label: lang === 'id' ? '5 Hari' : '5 Days', tag: '-10%' },
              { days: 7, label: lang === 'id' ? '7 Hari' : '7 Days', tag: '-20%' },
            ].map((preset) => (
              <button
                key={preset.days}
                type="button"
                onClick={() => onChangeDates(startDay, preset.days)}
                className={`min-h-[40px] rounded-xl text-xs font-semibold border transition-colors flex flex-col items-center justify-center ${
                  durationDays === preset.days
                    ? 'bg-[#273469] text-white border-[#273469]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{preset.label}</span>
                {preset.tag && (
                  <span
                    className={`text-[10px] font-mono-num ${
                      durationDays === preset.days ? 'text-teal-300' : 'text-teal-700'
                    }`}
                  >
                    {preset.tag}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mini December 2026 Calendar */}
          <div className="pt-1">
            <p className="text-xs font-semibold text-slate-700 mb-2">
              {lang === 'id' ? 'Desember 2026 (Klik tanggal mulai)' : 'December 2026 (Tap start date)'}
            </p>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-400 mb-1">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const isStartOrEnd = day === startDay || day === endDay;
                const isBetween = day > startDay && day < endDay;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const safeStart = Math.min(day, 24);
                      onChangeDates(safeStart, durationDays);
                    }}
                    className={`h-8 rounded-lg text-xs font-mono-num transition-colors ${
                      isStartOrEnd
                        ? 'bg-[#273469] text-white font-semibold'
                        : isBetween
                        ? 'bg-teal-100 text-teal-900 font-medium'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Duration Discount Banner */}
          <div
            className={`p-3 rounded-xl text-xs flex items-center justify-between ${
              previewBreakdown.durationDiscountRate > 0
                ? 'bg-teal-50 border border-teal-200 text-teal-900'
                : 'bg-slate-50 border border-slate-200 text-slate-600'
            }`}
          >
            <div>
              <p className="font-semibold">
                {previewBreakdown.durationDiscountRate === 0.2
                  ? copy.discount7d
                  : previewBreakdown.durationDiscountRate === 0.1
                  ? copy.discount3d
                  : copy.discountHint}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5 font-mono-num">
                {startDay} Des – {endDay} Des 2026 ({durationDays}{' '}
                {lang === 'id' ? 'hari sewa' : 'days'})
              </p>
            </div>
            {previewBreakdown.durationDiscountAmount > 0 && (
              <span className="font-bold font-mono-num text-teal-800 shrink-0">
                -{formatIDR(previewBreakdown.durationDiscountAmount)}
              </span>
            )}
          </div>
        </div>

        {/* Specs & Hygiene Protocol */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">{copy.specsTitle}</h3>
          <div className="divide-y divide-slate-100">
            {item.specs.map((sp, i) => (
              <div key={i} className="py-2 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-500">{lang === 'id' ? sp.labelId : sp.labelEn}</span>
                <span className="font-semibold text-slate-900 text-right">
                  {lang === 'id' ? sp.valueId : sp.valueEn}
                </span>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100 flex items-start gap-2.5 text-xs text-teal-900">
            <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {lang === 'id' ? item.hygieneNoteId : item.hygieneNoteEn}
            </p>
          </div>
        </div>

        {/* Reviews */}
        {item.reviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'id' ? 'Ulasan Kebersihan & Unit' : 'Hygiene & Gear Reviews'}
            </h3>
            <div className="space-y-3">
              {item.reviews.map((rev) => (
                <div key={rev.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">
                      {rev.author} · <span className="text-slate-500 font-normal">{lang === 'id' ? rev.roleId : rev.roleEn}</span>
                    </span>
                    <span className="text-xs font-semibold text-teal-700 font-mono-num">
                      {rev.rating.toFixed(1)} ★
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "{lang === 'id' ? rev.textId : rev.textEn}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA */}
      <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] text-slate-500">
            {lang === 'id' ? 'Estimasi sewa' : 'Est. rental'} ({durationDays}{' '}
            {lang === 'id' ? 'hari' : 'days'})
          </p>
          <p className="text-base font-bold text-[#273469] font-mono-num">
            {formatIDR(previewBreakdown.rentAfterDiscounts)}
          </p>
        </div>
        <button
          type="button"
          onClick={onProceedToCheckout}
          className="h-12 px-5 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white font-semibold text-sm flex items-center gap-2 active:scale-[0.98] transition-all shrink-0"
        >
          <span>{copy.continueBooking}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

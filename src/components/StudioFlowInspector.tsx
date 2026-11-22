import React from 'react';
import { RotateCcw } from 'lucide-react';
import {
  Language,
  OrderBreakdown,
  RoleMode,
  ScreenId,
} from '../types/rentiva';
import { RentivaLogo } from './RentivaLogo';
import { formatIDR } from '../utils/pricing';

interface StudioFlowInspectorProps {
  lang: Language;
  onToggleLang: () => void;
  roleMode: RoleMode;
  onSwitchRole: (role: RoleMode) => void;
  currentScreen: ScreenId;
  onJumpScreen: (screen: ScreenId) => void;
  onResetDemo: () => void;
  liveBreakdown: OrderBreakdown;
  activeOrderId: string;
}

export const StudioFlowInspector: React.FC<StudioFlowInspectorProps> = ({
  lang,
  onToggleLang,
  roleMode,
  onSwitchRole,
  currentScreen,
  onJumpScreen,
  onResetDemo,
  liveBreakdown,
  activeOrderId,
}) => {
  const entryScreens: { id: ScreenId; label: string }[] = [
    { id: 'splash', label: 'Splash' },
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'login', label: 'Login' },
    { id: 'register', label: 'Daftar' },
    { id: 'otp', label: 'OTP' },
    { id: 'chat', label: 'Chat' },
    { id: 'profile', label: 'Profil' },
  ];

  const elevenSteps: {
    step: number;
    screen: ScreenId;
    titleId: string;
    titleEn: string;
    subId: string;
    subEn: string;
  }[] = [
    {
      step: 1,
      screen: 'detail',
      titleId: 'Pilih Barang, Durasi & Diskon',
      titleEn: 'Select Gear, Dates & Discount',
      subId: 'Kamera, Outdoor, Bayi, Bundel · 3h -10%, 7h -20%',
      subEn: 'Camera, Outdoor, Baby, Bundles · 3d -10%, 7d -20%',
    },
    {
      step: 2,
      screen: 'ekyc',
      titleId: 'Verifikasi Identitas (eKYC)',
      titleEn: 'Identity Verification (eKYC)',
      subId: 'KTP WNI / Paspor WNA, Nomor Aktif & Biometrik',
      subEn: 'e-KTP / Passport, Active Phone & Biometric Consent',
    },
    {
      step: 3,
      screen: 'checkout',
      titleId: 'Checkout & Pembayaran Escrow',
      titleEn: 'Checkout & Escrow Payment',
      subId: 'Biaya sewa + layanan 8% + deposit + promo',
      subEn: 'Rental + 8% fee + refundable deposit + promo',
    },
    {
      step: 4,
      screen: 'order_waiting',
      titleId: 'Konfirmasi Pemilik',
      titleEn: 'Owner Confirmation',
      subId: 'Batas respon 2 jam (auto-refund 100%)',
      subEn: '2-hour SLA (100% auto-refund protection)',
    },
    {
      step: 5,
      screen: 'pre_condition',
      titleId: 'Foto Kondisi Awal & Kebersihan',
      titleEn: 'Pre-Rental Photos & Hygiene',
      subId: '4 sudut foto terenkripsi + checklist UV-C',
      subEn: '4 encrypted photo angles + UV-C checklist',
    },
    {
      step: 6,
      screen: 'handover',
      titleId: 'Serah-Terima (Hotel / YIA / Toko)',
      titleEn: 'Handover (Hotel / YIA / Hub)',
      subId: 'Peta kurir lokal atau QR ambil di hub mitra',
      subEn: 'Live local courier map or partner hub QR',
    },
    {
      step: 7,
      screen: 'active_rental',
      titleId: 'Masa Pemakaian Aktif',
      titleEn: 'Active Usage Period',
      subId: 'Pantau durasi, perpanjang, & ajukan kembali',
      subEn: 'Track duration, extend, or initiate return',
    },
    {
      step: 8,
      screen: 'return_condition',
      titleId: 'Pengembalian & Foto Kondisi Akhir',
      titleEn: 'Return & Final Condition Photos',
      subId: 'Unggah bukti kondisi akhir sebelum inspeksi',
      subEn: 'Upload final condition evidence pre-inspection',
    },
    {
      step: 9,
      screen: 'inspection_escrow',
      titleId: 'Inspeksi Pemilik & Klaim Sengketa',
      titleEn: 'Owner Inspection & Dispute',
      subId: 'Verifikasi unit oleh mitra atau mediasi sengketa',
      subEn: 'Partner verification or escrow mediation',
    },
    {
      step: 10,
      screen: 'inspection_escrow',
      titleId: 'Pelepasan Deposit 100% & Mitra 88%',
      titleEn: '100% Deposit & 88% Owner Release',
      subId: 'Deposit kembali penuh · Mitra terima 88% bersih',
      subEn: 'Full deposit refund · 88% net to owner',
    },
    {
      step: 11,
      screen: 'review',
      titleId: 'Ulasan Dua Arah',
      titleEn: 'Two-Way Review',
      subId: 'Penilaian kebersihan, kurir & skor balik pemilik',
      subEn: 'Cleanliness, courier & reciprocal owner rating',
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm h-[820px] overflow-y-auto phone-scroll">
      <div className="space-y-5">
        {/* Top Brand + Controls */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <RentivaLogo size="md" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Rentiva Interactive Prototype
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'id'
                  ? 'Cukup Sewa, Tidak Perlu Beli · Yogyakarta, Sleman & Bantul'
                  : 'Rent Simply, No Need to Buy · Yogyakarta, Sleman & Bantul'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/80">
              <button
                type="button"
                onClick={() => lang !== 'id' && onToggleLang()}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                  lang === 'id' ? 'bg-[#273469] text-white' : 'text-slate-600'
                }`}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => lang !== 'en' && onToggleLang()}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                  lang === 'en' ? 'bg-[#273469] text-white' : 'text-slate-600'
                }`}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              onClick={onResetDemo}
              title="Reset Prototype"
              className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/70">
          <button
            type="button"
            onClick={() => onSwitchRole('renter')}
            className={`h-10 rounded-lg text-xs font-semibold transition-colors ${
              roleMode === 'renter'
                ? 'bg-[#273469] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {lang === 'id' ? 'Mode Penyewa (Wisatawan)' : 'Renter Mode (Traveler)'}
          </button>
          <button
            type="button"
            onClick={() => onSwitchRole('owner')}
            className={`h-10 rounded-lg text-xs font-semibold transition-colors ${
              roleMode === 'owner'
                ? 'bg-[#273469] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {lang === 'id' ? 'Dashboard Pemilik / Mitra Toko' : 'Owner / Partner Dashboard'}
          </button>
        </div>

        {/* Quick Jump: Sequential Entry & Core Tabs */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            {lang === 'id'
              ? 'Urutan Awal: Splash → Onboarding → Login / Daftar → Beranda Utama'
              : 'Entry Flow: Splash → Onboarding → Login / Sign Up → Home'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {entryScreens.slice(0, 5).map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  onSwitchRole('renter');
                  onJumpScreen(sc.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  currentScreen === sc.id
                    ? 'bg-[#273469] text-white border-[#273469]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {sc.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                onSwitchRole('renter');
                onJumpScreen('explore');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                currentScreen === 'explore'
                  ? 'bg-[#273469] text-white border-[#273469]'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {lang === 'id' ? 'Beranda Utama' : 'Main Home'}
            </button>
            {entryScreens.slice(5).map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  onSwitchRole('renter');
                  onJumpScreen(sc.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  currentScreen === sc.id
                    ? 'bg-[#273469] text-white border-[#273469]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* 11-Step Operational Flow Map */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            {lang === 'id'
              ? 'Alur Sewa & Escrow (11 Langkah Proposal — Klik untuk Lompat)'
              : '11-Step Rental & Escrow Flow (Click to Inspect)'}
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {elevenSteps.map((st) => {
              const isActive = currentScreen === st.screen;
              return (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => {
                    onSwitchRole('renter');
                    onJumpScreen(st.screen);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl border transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-[#EFF5FB] border-[#273469] text-slate-900'
                      : 'bg-white border-slate-100 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-[11px] font-bold font-mono-num flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-[#273469] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {st.step}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate">
                      {lang === 'id' ? st.titleId : st.titleEn}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {lang === 'id' ? st.subId : st.subEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Escrow Math Ledger */}
      <div className="mt-5 pt-4 border-t border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">
            {lang === 'id' ? 'Simulasi Ledger Escrow Aktif' : 'Live Escrow Ledger'}
          </span>
          <span className="font-mono-num text-slate-500">#{activeOrderId}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>{lang === 'id' ? 'Layanan Penyewa (8%)' : 'Renter Fee (8%)'}</span>
            <span className="font-mono-num font-semibold text-slate-900">
              {formatIDR(liveBreakdown.renterServiceFee8)}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{lang === 'id' ? 'Komisi Platform (12%)' : 'Platform Fee (12%)'}</span>
            <span className="font-mono-num font-semibold text-slate-900">
              {formatIDR(liveBreakdown.platformCommission12)}
            </span>
          </div>
          <div className="flex justify-between text-teal-700 font-medium">
            <span>{lang === 'id' ? 'Deposit (100% Kembali)' : 'Deposit (100% Back)'}</span>
            <span className="font-mono-num font-semibold">
              {formatIDR(liveBreakdown.depositAmount)}
            </span>
          </div>
          <div className="flex justify-between text-[#273469] font-semibold">
            <span>{lang === 'id' ? 'Bersih Mitra (88%)' : 'Owner Net (88%)'}</span>
            <span className="font-mono-num">{formatIDR(liveBreakdown.ownerNet88)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

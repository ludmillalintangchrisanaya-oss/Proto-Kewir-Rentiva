import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MessageCircle,
  Plane,
  ShieldCheck,
  Tent,
  Baby,
  User,
} from 'lucide-react';
import { Language, ScreenId } from '../types/rentiva';
import { RentivaLogo } from '../components/RentivaLogo';
import { t } from '../data/i18n';

interface AuthProps {
  screen: 'splash' | 'onboarding' | 'login' | 'register' | 'otp';
  lang: Language;
  onToggleLang: () => void;
  onNavigate: (screen: ScreenId) => void;
  userEmail: string;
  userName: string;
  onUpdateUser: (name: string, email: string, phone: string) => void;
}

export const AuthScreens: React.FC<AuthProps> = ({
  screen,
  lang,
  onToggleLang,
  onNavigate,
  userEmail,
  userName,
  onUpdateUser,
}) => {
  const copy = t(lang);
  const [slide, setSlide] = useState(0);
  const [email, setEmail] = useState(userEmail || 'ajeng.prasetya@email.com');
  const [password, setPassword] = useState('Rentiva2026!');
  const [showPw, setShowPw] = useState(false);
  const [fullName, setFullName] = useState(userName || 'Ajeng Prasetya');
  const [phone, setPhone] = useState('812 3456 7890');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreePdp, setAgreePdp] = useState(true);
  const [otpDigits, setOtpDigits] = useState(['4', '8', '2', '9', '1', '6']);
  const [countdown, setCountdown] = useState(29);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (screen !== 'otp') return;
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [screen, countdown]);

  const showNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    if (screen !== 'splash') return;
    setSlide(0);
    const timer = setTimeout(() => {
      onNavigate('onboarding');
    }, 2400);
    return () => clearTimeout(timer);
  }, [screen, onNavigate]);

  if (screen === 'splash') {
    return (
      <div className="h-full min-h-[680px] flex flex-col justify-between bg-gradient-to-b from-[#0C223D] via-[#152D5B] to-[#1D356A] text-white px-6 py-10">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onToggleLang}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            {lang === 'id' ? 'ID · EN' : 'EN · ID'}
          </button>
        </div>

        <div className="flex flex-col items-center text-center my-auto">
          <RentivaLogo size="lg" className="mb-5 shadow-xl shadow-black/25" />
          <h1 className="text-3xl font-bold tracking-tight">Rentiva</h1>
          <p className="mt-2 text-xs text-teal-200 font-medium tracking-wide">
            {lang === 'id' ? 'Marketplace Rental Terverifikasi' : 'Verified Rental Marketplace'}
          </p>

          <div className="mt-7 w-36 h-1 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full bg-teal-300 rounded-full animate-[pulse_1.4s_ease-in-out_infinite] w-2/3 mx-auto" />
          </div>

          <button
            type="button"
            onClick={() => onNavigate('onboarding')}
            className="mt-6 px-6 py-3 rounded-xl bg-white text-[#152D5B] font-semibold text-sm flex items-center gap-2 hover:bg-teal-50 active:scale-[0.98] transition-all shadow-lg"
          >
            <span>{lang === 'id' ? 'Mulai Sekarang' : 'Get Started'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center space-y-1">
          <p className="text-xs text-slate-200 font-medium">
            {copy.tagline} · Yogyakarta
          </p>
          <p className="text-[11px] text-slate-400">from Aurevia</p>
        </div>
      </div>
    );
  }

  if (screen === 'onboarding') {
    const slides = [
      {
        badge: lang === 'id' ? '100% Terverifikasi & Higienis' : '100% Verified & Hygienic',
        title: lang === 'id' ? 'Cukup Sewa, Tidak Perlu Beli' : 'Rent Simply, No Need to Buy',
        desc:
          lang === 'id'
            ? 'Menyewakan perlengkapan bayi, kamera, dan camping terverifikasi di Kota Yogyakarta, Sleman, dan Bantul.'
            : 'Rent verified baby gear, cameras, and camping equipment across Yogyakarta, Sleman, and Bantul.',
        footer: lang === 'id' ? 'Mitra lokal terpercaya se-DIY' : 'Trusted local partners across DIY',
        visual: (
          <div className="flex items-center justify-center gap-4 py-8">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
              <Baby className="w-8 h-8" />
            </div>
            <div className="w-20 h-20 rounded-2xl bg-[#273469]/10 border border-[#273469]/15 flex items-center justify-center text-[#273469]">
              <Camera className="w-10 h-10" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
              <Tent className="w-8 h-8" />
            </div>
          </div>
        ),
      },
      {
        badge: lang === 'id' ? 'Antar Langsung · Tepat Waktu' : 'Direct Delivery · On Time',
        title:
          lang === 'id'
            ? 'Diantar ke Hotel atau Bandara YIA'
            : 'Delivered to Hotel or YIA Airport',
        desc:
          lang === 'id'
            ? 'Ambil langsung di toko mitra atau gunakan kurir lokal ke hotel, homestay, maupun Bandara YIA.'
            : 'Pick up at partner hubs or use local courier delivery to hotels, homestays, or YIA Airport.',
        footer:
          lang === 'id'
            ? 'Peralatan steril & garansi tepat jadwal'
            : 'Sterilized gear & on-time guarantee',
        visual: (
          <div className="flex flex-col items-center justify-center py-7 gap-3">
            <div className="w-20 h-20 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
              <Plane className="w-9 h-9" />
            </div>
            <div className="text-xs text-slate-600 font-medium">
              YIA Airport · Hotel Tentrem · Stasiun Tugu · Hub Sleman
            </div>
          </div>
        ),
      },
      {
        badge: lang === 'id' ? '100% Garansi Escrow' : '100% Escrow Protected',
        title: lang === 'id' ? 'Transaksi Aman dengan Escrow' : 'Safe Escrow Transactions',
        desc:
          lang === 'id'
            ? 'Dana ditahan aman di escrow, kondisi barang didokumentasikan lewat foto, dan deposit kembali 100% setelah pengembalian.'
            : 'Funds stay safe in escrow, item condition is photo-documented, and 100% deposit returns after handover.',
        footer:
          lang === 'id'
            ? 'Sistem escrow bergaransi resmi Rentiva'
            : 'Official Rentiva guaranteed escrow system',
        visual: (
          <div className="flex flex-col items-center justify-center py-7 gap-3">
            <div className="w-20 h-20 rounded-2xl bg-[#273469]/10 border border-[#273469]/15 flex items-center justify-center text-[#273469]">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {lang === 'id'
                ? 'Kondisi Tervalidasi · Deposit Kembali Otomatis'
                : 'Validated Condition · Auto Deposit Release'}
            </div>
          </div>
        ),
      },
    ];

    const current = slides[slide];

    return (
      <div className="h-full min-h-[680px] flex flex-col justify-between bg-[#F2F9F9] px-5 py-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="min-h-[44px] px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            {copy.skip}
          </button>
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-slate-200">
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
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm my-4">
          {current.visual}
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-teal-700 pt-2 border-t border-slate-100">
            <CheckCircle2 className="w-4 h-4" />
            <span>{current.badge}</span>
          </div>
        </div>

        <div className="text-center space-y-2.5 px-2">
          <h2 className="text-2xl font-bold text-slate-900 leading-tight text-balance">
            {current.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">{current.desc}</p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  slide === idx ? 'w-7 bg-[#273469]' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              if (slide < slides.length - 1) setSlide((s) => s + 1);
              else onNavigate('login');
            }}
            className="w-full h-12 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <span>{slide < slides.length - 1 ? copy.next : copy.start}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>{current.footer}</span>
          </p>
        </div>
      </div>
    );
  }

  if (screen === 'login') {
    return (
      <div className="min-h-full bg-[#F7FAFC] px-5 py-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => onNavigate('onboarding')}
              aria-label={copy.back}
              className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-slate-200">
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
          </div>

          <div className="flex items-center gap-2.5 mb-4">
            <RentivaLogo size="sm" />
            <span className="font-display font-bold text-base text-[#273469]">Rentiva</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">{copy.loginTitle}</h2>
          <p className="text-sm text-slate-600 mt-1 mb-6">{copy.loginSub}</p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateUser(fullName, email, '+62 ' + phone);
              onNavigate('explore');
            }}
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {copy.email}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#273469]/20 focus:border-[#273469]"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {copy.password}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-10 pr-11 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#273469]/20 focus:border-[#273469]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label="Toggle password"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() =>
                    showNotice(
                      lang === 'id'
                        ? 'Tautan reset kata sandi dikirim ke email Anda.'
                        : 'Password reset link sent to your email.'
                    )
                  }
                  className="text-xs font-semibold text-[#273469] hover:underline"
                >
                  {copy.forgotPw}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>{copy.signIn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
            <div className="flex-1 h-px bg-slate-200" />
            <span>{copy.orWith}</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className="h-11 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className="h-11 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              Apple
            </button>
          </div>
        </div>

        <div className="pt-6 space-y-3 text-center">
          <p className="text-sm text-slate-600">
            {copy.noAccount}{' '}
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="font-semibold text-[#273469] hover:underline"
            >
              {copy.registerNow}
            </button>
          </p>
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            <span>
              {lang === 'id'
                ? 'Dilindungi enkripsi end-to-end 256-bit'
                : 'Protected by 256-bit end-to-end encryption'}
            </span>
          </p>
        </div>

        {toast && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg z-50">
            {toast}
          </div>
        )}
      </div>
    );
  }

  if (screen === 'register') {
    const canSubmit = fullName.trim().length > 2 && email.includes('@') && agreeTerms && agreePdp;
    return (
      <div className="min-h-full bg-[#F7FAFC] px-5 py-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              aria-label={copy.back}
              className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <RentivaLogo size="sm" />
              <span className="font-display font-bold text-sm text-[#273469]">Rentiva</span>
            </div>
            <button
              type="button"
              onClick={onToggleLang}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              {lang.toUpperCase()}
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">{copy.registerTitle}</h2>
          <p className="text-sm text-slate-600 mt-1 mb-5">{copy.registerSub}</p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSubmit) return;
              onUpdateUser(fullName, email, '+62 ' + phone);
              onNavigate('otp');
            }}
          >
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">{copy.fullName}</label>
                <span className="text-[11px] text-slate-500">
                  {lang === 'id' ? 'Sesuai KTP / Paspor' : 'As on ID / Passport'}
                </span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-white border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">{copy.email}</label>
                <span className="text-[11px] text-slate-500">
                  {lang === 'id' ? 'Untuk konfirmasi sewa' : 'For booking receipts'}
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-white border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {copy.phone}
              </label>
              <div className="flex items-center bg-white border border-slate-200 rounded-xl h-11 px-3 gap-2">
                <span className="text-xs font-semibold text-slate-700 shrink-0">ID +62</span>
                <div className="w-px h-5 bg-slate-200" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 text-sm text-slate-900 focus:outline-none font-mono-num"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[#273469]"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'id'
                    ? 'Saya menyetujui Syarat & Ketentuan dan Kebijakan Privasi Rentiva.'
                    : 'I agree to Rentiva Terms & Conditions and Privacy Policy.'}
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePdp}
                  onChange={(e) => setAgreePdp(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[#273469]"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'id'
                    ? 'Saya menyetujui pemrosesan data pribadi sesuai UU No. 27 Tahun 2022 (PDP). Data disensor otomatis.'
                    : 'I consent to personal data processing under PDP Law No. 27/2022. Sensitive data auto-masked.'}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                canSubmit
                  ? 'bg-[#273469] text-white hover:bg-[#1e2854]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{copy.registerBtn}</span>
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-600 pt-5">
          {copy.haveAccount}{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-semibold text-[#273469] hover:underline"
          >
            {copy.signIn}
          </button>
        </p>
      </div>
    );
  }

  // OTP Verification
  const maskedEmail = email.replace(/(.{2}).+(@.+)/, '$1***$2');
  return (
    <div className="min-h-full bg-[#F7FAFC] px-5 py-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => onNavigate('register')}
            aria-label={copy.back}
            className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onToggleLang}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            {lang.toUpperCase()}
          </button>
        </div>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{copy.otpTitle}</h2>
          <p className="text-sm text-slate-600 mt-1">
            {copy.otpSub}{' '}
            <span className="font-semibold text-slate-900">{maskedEmail}</span>
          </p>

          <div className="grid grid-cols-6 gap-2 mt-7 w-full max-w-[320px]">
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  const next = [...otpDigits];
                  next[i] = val;
                  setOtpDigits(next);
                }}
                className="h-12 text-center text-lg font-bold font-mono-num bg-white border-2 border-slate-200 focus:border-teal-600 rounded-xl focus:outline-none"
              />
            ))}
          </div>

          <div className="mt-5 text-xs text-slate-600">
            {countdown > 0 ? (
              <span>
                {lang === 'id' ? 'Kirim ulang kode dalam' : 'Resend code in'}{' '}
                <strong className="font-mono-num text-[#273469]">
                  00:{String(countdown).padStart(2, '0')}
                </strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setCountdown(30)}
                className="font-semibold text-[#273469] hover:underline"
              >
                {lang === 'id' ? 'Kirim ulang kode OTP' : 'Resend OTP code'}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              showNotice(
                lang === 'id'
                  ? 'Kode OTP dikirim via WhatsApp ke +62 812-3456-7890'
                  : 'OTP code sent via WhatsApp to +62 812-3456-7890'
              )
            }
            className="mt-3 text-xs font-semibold text-teal-700 flex items-center gap-1.5 hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>
              {lang === 'id'
                ? 'Gunakan metode lain (WhatsApp / SMS)'
                : 'Use another method (WhatsApp / SMS)'}
            </span>
          </button>
        </div>
      </div>

      <div className="space-y-3 pt-8">
        <button
          type="button"
          onClick={() => onNavigate('explore')}
          className="w-full h-12 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <span>
            {lang === 'id' ? 'Verifikasi & Masuk Beranda Utama' : 'Verify & Go to Home'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate('ekyc')}
          className="w-full py-2 text-center text-xs font-semibold text-[#273469] hover:underline"
        >
          {lang === 'id'
            ? 'Atau lengkapi verifikasi eKYC sekarang →'
            : 'Or complete eKYC verification now →'}
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

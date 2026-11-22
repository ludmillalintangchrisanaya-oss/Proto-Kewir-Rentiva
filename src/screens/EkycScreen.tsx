import React, { useState } from 'react';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  CreditCard,
  Globe,
  PhoneCall,
  ScanFace,
  ShieldCheck,
  X,
} from 'lucide-react';
import { EkycState, Language } from '../types/rentiva';
import { TopBar } from '../components/PhoneChrome';
import { t } from '../data/i18n';

interface EkycScreenProps {
  lang: Language;
  onToggleLang: () => void;
  ekyc: EkycState;
  onUpdateEkyc: (next: EkycState) => void;
  onBack: () => void;
  onComplete: () => void;
}

export const EkycScreen: React.FC<EkycScreenProps> = ({
  lang,
  onToggleLang,
  ekyc,
  onUpdateEkyc,
  onBack,
  onComplete,
}) => {
  const copy = t(lang);
  const [docType, setDocType] = useState<'ktp' | 'passport'>(ekyc.docType);
  const [docNumber, setDocNumber] = useState(
    docType === 'ktp' ? '2172014508961234' : 'A92847181'
  );
  const [phone, setPhone] = useState(ekyc.phone || '+62 812-3456-7890');
  const [docScanned, setDocScanned] = useState(ekyc.docScanned);
  const [faceMatched, setFaceMatched] = useState(ekyc.faceMatched);
  const [showConsentSheet, setShowConsentSheet] = useState(!ekyc.biometricConsented);
  const [consentChecked, setConsentChecked] = useState(ekyc.biometricConsented);

  const maskDoc = (raw: string) => {
    if (raw.length <= 6) return raw;
    return `${raw.slice(0, 4)}••••••••${raw.slice(-4)}`;
  };

  const handleConsentConfirm = () => {
    if (!consentChecked) return;
    onUpdateEkyc({
      ...ekyc,
      biometricConsented: true,
    });
    setShowConsentSheet(false);
  };

  const handleFinishEkyc = () => {
    onUpdateEkyc({
      verified: true,
      docType,
      fullName: ekyc.fullName || 'Ajeng Prasetya',
      docNumberMasked: maskDoc(docNumber),
      phone,
      phoneVerified: true,
      docScanned: true,
      faceMatched: true,
      biometricConsented: true,
    });
    onComplete();
  };

  const canFinish = docScanned && faceMatched && docNumber.trim().length >= 6 && phone.trim().length >= 8;

  return (
    <div className="relative min-h-full bg-[#F5F8FB] flex flex-col">
      <TopBar
        title={copy.ekycTitle}
        subtitle={copy.ekycStepInfo}
        onBack={onBack}
        lang={lang}
        onToggleLang={onToggleLang}
      />

      <div className="p-4 space-y-4 flex-1 pb-24">
        {/* Step indicator */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-900">
              {lang === 'id' ? 'Pindai Identitas & Swafoto' : 'Scan ID & Selfie Liveness'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {lang === 'id'
                ? 'Langkah 2 dari 11 · Perlindungan Data UU PDP'
                : 'Step 2 of 11 · PDP Law Protected'}
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-700 font-mono-num">
            {(docScanned ? 1 : 0) + (faceMatched ? 1 : 0)}/2
          </span>
        </div>

        {/* Document Type Switch: KTP WNI vs Paspor WNA */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/70 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setDocType('ktp');
              setDocNumber('2172014508961234');
            }}
            className={`min-h-[44px] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              docType === 'ktp'
                ? 'bg-[#273469] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{lang === 'id' ? 'KTP Elektronik (WNI)' : 'e-KTP (Indonesian)'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setDocType('passport');
              setDocNumber('A92847181');
            }}
            className={`min-h-[44px] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              docType === 'passport'
                ? 'bg-[#273469] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{lang === 'id' ? 'Paspor (WNA / Turis)' : 'Passport (Tourist)'}</span>
          </button>
        </div>

        {/* Document & Active Phone Fields */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {docType === 'ktp'
                ? lang === 'id'
                  ? 'Nomor Induk Kependudukan (NIK)'
                  : 'National ID Number (NIK)'
                : lang === 'id'
                ? 'Nomor Paspor Aktif'
                : 'Active Passport Number'}
            </label>
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm font-mono-num text-slate-900 focus:outline-none focus:border-[#273469]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                {lang === 'id' ? 'Nomor Ponsel / WhatsApp Aktif' : 'Active Phone / WhatsApp'}
              </label>
              <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === 'id' ? 'OTP Terverifikasi' : 'OTP Verified'}
              </span>
            </div>
            <div className="relative">
              <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 pl-9 pr-3 rounded-xl border border-slate-200 text-sm font-mono-num text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Step 1: ID Camera Frame */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              {docType === 'ktp'
                ? lang === 'id'
                  ? '1. Foto KTP Asli'
                  : '1. Original e-KTP Photo'
                : lang === 'id'
                ? '1. Foto Halaman Biodata Paspor'
                : '1. Passport Bio-Page Photo'}
            </h3>
            {docScanned && (
              <span className="text-xs font-semibold text-teal-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {lang === 'id' ? 'Terbaca' : 'Captured'}
              </span>
            )}
          </div>

          <div
            className={`relative rounded-xl border-2 border-dashed p-4 transition-colors ${
              docScanned
                ? 'border-teal-500 bg-teal-50/40'
                : 'border-slate-300 bg-slate-900 text-white'
            }`}
          >
            {docScanned ? (
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-900">
                    {docType === 'ktp' ? 'KTP Elektronik · Republik Indonesia' : 'Passport · International'}
                  </p>
                  <p className="text-xs text-slate-600">{ekyc.fullName || 'Ajeng Prasetya'}</p>
                  <p className="text-xs font-mono-num text-slate-500">{maskDoc(docNumber)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDocScanned(false)}
                  className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
                >
                  {lang === 'id' ? 'Ulangi' : 'Retake'}
                </button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="mx-auto w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-teal-300" />
                </div>
                <p className="text-xs text-slate-200 max-w-[240px] mx-auto">
                  {lang === 'id'
                    ? 'Posisikan dokumen di dalam bingkai tanpa pantulan cahaya.'
                    : 'Align your document inside the frame without glare.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (!ekyc.biometricConsented) setShowConsentSheet(true);
                    else setDocScanned(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs"
                >
                  {lang === 'id' ? 'Ambil Foto Dokumen' : 'Capture Document'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Selfie Liveness */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              {lang === 'id' ? '2. Verifikasi Wajah (Liveness)' : '2. Selfie Face Match'}
            </h3>
            {faceMatched && (
              <span className="text-xs font-semibold text-teal-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {lang === 'id' ? 'Cocok 99%' : '99% Match'}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  faceMatched ? 'bg-teal-100 text-teal-700' : 'bg-[#273469]/10 text-[#273469]'
                }`}
              >
                <ScanFace className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  {faceMatched
                    ? lang === 'id'
                      ? 'Biometrik Wajah Terverifikasi'
                      : 'Face Biometric Verified'
                    : lang === 'id'
                    ? 'Posisikan wajah di dalam lingkaran'
                    : 'Center your face inside the circle'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {lang === 'id'
                    ? 'Hanya dipakai untuk pencocokan identitas'
                    : 'Used strictly for identity matching'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!ekyc.biometricConsented) setShowConsentSheet(true);
                else setFaceMatched(true);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 ${
                faceMatched
                  ? 'bg-white border border-slate-200 text-slate-700'
                  : 'bg-[#273469] text-white hover:bg-[#1e2854]'
              }`}
            >
              {faceMatched
                ? lang === 'id'
                  ? 'Selesai'
                  : 'Verified'
                : lang === 'id'
                ? 'Mulai Scan'
                : 'Scan Face'}
            </button>
          </div>
        </div>

        {/* Sticky Submit */}
        <button
          type="button"
          disabled={!canFinish}
          onClick={handleFinishEkyc}
          className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
            canFinish
              ? 'bg-[#273469] hover:bg-[#1e2854] text-white'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>
            {lang === 'id' ? 'Simpan & Aktifkan Status Terverifikasi' : 'Verify & Continue'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {!canFinish && (
          <button
            type="button"
            onClick={() => {
              onUpdateEkyc({ ...ekyc, biometricConsented: true });
              setShowConsentSheet(false);
              setConsentChecked(true);
              setDocScanned(true);
              setFaceMatched(true);
            }}
            className="w-full py-2.5 text-xs font-semibold text-[#273469] hover:underline"
          >
            {lang === 'id'
              ? 'Isi Cepat Simulasi eKYC (Demo)'
              : 'Quick-Fill eKYC Simulation (Demo)'}
          </button>
        )}
      </div>

      {/* Biometric Consent Bottom Sheet (harmonized from reference screenshot) */}
      {showConsentSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 backdrop-blur-[2px]">
          <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-5 space-y-4 shadow-2xl">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#273469]/10 text-[#273469] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {lang === 'id' ? 'Persetujuan Data Biometrik' : 'Biometric Data Consent'}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowConsentSheet(false)}
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {lang === 'id'
                ? 'Kami memakai foto wajah & dokumen Anda hanya untuk mencocokkan identitas penyewa dan menghapusnya sesuai kebijakan retensi UU PDP.'
                : 'We use your facial and ID photo strictly to verify renter identity and delete biometric templates under our PDP retention policy.'}
            </p>

            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[#EFF5FB] border border-[#273469]/15 cursor-pointer">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="w-4 h-4 rounded accent-[#273469]"
              />
              <span className="text-sm font-semibold text-slate-900">
                {lang === 'id' ? 'Saya setuju' : 'I agree'}
              </span>
            </label>

            <button
              type="button"
              disabled={!consentChecked}
              onClick={handleConsentConfirm}
              className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                consentChecked
                  ? 'bg-[#273469] text-white hover:bg-[#1e2854]'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>{lang === 'id' ? 'Setuju & Mulai Scan' : 'Agree & Start Scan'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              {lang === 'id' ? 'Batal' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

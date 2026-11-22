import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Plus,
  ShieldCheck,
  Store,
  Wallet,
  X,
} from 'lucide-react';
import {
  CategoryKey,
  EkycState,
  JogjaArea,
  Language,
  OrderRecord,
  RentalItem,
  RoleMode,
  ScreenId,
} from '../types/rentiva';
import { TopBar } from '../components/PhoneChrome';
import { ProductImage } from '../components/ProductImage';
import { formatIDR } from '../utils/pricing';
import { t } from '../data/i18n';

interface ProfileScreenProps {
  lang: Language;
  onToggleLang: () => void;
  ekyc: EkycState;
  onToggleEkycStatus: () => void;
  onNavigate: (screen: ScreenId) => void;
  onSwitchRole: (role: RoleMode) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  lang,
  onToggleLang,
  ekyc,
  onToggleEkycStatus,
  onNavigate,
  onSwitchRole,
}) => {
  const copy = t(lang);
  const [infoModal, setInfoModal] = useState<'pdp' | 'terms' | 'help' | null>(null);

  return (
    <div className="min-h-full bg-[#F5F8FB] pb-8">
      <TopBar
        title={copy.profile}
        lang={lang}
        onToggleLang={onToggleLang}
        onBack={() => onNavigate('explore')}
      />

      <div className="p-4 space-y-4">
        {/* User Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#273469] text-white flex items-center justify-center font-bold text-lg shrink-0">
              {ekyc.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-slate-900 truncate">{ekyc.fullName}</h2>
                {ekyc.verified && <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />}
              </div>
              <p className="text-xs font-mono-num text-slate-500 mt-0.5">
                {ekyc.docType.toUpperCase()} {ekyc.docNumberMasked} · {ekyc.phone}
              </p>
              <p className="text-xs text-teal-700 font-semibold mt-0.5">
                {ekyc.verified
                  ? lang === 'id'
                    ? 'Terverifikasi via eKYC · Penyewa Terpercaya'
                    : 'Verified via eKYC · Trusted Renter'
                  : lang === 'id'
                  ? 'eKYC Belum Lengkap'
                  : 'eKYC Incomplete'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] text-slate-500">
                {lang === 'id' ? 'Barang Tersewa' : 'Items Rented'}
              </p>
              <p className="text-base font-bold text-slate-900 font-mono-num mt-0.5">14 item</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] text-slate-500">
                {lang === 'id' ? 'Skor Kepercayaan' : 'Trust Score'}
              </p>
              <p className="text-base font-bold text-teal-700 font-mono-num mt-0.5">100%</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onNavigate('ekyc')}
              className="flex-1 h-10 rounded-xl bg-[#EFF5FB] text-[#273469] text-xs font-semibold hover:bg-slate-200/70"
            >
              {lang === 'id' ? 'Buka Layar eKYC' : 'Open eKYC Screen'}
            </button>
            <button
              type="button"
              onClick={onToggleEkycStatus}
              className="px-3 h-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              {ekyc.verified
                ? lang === 'id'
                  ? 'Uji Belum eKYC'
                  : 'Test Unverified'
                : lang === 'id'
                ? 'Aktifkan eKYC'
                : 'Enable eKYC'}
            </button>
          </div>
        </div>

        {/* Owner / Partner Store Switcher CTA */}
        <button
          type="button"
          onClick={() => onSwitchRole('owner')}
          className="w-full text-left bg-[#273469] hover:bg-[#1e2854] text-white rounded-2xl p-4 flex items-center justify-between gap-3 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">{copy.switchToOwner}</p>
              <p className="text-[11px] text-teal-200 mt-0.5">
                {lang === 'id'
                  ? 'Pantau pesanan, dana bersih 88%, & kelola listing'
                  : 'Manage bookings, 88% net payouts & gear listings'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 shrink-0" />
        </button>

        {/* Settings & Legal Menu */}
        <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100">
          <button
            type="button"
            onClick={onToggleLang}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-[#273469]" />
              <span className="text-xs font-semibold text-slate-900">
                {lang === 'id' ? 'Bahasa Aplikasi' : 'App Language'}
              </span>
            </div>
            <span className="text-xs font-bold text-[#273469]">
              {lang === 'id' ? 'Indonesia (ID)' : 'English (EN)'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setInfoModal('pdp')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-[#273469]" />
              <span className="text-xs font-semibold text-slate-900">
                {lang === 'id' ? 'Pelindungan Data Pribadi (UU PDP)' : 'Personal Data Protection'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => setInfoModal('terms')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <FileCheck className="w-4 h-4 text-[#273469]" />
              <span className="text-xs font-semibold text-slate-900">
                {lang === 'id' ? 'Syarat, Ketentuan & Kebijakan Escrow' : 'Terms & Escrow Policy'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => setInfoModal('help')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#273469]" />
              <span className="text-xs font-semibold text-slate-900">
                {lang === 'id' ? 'Bantuan 24/7 DIY' : '24/7 Yogyakarta Support'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full h-11 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>{lang === 'id' ? 'Keluar Akun' : 'Sign Out'}</span>
        </button>

        <p className="text-center text-[11px] text-slate-400">
          Rentiva · Yogyakarta · from Aurevia
        </p>
      </div>

      {/* Info Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-[390px] bg-white rounded-3xl p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {infoModal === 'pdp'
                  ? 'UU No. 27 Tahun 2022 (PDP)'
                  : infoModal === 'terms'
                  ? 'Kebijakan Escrow Rentiva'
                  : 'Pusat Bantuan DIY'}
              </h3>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {infoModal === 'pdp'
                ? 'Seluruh dokumen KTP/Paspor disensor otomatis pada tampilan publik, dienkripsi AES-256, dan template biometrik dihapus setelah pencocokan identitas selesai.'
                : infoModal === 'terms'
                ? 'Penyewa dikenakan biaya layanan 8% & deposit refundable 100%. Pemilik/mitra menerima 88% dana sewa bersih (setelah komisi platform 12%) pasca inspeksi pengembalian.'
                : 'Tim operasional Yogyakarta siap membantu serah-terima di Kota Yogyakarta, Sleman, Bantul, maupun Bandara YIA setiap hari pukul 06.00–23.00 WIB.'}
            </p>
            <button
              type="button"
              onClick={() => setInfoModal(null)}
              className="w-full h-11 rounded-xl bg-[#273469] text-white text-xs font-semibold"
            >
              {lang === 'id' ? 'Tutup' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface OwnerDashboardProps {
  lang: Language;
  onToggleLang: () => void;
  items: RentalItem[];
  orders: OrderRecord[];
  onUpdateOrder: (orderId: string, updater: (prev: OrderRecord) => OrderRecord) => void;
  onToggleItemAvailability: (itemId: string) => void;
  onAddNewListing: (item: RentalItem) => void;
  onSwitchToRenter: () => void;
  onNavigateRenterScreen: (screen: ScreenId, orderId?: string) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  lang,
  onToggleLang,
  items,
  orders,
  onUpdateOrder,
  onToggleItemAvailability,
  onAddNewListing,
  onSwitchToRenter,
  onNavigateRenterScreen,
}) => {
  const copy = t(lang);
  const [tab, setTab] = useState<'overview' | 'orders' | 'listings'>('overview');
  const [withdrawn, setWithdrawn] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Listing Form
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Exclude<CategoryKey, 'all'>>('camera');
  const [newArea, setNewArea] = useState<Exclude<JogjaArea, 'all'>>('Kota Yogyakarta');
  const [newPrice, setNewPrice] = useState('120000');
  const [newDeposit, setNewDeposit] = useState('250000');

  const releasedTotal = orders
    .filter((o) => o.stage === 'completed_escrow_released')
    .reduce((acc, o) => acc + o.breakdown.ownerNet88, 0);
  const escrowPendingTotal = orders
    .filter((o) => o.stage !== 'completed_escrow_released' && o.stage !== 'awaiting_payment')
    .reduce((acc, o) => acc + o.breakdown.ownerNet88, 0);
  const historicalNet88 = 1848000 + releasedTotal;

  const ownerListings = items.slice(0, 6);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const imgMap: Record<Exclude<CategoryKey, 'all'>, string> = {
      baby: '/src/assets/images/stroller_babyzen_yoyo_1795278392175.jpg',
      camera: '/src/assets/images/camera_sony_kit_1795278392094.jpg',
      outdoor: '/src/assets/images/tent_outdoor_dome_1795278392729.jpg',
      bundle: '/src/assets/images/drone_dji_mini_1795278392541.jpg',
    };
    const created: RentalItem = {
      id: `item-custom-${Date.now()}`,
      name: newName.trim(),
      nameEn: newName.trim(),
      category: newCategory,
      pricePerDay: Number(newPrice) || 100000,
      deposit: Number(newDeposit) || 200000,
      area: newArea,
      district: newArea === 'Sleman' ? 'Depok / Babarsari' : newArea === 'Bantul' ? 'Sewon' : 'Kotabaru',
      distanceKm: 1.5,
      rating: 5.0,
      reviewCount: 1,
      conditionGrade: 'Grade A+ · Baru Ditambahkan',
      conditionNote: 'Unit siap sewa dan telah lolos checklist kebersihan Rentiva.',
      conditionNoteEn: 'Ready to rent and passed Rentiva hygiene checklist.',
      instantConfirm: true,
      deliveryAvailable: true,
      available: true,
      image: imgMap[newCategory],
      ownerId: 'owner-1',
      ownerName: 'Jogja Baby Gear & Studio',
      ownerBadge: 'Mitra Pro',
      ownerResponseRate: 99,
      hubAddress: 'Jl. Babarsari No. 12, Sleman',
      hubHours: '08:00 - 21:00 WIB',
      specs: [
        { labelId: 'Status Unit', labelEn: 'Unit Status', valueId: 'Siap Sewa & Terverifikasi', valueEn: 'Verified & Ready' },
      ],
      hygieneNoteId: 'Sudah disterilisasi & dicek fungsi sebelum listing.',
      hygieneNoteEn: 'Sterilized and function-checked before listing.',
      reviews: [],
    };
    onAddNewListing(created);
    setNewName('');
    setShowAddModal(false);
    setTab('listings');
  };

  return (
    <div className="min-h-full bg-[#F5F8FB] flex flex-col pb-6">
      <TopBar
        title={copy.ownerModeTitle}
        subtitle="Jogja Baby Gear Care · Mitra Pro"
        lang={lang}
        onToggleLang={onToggleLang}
        rightSlot={
          <button
            type="button"
            onClick={onSwitchToRenter}
            className="px-2.5 py-1.5 rounded-lg bg-[#EFF5FB] text-[#273469] text-[11px] font-semibold"
          >
            {lang === 'id' ? 'Mode Penyewa' : 'Renter Mode'}
          </button>
        }
      />

      {/* Sub-Tabs */}
      <div className="px-4 pt-3">
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/80 rounded-xl">
          {[
            { key: 'overview' as const, label: lang === 'id' ? 'Ringkasan' : 'Overview' },
            { key: 'orders' as const, label: `${lang === 'id' ? 'Pesanan' : 'Orders'} (${orders.length})` },
            { key: 'listings' as const, label: lang === 'id' ? 'Listing Saya' : 'Listings' },
          ].map((tb) => (
            <button
              key={tb.key}
              type="button"
              onClick={() => setTab(tb.key)}
              className={`min-h-[38px] rounded-lg text-xs font-semibold transition-colors ${
                tab === tb.key ? 'bg-[#273469] text-white' : 'text-slate-700'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Partner Status & Badge Banner */}
        <div className="bg-gradient-to-br from-[#162C5B] to-[#273469] text-white rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-300" />
              <span className="text-xs font-bold">
                Mitra Pro · Pemilik Tepercaya
              </span>
            </div>
            <span className="text-[11px] font-mono-num text-teal-200">Respon 99%</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <p className="text-[11px] text-slate-300">
                {lang === 'id' ? 'Pendapatan Bersih (88%)' : 'Net Earnings (88%)'}
              </p>
              <p className="text-xl font-bold font-mono-num mt-0.5">
                {withdrawn ? 'Rp0' : formatIDR(historicalNet88)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-300">
                {lang === 'id' ? 'Tertahan di Escrow' : 'Pending in Escrow'}
              </p>
              <p className="text-xl font-bold font-mono-num text-teal-300 mt-0.5">
                {formatIDR(escrowPendingTotal)}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-200">
              {lang === 'id'
                ? 'Komisi platform 12% transparan · Pencairan H+0'
                : '12% platform fee · Same-day payout'}
            </span>
            <button
              type="button"
              onClick={() => setWithdrawn(true)}
              className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{withdrawn ? (lang === 'id' ? 'Dicairkan' : 'Withdrawn') : (lang === 'id' ? 'Tarik Dana' : 'Withdraw')}</span>
            </button>
          </div>
        </div>

        {withdrawn && (
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 font-medium">
            {lang === 'id'
              ? 'Pencairan dana sewa bersih (88%) berhasil dikirim ke rekening BCA mitra.'
              : 'Net 88% rental payout transferred to partner bank account.'}
          </div>
        )}

        {tab === 'overview' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'id' ? 'Rincian Skema Bagi Hasil Mitra' : 'Partner Payout Breakdown'}
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'id' ? 'Pendapatan Sewa Kotor (100%)' : 'Gross Rental Revenue (100%)'}</span>
                  <span className="font-mono-num text-slate-900">{formatIDR(Math.round(historicalNet88 / 0.88))}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'id' ? 'Komisi Platform Rentiva (12%)' : 'Rentiva Platform Fee (12%)'}</span>
                  <span className="font-mono-num text-rose-600">
                    -{formatIDR(Math.round((historicalNet88 / 0.88) * 0.12))}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-teal-700 pt-1.5 border-t border-slate-100">
                  <span>{lang === 'id' ? 'Dana Bersih Diterima Mitra (88%)' : 'Net Partner Payout (88%)'}</span>
                  <span className="font-mono-num">{formatIDR(historicalNet88)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTab('orders')}
              className="w-full h-11 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#273469] flex items-center justify-center gap-2"
            >
              <span>{lang === 'id' ? 'Kelola Pesanan Masuk' : 'Manage Incoming Orders'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {tab === 'orders' && (
          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono-num font-bold text-slate-700">#{ord.id}</span>
                  <span className="font-semibold text-teal-700">{ord.stage}</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <ProductImage src={ord.itemImage} alt={ord.itemName} className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{ord.itemName}</p>
                    <p className="text-xs text-slate-500">
                      {ord.renterName} · {ord.startDate} – {ord.endDate}
                    </p>
                    <p className="text-xs font-semibold text-[#273469] font-mono-num mt-0.5">
                      {lang === 'id' ? 'Hak Mitra (88%):' : 'Net 88%:'}{' '}
                      {formatIDR(ord.breakdown.ownerNet88)}
                    </p>
                  </div>
                </div>

                {/* Contextual Owner Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  {ord.stage === 'awaiting_owner_confirmation' && (
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateOrder(ord.id, (o) => ({
                          ...o,
                          stage: 'pre_condition_docs',
                        }))
                      }
                      className="flex-1 h-10 rounded-xl bg-[#273469] text-white text-xs font-semibold"
                    >
                      {lang === 'id' ? 'Terima Pesanan' : 'Accept Order'}
                    </button>
                  )}

                  {ord.stage === 'owner_inspection' && (
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateOrder(ord.id, (o) => ({
                          ...o,
                          stage: 'completed_escrow_released',
                        }))
                      }
                      className="flex-1 h-10 rounded-xl bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {lang === 'id'
                          ? 'Loloskan Inspeksi & Cairkan 88%'
                          : 'Approve Return & Release 88%'}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onNavigateRenterScreen('order_waiting', ord.id)}
                    className="px-3 h-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    {lang === 'id' ? 'Buka di Sisi Penyewa' : 'View as Renter'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'listings' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="w-full h-11 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'id' ? 'Tambah Listing Alat Baru' : 'Add New Gear Listing'}</span>
            </button>

            <div className="space-y-2.5">
              {ownerListings.map((it) => (
                <div
                  key={it.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <ProductImage src={it.image} alt={it.name} className="w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{it.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono-num">
                        {formatIDR(it.pricePerDay)}/hari · {it.area}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleItemAvailability(it.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold shrink-0 ${
                      it.available
                        ? 'bg-teal-50 text-teal-800 border border-teal-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {it.available
                      ? lang === 'id'
                        ? 'Tersedia'
                        : 'Active'
                      : lang === 'id'
                      ? 'Nonaktif'
                      : 'Paused'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add New Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/55 p-4">
          <form
            onSubmit={handleCreateListing}
            className="w-full max-w-[390px] bg-white rounded-3xl p-5 space-y-3 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'id' ? 'Tambah Listing Alat' : 'Add Gear Listing'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'id' ? 'Nama Alat' : 'Item Name'}
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="cth. Fujifilm X-T5 + 18-55mm"
                className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'id' ? 'Kategori' : 'Category'}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Exclude<CategoryKey, 'all'>)}
                  className="w-full h-11 px-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="camera">{copy.catCamera}</option>
                  <option value="outdoor">{copy.catOutdoor}</option>
                  <option value="baby">{copy.catBaby}</option>
                  <option value="bundle">{copy.catBundle}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'id' ? 'Area DIY' : 'Area'}
                </label>
                <select
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value as Exclude<JogjaArea, 'all'>)}
                  className="w-full h-11 px-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="Kota Yogyakarta">Kota Yogyakarta</option>
                  <option value="Sleman">Sleman</option>
                  <option value="Bantul">Bantul</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'id' ? 'Harga/hari (Rp)' : 'Price/day (Rp)'}
                </label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-mono-num"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'id' ? 'Deposit (Rp)' : 'Deposit (Rp)'}
                </label>
                <input
                  type="number"
                  value={newDeposit}
                  onChange={(e) => setNewDeposit(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-mono-num"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#273469] text-white text-xs font-semibold"
            >
              {lang === 'id' ? 'Publikasikan ke Katalog' : 'Publish to Catalog'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

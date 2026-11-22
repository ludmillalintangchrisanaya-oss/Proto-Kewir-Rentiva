import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Lock,
  MapPin,
  MessageSquare,
  Phone,
  Plane,
  QrCode,
  ShieldCheck,
  Star,
  Store,
  Truck,
  X,
} from 'lucide-react';
import {
  Language,
  OrderRecord,
  OrderStage,
  ScreenId,
} from '../types/rentiva';
import { TopBar } from '../components/PhoneChrome';
import { ProductImage } from '../components/ProductImage';
import { formatIDR } from '../utils/pricing';
import { t } from '../data/i18n';

interface OrderLifecycleProps {
  screen:
    | 'orders'
    | 'order_waiting'
    | 'pre_condition'
    | 'handover'
    | 'active_rental'
    | 'return_condition'
    | 'inspection_escrow'
    | 'review';
  lang: Language;
  onToggleLang: () => void;
  orders: OrderRecord[];
  activeOrder: OrderRecord;
  onSelectOrder: (orderId: string) => void;
  onUpdateOrder: (orderId: string, updater: (prev: OrderRecord) => OrderRecord) => void;
  onNavigate: (screen: ScreenId) => void;
  onOpenChat: (ownerName: string) => void;
}

export const OrderLifecycleScreens: React.FC<OrderLifecycleProps> = ({
  screen,
  lang,
  onToggleLang,
  orders,
  activeOrder,
  onSelectOrder,
  onUpdateOrder,
  onNavigate,
  onOpenChat,
}) => {
  const copy = t(lang);
  const [ordersTab, setOrdersTab] = useState<'active' | 'history'>('active');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('Aksesoris tidak lengkap / lecet minor');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [extendSuccess, setExtendSuccess] = useState(false);

  // Review state
  const [rClean, setRClean] = useState(5);
  const [rAcc, setRAcc] = useState(5);
  const [rCour, setRCour] = useState(5);
  const [rTags, setRTags] = useState<string[]>([
    'Barang Wangi & Bersih',
    'Pengantaran Tepat Waktu',
  ]);
  const [rComment, setRComment] = useState('');

  const stageToScreen = (stage: OrderStage): ScreenId => {
    switch (stage) {
      case 'awaiting_payment':
        return 'payment';
      case 'awaiting_owner_confirmation':
        return 'order_waiting';
      case 'pre_condition_docs':
        return 'pre_condition';
      case 'in_delivery_or_pickup':
        return 'handover';
      case 'active_usage':
        return 'active_rental';
      case 'return_submitted':
        return 'return_condition';
      case 'owner_inspection':
      case 'dispute_open':
      case 'completed_escrow_released':
        return 'inspection_escrow';
    }
  };

  const stageLabel = (stage: OrderStage) => {
    const map: Record<OrderStage, { id: string; en: string }> = {
      awaiting_payment: { id: 'Menunggu Pembayaran', en: 'Awaiting Payment' },
      awaiting_owner_confirmation: { id: 'Menunggu Konfirmasi Pemilik', en: 'Awaiting Owner Confirm' },
      pre_condition_docs: { id: 'Foto Kondisi Sebelum Sewa', en: 'Pre-Rental Condition Photos' },
      in_delivery_or_pickup: { id: 'Serah-Terima (Kurir / Hub)', en: 'Handover (Courier / Hub)' },
      active_usage: { id: 'Sedang Disewa (Aktif)', en: 'Active Rental' },
      return_submitted: { id: 'Pengembalian & Foto Akhir', en: 'Return & Final Photos' },
      owner_inspection: { id: 'Inspeksi Kondisi Pemilik', en: 'Owner Inspection' },
      completed_escrow_released: { id: 'Selesai · Deposit 100% Dilepas', en: 'Completed · 100% Deposit Released' },
      dispute_open: { id: 'Mediasi Sengketa Escrow', en: 'Escrow Dispute Mediation' },
    };
    return map[stage][lang];
  };

  // 1. ORDERS LIST SCREEN
  if (screen === 'orders') {
    const activeOrders = orders.filter((o) => o.stage !== 'completed_escrow_released' || !o.review);
    const historyOrders = orders.filter((o) => o.stage === 'completed_escrow_released' && o.review);
    const shown = ordersTab === 'active' ? activeOrders : historyOrders;

    return (
      <div className="min-h-full bg-[#F5F8FB] pb-8">
        <TopBar
          title={copy.myOrders}
          subtitle={lang === 'id' ? 'Pantau progres & dana escrow Anda' : 'Track rental progress & escrow'}
          onBack={() => onNavigate('explore')}
          lang={lang}
          onToggleLang={onToggleLang}
        />

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/80 rounded-xl">
            <button
              type="button"
              onClick={() => setOrdersTab('active')}
              className={`min-h-[40px] rounded-lg text-xs font-semibold transition-colors ${
                ordersTab === 'active' ? 'bg-[#273469] text-white' : 'text-slate-700'
              }`}
            >
              {copy.activeTab} ({activeOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setOrdersTab('history')}
              className={`min-h-[40px] rounded-lg text-xs font-semibold transition-colors ${
                ordersTab === 'history' ? 'bg-[#273469] text-white' : 'text-slate-700'
              }`}
            >
              {copy.historyTab} ({historyOrders.length})
            </button>
          </div>

          {shown.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-900">
                {lang === 'id' ? 'Belum ada pesanan di tab ini' : 'No orders in this tab yet'}
              </p>
              <button
                type="button"
                onClick={() => onNavigate('explore')}
                className="px-4 py-2.5 rounded-xl bg-[#273469] text-white text-xs font-semibold"
              >
                {lang === 'id' ? 'Jelajah Perlengkapan' : 'Explore Gear'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {shown.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono-num font-semibold text-slate-600">#{ord.id}</span>
                    <span className="font-semibold text-teal-700">{stageLabel(ord.stage)}</span>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <ProductImage
                        src={ord.itemImage}
                        alt={lang === 'id' ? ord.itemName : ord.itemNameEn}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {lang === 'id' ? ord.itemName : ord.itemNameEn}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {ord.startDate} – {ord.endDate} · {ord.durationDays}{' '}
                        {lang === 'id' ? 'hari' : 'days'}
                      </p>
                      <p className="text-xs text-slate-600 truncate mt-0.5">
                        {ord.deliveryLocationName}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'id' ? 'Total Masuk Escrow' : 'Held in Escrow'}
                      </p>
                      <p className="text-sm font-bold text-[#273469] font-mono-num">
                        {formatIDR(ord.breakdown.totalEscrow)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectOrder(ord.id);
                        onNavigate(stageToScreen(ord.stage));
                      }}
                      className="min-h-[40px] px-4 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>{lang === 'id' ? 'Rincian & Lanjut' : 'Details & Next'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Escrow Protection Card */}
          <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-teal-900">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {lang === 'id' ? 'Dana Aman di Escrow Rentiva' : 'Funds Safe in Rentiva Escrow'}
              </p>
              <p className="mt-0.5 leading-relaxed">
                {lang === 'id'
                  ? 'Jika pemilik tidak merespons dalam 2 jam, dana sewa & deposit kembali otomatis 100%.'
                  : 'If the owner does not confirm within 2 hours, 100% of funds auto-refund instantly.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. STEP 4: WAITING OWNER CONFIRMATION
  if (screen === 'order_waiting') {
    return (
      <div className="min-h-full bg-[#F5F8FB] flex flex-col pb-24">
        <TopBar
          title={`${lang === 'id' ? 'Pesanan' : 'Order'} #${activeOrder.id}`}
          onBack={() => onNavigate('orders')}
          lang={lang}
          onToggleLang={onToggleLang}
        />

        <div className="p-4 space-y-4">
          {/* 4-Step Progress Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
              {[
                { label: lang === 'id' ? 'Dibayar' : 'Paid', done: true },
                { label: lang === 'id' ? 'Konfirmasi' : 'Confirm', active: true },
                { label: lang === 'id' ? 'Serah Terima' : 'Handover', done: false },
                { label: lang === 'id' ? 'Selesai' : 'Done', done: false },
              ].map((s, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div
                    className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                      s.done
                        ? 'bg-[#273469] text-white'
                        : s.active
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {s.done ? '✓' : idx + 1}
                  </div>
                  <p className={`font-medium ${s.active || s.done ? 'text-slate-900' : 'text-slate-400'}`}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-refund Countdown */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {lang === 'id' ? 'Menunggu Konfirmasi Pemilik' : 'Awaiting Owner Confirmation'}
              </span>
              <span className="text-teal-800">{lang === 'id' ? 'Aman 100%' : '100% Protected'}</span>
            </div>
            <p className="text-2xl font-bold font-mono-num text-slate-900">01:42:17</p>
            <p className="text-xs text-slate-700 leading-relaxed">
              {lang === 'id'
                ? 'Jika pemilik tidak merespons dalam batas waktu 2 jam, seluruh dana escrow akan dikembalikan otomatis 100%.'
                : 'If the owner does not confirm within 2 hours, all escrow funds auto-refund 100%.'}
            </p>
          </div>

          {/* Order Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <div className="flex gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <ProductImage src={activeOrder.itemImage} alt={activeOrder.itemName} className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-teal-700 font-semibold">{activeOrder.ownerName}</p>
                <p className="text-sm font-bold text-slate-900 truncate">
                  {lang === 'id' ? activeOrder.itemName : activeOrder.itemNameEn}
                </p>
                <p className="text-xs text-slate-500">
                  {activeOrder.startDate} – {activeOrder.endDate}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">{activeOrder.deliveryLocationName}</span>
              <span className="font-bold font-mono-num text-[#273469]">
                {formatIDR(activeOrder.breakdown.totalEscrow)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <button
            type="button"
            onClick={() => onOpenChat(activeOrder.ownerName)}
            className="w-full h-11 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#273469] flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{lang === 'id' ? 'Hubungi Pemilik via Chat' : 'Message Owner via Chat'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onUpdateOrder(activeOrder.id, (o) => ({
                ...o,
                stage: 'pre_condition_docs',
              }));
              onNavigate('pre_condition');
            }}
            className="w-full h-12 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white text-sm font-semibold flex items-center justify-center gap-2"
          >
            <span>
              {lang === 'id'
                ? 'Konfirmasi Pemilik (Lanjut Foto Kondisi Awal)'
                : 'Simulate Owner Confirm (Next: Pre-Condition)'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 3. STEP 5: PRE-RENTAL CONDITION PHOTOS & HYGIENE CHECKLIST
  if (screen === 'pre_condition') {
    const capturedCount = activeOrder.prePhotos.filter((p) => p.captured).length;
    const allChecked =
      activeOrder.preChecklist.uvcSealed &&
      activeOrder.preChecklist.physicalIntact &&
      activeOrder.preChecklist.accessoriesComplete;
    const readyForHandover = capturedCount === 4 && allChecked;

    const handleCaptureSlot = (slotId: string) => {
      onUpdateOrder(activeOrder.id, (o) => ({
        ...o,
        prePhotos: o.prePhotos.map((p, idx) =>
          p.id === slotId
            ? {
                ...p,
                captured: true,
                timestamp: `22-12-2026 14:0${idx + 2} WIB`,
                locationTag: 'Kel. Caturtunggal · Sleman',
                evidenceCode: `BKT-8812-0${idx + 1}`,
                previewImage: o.itemImage,
              }
            : p
        ),
      }));
    };

    return (
      <div className="min-h-full bg-[#F5F8FB] flex flex-col pb-24">
        <TopBar
          title={lang === 'id' ? 'Dokumentasi Sebelum Sewa' : 'Pre-Rental Documentation'}
          subtitle={`#${activeOrder.id} · ${capturedCount}/4 Foto`}
          onBack={() => onNavigate('orders')}
          lang={lang}
          onToggleLang={onToggleLang}
        />

        <div className="p-4 space-y-4">
          <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-teal-900">
            <Lock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {lang === 'id' ? 'Validasi Fisik Terenkripsi' : 'Encrypted Physical Validation'}
              </p>
              <p className="mt-0.5 leading-relaxed">
                {lang === 'id'
                  ? 'Foto kamera dalam aplikasi dilengkapi geotagging & stempel waktu otomatis ke escrow.'
                  : 'In-app camera captures include automatic geotagging and timestamping saved to escrow.'}
              </p>
            </div>
          </div>

          {/* 4 Photo Slots */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'id' ? 'Foto Kondisi Awal (4 Sisi)' : 'Initial Condition Photos (4 Angles)'}
              </h3>
              <button
                type="button"
                onClick={() =>
                  onUpdateOrder(activeOrder.id, (o) => ({
                    ...o,
                    prePhotos: o.prePhotos.map((p, idx) => ({
                      ...p,
                      captured: true,
                      timestamp: `22-12-2026 14:0${idx + 2} WIB`,
                      locationTag: 'Kel. Caturtunggal · Sleman',
                      evidenceCode: `BKT-8812-0${idx + 1}`,
                      previewImage: o.itemImage,
                    })),
                    preChecklist: {
                      uvcSealed: true,
                      physicalIntact: true,
                      accessoriesComplete: true,
                    },
                  }))
                }
                className="text-xs font-semibold text-[#273469] hover:underline"
              >
                {lang === 'id' ? 'Lengkapi Semua (Demo)' : 'Complete All (Demo)'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {activeOrder.prePhotos.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleCaptureSlot(slot.id)}
                  className={`rounded-xl border overflow-hidden text-left transition-all ${
                    slot.captured
                      ? 'border-teal-400 bg-teal-50/30'
                      : 'border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 p-3 min-h-[128px] flex flex-col items-center justify-center text-center'
                  }`}
                >
                  {slot.captured ? (
                    <div className="w-full">
                      <div className="relative h-24 w-full bg-slate-200">
                        <ProductImage
                          src={slot.previewImage || activeOrder.itemImage}
                          alt={slot.labelId}
                          className="w-full h-full"
                        />
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-teal-700 text-white text-[10px] font-semibold">
                          ✓ Verified
                        </span>
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-bold text-slate-900">
                          {lang === 'id' ? slot.labelId : slot.labelEn}
                        </p>
                        <p className="text-[10px] font-mono-num text-slate-500 mt-0.5">
                          {slot.timestamp}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 text-[#273469] mb-1.5" />
                      <p className="text-xs font-semibold text-slate-900">
                        {lang === 'id' ? slot.labelId : slot.labelEn}
                      </p>
                      <p className="text-[11px] text-[#273469] font-medium mt-1">
                        {lang === 'id' ? '+ Ambil Foto' : '+ Take Photo'}
                      </p>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Hygiene & Completeness Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'id' ? 'Checklist Kebersihan & Kelengkapan' : 'Hygiene & Completeness Checklist'}
            </h3>
            {[
              {
                key: 'uvcSealed' as const,
                labelId: 'Unit sudah disterilisasi UV-C & tersegel higienis',
                labelEn: 'Unit UV-C sanitized and hygienically sealed',
              },
              {
                key: 'physicalIntact' as const,
                labelId: 'Fungsi utama, engsel, lensa/roda normal tanpa cacat',
                labelEn: 'Primary functions, hinges, optics/wheels working cleanly',
              },
              {
                key: 'accessoriesComplete' as const,
                labelId: 'Seluruh aksesoris, baterai, dan tas pelindung lengkap',
                labelEn: 'All accessories, batteries, and carry bag complete',
              },
            ].map((chk) => (
              <label
                key={chk.key}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={activeOrder.preChecklist[chk.key]}
                  onChange={(e) =>
                    onUpdateOrder(activeOrder.id, (o) => ({
                      ...o,
                      preChecklist: { ...o.preChecklist, [chk.key]: e.target.checked },
                    }))
                  }
                  className="mt-0.5 w-4 h-4 rounded accent-[#273469]"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  {lang === 'id' ? chk.labelId : chk.labelEn}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3">
          <button
            type="button"
            disabled={!readyForHandover}
            onClick={() => {
              onUpdateOrder(activeOrder.id, (o) => ({
                ...o,
                stage: 'in_delivery_or_pickup',
              }));
              onNavigate('handover');
            }}
            className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
              readyForHandover
                ? 'bg-[#273469] hover:bg-[#1e2854] text-white'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>{lang === 'id' ? 'Lanjut ke Serah-Terima' : 'Proceed to Handover'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 4. STEP 6: HANDOVER (COURIER TO HOTEL/YIA OR PICKUP AT PARTNER STORE)
  if (screen === 'handover') {
    const isPickup = activeOrder.deliveryMethod === 'pickup_hub';
    const isYia = activeOrder.deliveryMethod === 'yia_courier';

    return (
      <div className="min-h-full bg-[#F5F8FB] flex flex-col pb-24">
        <TopBar
          title={lang === 'id' ? 'Serah-Terima Unit' : 'Gear Handover'}
          subtitle={`#${activeOrder.id} · ${isPickup ? 'Pickup Hub' : 'Live Courier'}`}
          onBack={() => onNavigate('pre_condition')}
          lang={lang}
          onToggleLang={onToggleLang}
        />

        <div className="p-4 space-y-4">
          {/* Stylized Vector Map */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
            <div className="relative h-40 bg-[#EAF2F8] p-4 flex flex-col justify-between">
              <svg viewBox="0 0 360 140" className="absolute inset-0 w-full h-full opacity-75">
                <path d="M0 40 H360 M0 95 H360 M80 0 V140 M220 0 V140" stroke="#CBD5E1" strokeWidth="2" />
                <path
                  d="M55 110 Q 150 95, 210 60 T 305 32"
                  fill="none"
                  stroke="#273469"
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                />
                <circle cx="55" cy="110" r="7" fill="#0D9488" />
                <circle cx="305" cy="32" r="8" fill="#273469" />
              </svg>
              <div className="relative z-10 flex justify-between items-start">
                <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[11px] font-bold text-[#273469] shadow-sm flex items-center gap-1">
                  {isYia ? <Plane className="w-3.5 h-3.5" /> : isPickup ? <Store className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                  {activeOrder.deliveryLocationName}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-teal-700 text-white text-[11px] font-semibold">
                  {isPickup ? (lang === 'id' ? 'Buka 08–21 WIB' : 'Open 08–21 WIB') : 'ETA ~18 mnt'}
                </span>
              </div>
              <p className="relative z-10 text-[11px] font-medium text-slate-700 bg-white/90 px-2.5 py-1 rounded-lg self-start">
                {activeOrder.deliveryAddress}
              </p>
            </div>

            {!isPickup ? (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{activeOrder.courierName}</p>
                    <p className="text-[11px] text-slate-500">{activeOrder.courierVehicle} · Kurir Resmi Rentiva</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenChat(activeOrder.ownerName)}
                      aria-label="Chat"
                      className="w-10 h-10 rounded-xl bg-slate-100 text-[#273469] flex items-center justify-center"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenChat('Dukungan Rentiva')}
                      aria-label="Call"
                      className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
                  <p className="font-semibold text-teal-700 flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    {lang === 'id'
                      ? 'Kurir dalam perjalanan ke titik serah-terima'
                      : 'Courier is en route to handover point'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                <p className="text-xs font-bold text-slate-900">{activeOrder.ownerName}</p>
                <p className="text-xs text-slate-600">{activeOrder.deliveryAddress}</p>
              </div>
            )}
          </div>

          {/* Handover QR & 4-Digit OTP */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 text-center space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'id' ? 'QR & OTP Serah-Terima' : 'Handover QR & OTP'}
            </h3>
            <div className="w-36 h-36 mx-auto rounded-2xl border border-slate-200 bg-[#F8FBFF] p-3 flex items-center justify-center">
              <QrCode className="w-full h-full text-[#273469]" strokeWidth={1.5} />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-sm font-mono-num font-bold text-[#273469]">
              <span>OTP:</span>
              <span className="tracking-widest">{activeOrder.handoverOtp}</span>
            </div>
            <p className="text-xs text-slate-500">
              {lang === 'id'
                ? 'Tunjukkan QR atau OTP ini kepada kurir / staf hub mitra saat menerima barang.'
                : 'Show this QR or OTP to the courier / partner hub staff upon receipt.'}
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3">
          <button
            type="button"
            onClick={() => {
              onUpdateOrder(activeOrder.id, (o) => ({
                ...o,
                stage: 'active_usage',
              }));
              onNavigate('active_rental');
            }}
            className="w-full h-12 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white font-semibold text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{lang === 'id' ? 'Konfirmasi Terima Barang' : 'Confirm Item Received'}</span>
          </button>
        </div>
      </div>
    );
  }

  // 5. STEP 7: ACTIVE USAGE
  if (screen === 'active_rental') {
    return (
      <div className="min-h-full bg-[#F5F8FB] flex flex-col pb-24">
        <TopBar
          title={lang === 'id' ? 'Masa Pemakaian Aktif' : 'Active Rental'}
          subtitle={`#${activeOrder.id}`}
          onBack={() => onNavigate('orders')}
          lang={lang}
          onToggleLang={onToggleLang}
        />

        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {lang === 'id' ? 'Serah-Terima Terkonfirmasi!' : 'Handover Confirmed!'}
            </h2>
            <p className="text-xs text-slate-600">
              {lang === 'id'
                ? 'Masa sewa Anda aktif. Gunakan peralatan dengan nyaman di Yogyakarta.'
                : 'Your rental is now active. Enjoy your trip in Yogyakarta.'}
            </p>
          </div>

          {/* Item & Timer Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <div className="flex gap-3 items-center">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <ProductImage src={activeOrder.itemImage} alt={activeOrder.itemName} className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-teal-700">
                  {lang === 'id' ? 'SEWA AKTIF' : 'ACTIVE RENTAL'}
                </span>
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {lang === 'id' ? activeOrder.itemName : activeOrder.itemNameEn}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeOrder.ownerName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50">
                <p className="text-[11px] text-slate-500">{lang === 'id' ? 'Mulai Sewa' : 'Start'}</p>
                <p className="font-bold text-slate-900 mt-0.5">{activeOrder.startDate}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50">
                <p className="text-[11px] text-slate-500">{lang === 'id' ? 'Batas Kembali' : 'Return Due'}</p>
                <p className="font-bold text-slate-900 mt-0.5">{activeOrder.endDate}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#EFF5FB] flex items-center justify-between text-xs">
              <span className="text-slate-700 font-medium">
                {lang === 'id' ? 'Deposit Terkunci Aman' : 'Deposit Safely Held'}
              </span>
              <span className="font-bold font-mono-num text-[#273469]">
                {formatIDR(activeOrder.breakdown.depositAmount)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setExtendSuccess(true)}
              className="h-11 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#273469] hover:bg-slate-50"
            >
              {lang === 'id' ? 'Perpanjang +1 Hari' : 'Extend +1 Day'}
            </button>
            <button
              type="button"
              onClick={() => onOpenChat(activeOrder.ownerName)}
              className="h-11 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {lang === 'id' ? 'Chat Pemilik' : 'Chat Owner'}
            </button>
          </div>

          {extendSuccess && (
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 font-medium">
              {lang === 'id'
                ? 'Permintaan perpanjangan sewa dikirim ke mitra untuk konfirmasi.'
                : 'Rental extension request sent to partner for confirmation.'}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3">
          <button
            type="button"
            onClick={() => {
              onUpdateOrder(activeOrder.id, (o) => ({
                ...o,
                stage: 'return_submitted',
              }));
              onNavigate('return_condition');
            }}
            className="w-full h-12 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white font-semibold text-sm flex items-center justify-center gap-2"
          >
            <span>
              {lang === 'id'
                ? 'Ajukan Pengembalian & Foto Kondisi Akhir'
                : 'Return Gear & Take Final Photos'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 6. STEP 8: RETURN & FINAL CONDITION PHOTOS
  if (screen === 'return_condition') {
    const postCount = activeOrder.postPhotos.filter((p) => p.captured).length;
    const postChecks =
      activeOrder.postChecklist.allPartsReturned && activeOrder.postChecklist.lightCleaned;
    const readyReturn = postCount === 4 && postChecks;

    return (
      <div className="min-h-full bg-[#F5F8FB] flex flex-col pb-24">
        <TopBar
          title={lang === 'id' ? 'Pengembalian & Foto Akhir' : 'Return & Final Condition'}
          subtitle={`#${activeOrder.id} · ${postCount}/4 Foto`}
          onBack={() => onNavigate('active_rental')}
          lang={lang}
          onToggleLang={onToggleLang}
        />

        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'id' ? 'Foto Kondisi Akhir (4 Sisi)' : 'Final Return Photos (4 Angles)'}
              </h3>
              <button
                type="button"
                onClick={() =>
                  onUpdateOrder(activeOrder.id, (o) => ({
                    ...o,
                    postPhotos: o.postPhotos.map((p, idx) => ({
                      ...p,
                      captured: true,
                      timestamp: `25-12-2026 11:3${idx} WIB`,
                      locationTag: o.deliveryLocationName,
                      evidenceCode: `BKT-8812-END-0${idx + 1}`,
                      previewImage: o.itemImage,
                    })),
                    postChecklist: { allPartsReturned: true, lightCleaned: true },
                  }))
                }
                className="text-xs font-semibold text-[#273469] hover:underline"
              >
                {lang === 'id' ? 'Lengkapi Semua (Demo)' : 'Complete All (Demo)'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {activeOrder.postPhotos.map((slot, idx) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() =>
                    onUpdateOrder(activeOrder.id, (o) => ({
                      ...o,
                      postPhotos: o.postPhotos.map((p) =>
                        p.id === slot.id
                          ? {
                              ...p,
                              captured: true,
                              timestamp: `25-12-2026 11:3${idx} WIB`,
                              locationTag: o.deliveryLocationName,
                              evidenceCode: `BKT-8812-END-0${idx + 1}`,
                              previewImage: o.itemImage,
                            }
                          : p
                      ),
                    }))
                  }
                  className={`rounded-xl border overflow-hidden text-left ${
                    slot.captured
                      ? 'border-teal-400 bg-teal-50/30'
                      : 'border-dashed border-slate-300 bg-slate-50 p-3 min-h-[120px] flex flex-col items-center justify-center text-center'
                  }`}
                >
                  {slot.captured ? (
                    <div className="w-full">
                      <div className="relative h-24 w-full bg-slate-200">
                        <ProductImage
                          src={slot.previewImage || activeOrder.itemImage}
                          alt={slot.labelId}
                          className="w-full h-full"
                        />
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-teal-700 text-white text-[10px] font-semibold">
                          ✓ End Photo
                        </span>
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-bold text-slate-900">
                          {lang === 'id' ? slot.labelId : slot.labelEn}
                        </p>
                        <p className="text-[10px] font-mono-num text-slate-500">{slot.timestamp}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 text-[#273469] mb-1" />
                      <p className="text-xs font-semibold text-slate-900">
                        {lang === 'id' ? slot.labelId : slot.labelEn}
                      </p>
                      <p className="text-[11px] text-[#273469] mt-0.5">
                        {lang === 'id' ? '+ Ambil Foto' : '+ Take Photo'}
                      </p>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'id' ? 'Konfirmasi Pengembalian' : 'Return Checklist'}
            </h3>
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={activeOrder.postChecklist.allPartsReturned}
                onChange={(e) =>
                  onUpdateOrder(activeOrder.id, (o) => ({
                    ...o,
                    postChecklist: { ...o.postChecklist, allPartsReturned: e.target.checked },
                  }))
                }
                className="mt-0.5 w-4 h-4 rounded accent-[#273469]"
              />
              <span className="text-xs text-slate-700">
                {lang === 'id'
                  ? 'Semua aksesoris, baterai, dan tas pelindung dikembalikan utuh.'
                  : 'All accessories, batteries, and bags returned complete.'}
              </span>
            </label>
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={activeOrder.postChecklist.lightCleaned}
                onChange={(e) =>
                  onUpdateOrder(activeOrder.id, (o) => ({
                    ...o,
                    postChecklist: { ...o.postChecklist, lightCleaned: e.target.checked },
                  }))
                }
                className="mt-0.5 w-4 h-4 rounded accent-[#273469]"
              />
              <span className="text-xs text-slate-700">
                {lang === 'id'
                  ? 'Unit bersih wajar (bebas sampah/sisa makanan/lumpur berat).'
                  : 'Unit reasonably clean (no trash, food residue, or heavy mud).'}
              </span>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3">
          <button
            type="button"
            disabled={!readyReturn}
            onClick={() => {
              onUpdateOrder(activeOrder.id, (o) => ({
                ...o,
                stage: 'owner_inspection',
              }));
              onNavigate('inspection_escrow');
            }}
            className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${
              readyReturn
                ? 'bg-[#273469] hover:bg-[#1e2854] text-white'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>
              {lang === 'id'
                ? 'Serahkan Barang & Kirim ke Inspeksi Pemilik'
                : 'Submit Return for Owner Inspection'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 7. STEPS 9 & 10: OWNER INSPECTION, 100% DEPOSIT RELEASE, 88% OWNER PAYOUT, DISPUTE MODAL
  if (screen === 'inspection_escrow') {
    const isCompleted = activeOrder.stage === 'completed_escrow_released';
    const isDispute = activeOrder.stage === 'dispute_open';

    return (
      <div className="relative min-h-full bg-[#F5F8FB] flex flex-col pb-24">
        <TopBar
          title={lang === 'id' ? 'Inspeksi & Pelepasan Escrow' : 'Inspection & Escrow Release'}
          subtitle={`#${activeOrder.id}`}
          onBack={() => onNavigate('orders')}
          lang={lang}
          onToggleLang={onToggleLang}
        />

        <div className="p-4 space-y-4">
          {/* Item Header */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
              <ProductImage src={activeOrder.itemImage} alt={activeOrder.itemName} className="w-full h-full" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-teal-700">
                {isCompleted
                  ? lang === 'id'
                    ? 'Inspeksi Lolos · Deposit 100% Dilepas'
                    : 'Inspection Passed · 100% Deposit Released'
                  : isDispute
                  ? lang === 'id'
                    ? 'Dalam Mediasi Sengketa'
                    : 'In Dispute Mediation'
                  : lang === 'id'
                  ? 'Menunggu Pemeriksaan Pemilik'
                  : 'Awaiting Owner Inspection'}
              </p>
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {lang === 'id' ? activeOrder.itemName : activeOrder.itemNameEn}
              </h2>
              <p className="text-xs text-slate-500">
                {activeOrder.renterName} · {activeOrder.durationDays} {lang === 'id' ? 'hari' : 'days'}
              </p>
            </div>
          </div>

          {/* 4-Stage Completion & Escrow Settlement */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'id' ? 'Progres Penyelesaian & Escrow' : 'Settlement & Escrow Progress'}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div>
                  <p className="font-bold text-slate-900">
                    1. {lang === 'id' ? 'Barang diterima pemilik' : 'Item received by owner'}
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    {activeOrder.ownerName} · Foto kondisi akhir terlampir
                  </p>
                </div>
                <span className="font-semibold text-teal-700 shrink-0">
                  {lang === 'id' ? 'Selesai' : 'Done'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div>
                  <p className="font-bold text-slate-900">
                    2. {lang === 'id' ? 'Pemeriksaan kondisi (maks. 12 jam)' : 'Condition inspection (max 12h)'}
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    {isCompleted
                      ? lang === 'id'
                        ? 'Unit dinyatakan sesuai & lengkap'
                        : 'Unit confirmed matching & complete'
                      : isDispute
                      ? lang === 'id'
                        ? `Laporan sengketa: ${activeOrder.dispute?.reason}`
                        : `Dispute filed: ${activeOrder.dispute?.reason}`
                      : lang === 'id'
                      ? 'Pemilik sedang mengecek fisik unit & foto'
                      : 'Owner verifying physical unit & photos'}
                  </p>
                </div>
                <span
                  className={`font-semibold shrink-0 ${
                    isCompleted ? 'text-teal-700' : isDispute ? 'text-amber-700' : 'text-[#273469]'
                  }`}
                >
                  {isCompleted
                    ? lang === 'id'
                      ? 'Sesuai'
                      : 'Approved'
                    : isDispute
                    ? lang === 'id'
                      ? 'Mediasi'
                      : 'Mediation'
                    : lang === 'id'
                    ? 'Berlangsung'
                    : 'In Progress'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div>
                  <p className="font-bold text-slate-900">
                    3. {lang === 'id' ? 'Sewa bersih mitra (88%)' : 'Net partner payout (88%)'}
                  </p>
                  <p className="text-slate-500 mt-0.5 font-mono-num">
                    {formatIDR(activeOrder.breakdown.ownerNet88)} (setelah komisi 12%:{' '}
                    {formatIDR(activeOrder.breakdown.platformCommission12)})
                  </p>
                </div>
                <span className={`font-semibold shrink-0 ${isCompleted ? 'text-teal-700' : 'text-slate-400'}`}>
                  {isCompleted
                    ? lang === 'id'
                      ? 'Dicairkan'
                      : 'Released'
                    : lang === 'id'
                    ? 'Menunggu'
                    : 'Pending'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900">
                    4. {lang === 'id' ? 'Deposit jaminan kembali 100%' : '100% security deposit release'}
                  </p>
                  <p className="text-slate-500 mt-0.5 font-mono-num">
                    {formatIDR(activeOrder.breakdown.depositAmount)} → {lang === 'id' ? 'Rekening/QRIS asal' : 'Original payment method'}
                  </p>
                </div>
                <span className={`font-semibold shrink-0 ${isCompleted ? 'text-teal-700' : 'text-slate-400'}`}>
                  {isCompleted
                    ? lang === 'id'
                      ? '100% Kembali'
                      : '100% Refunded'
                    : lang === 'id'
                    ? 'Terkunci'
                    : 'Held'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Actions for Inspection / Dispute */}
          {!isCompleted && (
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() =>
                  onUpdateOrder(activeOrder.id, (o) => ({
                    ...o,
                    stage: 'completed_escrow_released',
                  }))
                }
                className="w-full h-12 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {lang === 'id'
                    ? 'Loloskan Inspeksi & Lepas Deposit 100%'
                    : 'Approve Inspection & Release 100% Deposit'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowDisputeModal(true)}
                className="w-full h-11 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-rose-50"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>
                  {lang === 'id'
                    ? 'Ada Kendala Fisik? Ajukan Klaim / Sengketa'
                    : 'Physical Issue? File Claim / Dispute'}
                </span>
              </button>
            </div>
          )}

          {isCompleted && (
            <button
              type="button"
              onClick={() => onNavigate('review')}
              className="w-full h-12 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>
                {lang === 'id'
                  ? 'Lanjut ke Ulasan Dua Arah'
                  : 'Proceed to Two-Way Review'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dispute / Claim Modal */}
        {showDisputeModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/55 p-4">
            <div className="w-full max-w-[390px] bg-white rounded-3xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  {lang === 'id' ? 'Ajukan Klaim / Sengketa Escrow' : 'File Escrow Claim / Dispute'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'id'
                  ? 'Tim Mediasi Rentiva membandingkan foto kondisi awal & akhir sebelum memutuskan pemotongan atau pelepasan deposit.'
                  : 'Rentiva Mediation compares pre- and post-rental photos before deciding deposit deduction or release.'}
              </p>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  {lang === 'id' ? 'Jenis Kendala' : 'Issue Type'}
                </label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option>Aksesoris tidak lengkap / lecet minor</option>
                  <option>Kerusakan fungsi atau noda berat</option>
                  <option>Keterlambatan pengembalian unit</option>
                </select>
                <textarea
                  rows={3}
                  value={disputeDesc}
                  onChange={(e) => setDisputeDesc(e.target.value)}
                  placeholder={
                    lang === 'id'
                      ? 'Jelaskan kronologi & bagian yang bermasalah...'
                      : 'Describe the issue...'
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="h-11 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  {lang === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateOrder(activeOrder.id, (o) => ({
                      ...o,
                      stage: 'dispute_open',
                      dispute: {
                        reason: disputeReason,
                        description: disputeDesc || 'Dilaporkan untuk peninjauan foto awal vs akhir.',
                        status: 'mediation',
                        createdAt: '25 Des 2026, 12:10 WIB',
                      },
                    }));
                    setShowDisputeModal(false);
                  }}
                  className="h-11 rounded-xl bg-rose-600 text-white text-xs font-semibold"
                >
                  {lang === 'id' ? 'Kirim Sengketa' : 'Submit Dispute'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 8. STEP 11: TWO-WAY REVIEW
  const availableTags =
    lang === 'id'
      ? [
          'Barang Wangi & Bersih',
          'Pengantaran Tepat Waktu',
          'Komunikasi Ramah',
          'Kondisi Mulus 100%',
        ]
      : ['Fresh & Clean Gear', 'On-Time Delivery', 'Friendly Partner', '100% Mint Condition'];

  return (
    <div className="min-h-full bg-[#F5F8FB] flex flex-col pb-24">
      <TopBar
        title={lang === 'id' ? 'Ulasan Dua Arah' : 'Two-Way Review'}
        subtitle={`#${activeOrder.id}`}
        onBack={() => onNavigate('inspection_escrow')}
        lang={lang}
        onToggleLang={onToggleLang}
      />

      <div className="p-4 space-y-4">
        {activeOrder.review ? (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-teal-200 p-5 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {lang === 'id' ? 'Ulasan Dua Arah Selesai!' : 'Two-Way Review Complete!'}
              </h2>
              <p className="text-xs text-slate-600">
                {lang === 'id'
                  ? 'Terima kasih! Ulasan Anda & skor dari pemilik telah memperbarui reputasi di Rentiva.'
                  : 'Thank you! Both your review and owner rating have updated Rentiva trust scores.'}
              </p>
            </div>

            {/* Renter's Review */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2">
              <p className="text-xs font-bold text-[#273469]">
                {lang === 'id' ? 'Ulasan Anda untuk Mitra' : 'Your Review for Partner'}
              </p>
              <p className="text-xs text-slate-700 font-mono-num">
                {lang === 'id' ? 'Kebersihan' : 'Cleanliness'}: {activeOrder.review.renterCleanliness}★ ·{' '}
                {lang === 'id' ? 'Kesesuaian' : 'Accuracy'}: {activeOrder.review.renterAccuracy}★ ·{' '}
                {lang === 'id' ? 'Kurir' : 'Courier'}: {activeOrder.review.renterCourier}★
              </p>
              <p className="text-xs text-slate-600">"{activeOrder.review.renterComment}"</p>
            </div>

            {/* Reciprocal Owner Review */}
            <div className="bg-teal-50/70 rounded-2xl border border-teal-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-teal-900">
                  {lang === 'id'
                    ? `Ulasan Balik dari ${activeOrder.ownerName}`
                    : `Reciprocal Review from ${activeOrder.ownerName}`}
                </p>
                <span className="text-xs font-bold text-teal-800 font-mono-num">5.0 ★</span>
              </div>
              <p className="text-xs text-teal-900 leading-relaxed">
                "{lang === 'id' ? activeOrder.review.ownerCommentId : activeOrder.review.ownerCommentEn}"
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className="w-full h-12 rounded-xl bg-[#273469] text-white text-sm font-semibold"
            >
              {lang === 'id' ? 'Kembali ke Jelajah' : 'Back to Explore'}
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-1">
              <p className="text-xs font-semibold text-teal-700">{activeOrder.ownerName}</p>
              <h2 className="text-base font-bold text-slate-900">
                {lang === 'id' ? 'Bagaimana pengalaman sewa Anda?' : 'How was your rental?'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'id'
                  ? 'Penilaian membantu wisatawan lain di Yogyakarta.'
                  : 'Your rating helps fellow travelers in Yogyakarta.'}
              </p>
            </div>

            {/* Star Criteria */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-4">
              {[
                {
                  label: lang === 'id' ? 'Kebersihan barang' : 'Gear cleanliness',
                  val: rClean,
                  set: setRClean,
                },
                {
                  label: lang === 'id' ? 'Kesesuaian dengan deskripsi' : 'Matches description',
                  val: rAcc,
                  set: setRAcc,
                },
                {
                  label: lang === 'id' ? 'Kecepatan serah-terima / kurir' : 'Handover / courier speed',
                  val: rCour,
                  set: setRCour,
                },
              ].map((row, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>{row.label}</span>
                    <span className="text-teal-700 font-mono-num">{row.val}.0 / 5</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => row.set(star)}
                        className="w-10 h-10 rounded-lg hover:bg-slate-50 flex items-center justify-center"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= row.val
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tags & Comment */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
              <p className="text-xs font-bold text-slate-900">
                {lang === 'id' ? 'Tulis Ulasan' : 'Write a Review'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const active = rTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setRTags((prev) =>
                          prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                        )
                      }
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                        active
                          ? 'bg-teal-50 border-teal-300 text-teal-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              <textarea
                rows={3}
                maxLength={500}
                value={rComment}
                onChange={(e) => setRComment(e.target.value)}
                placeholder={
                  lang === 'id'
                    ? 'Ceritakan pengalaman Anda menggunakan perlengkapan ini di Jogja...'
                    : 'Share how the gear performed on your trip in Jogja...'
                }
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#273469]"
              />
            </div>

            <div className="bg-[#EFF5FB] rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
              <ShieldCheck className="w-4 h-4 text-[#273469] shrink-0 mt-0.5" />
              <p>
                {lang === 'id'
                  ? 'Pemilik juga memberi skor ketepatan waktu & perawatan barang untuk memperkuat profil terpercaya Anda.'
                  : 'The owner also rates your return punctuality and care to strengthen your trusted renter score.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onUpdateOrder(activeOrder.id, (o) => ({
                  ...o,
                  stage: 'completed_escrow_released',
                  review: {
                    renterCleanliness: rClean,
                    renterAccuracy: rAcc,
                    renterCourier: rCour,
                    renterTags: rTags,
                    renterComment:
                      rComment.trim() ||
                      (lang === 'id'
                        ? 'Peralatan sangat bersih, pengiriman tepat waktu, dan proses pengembalian mulus!'
                        : 'Gear was spotless, on-time delivery, and seamless return!'),
                    ownerPunctualityScore: 5,
                    ownerCareScore: 5,
                    ownerCommentId:
                      'Penyewa sangat kooperatif, pengembalian tepat waktu dan kondisi unit terawat 100%.',
                    ownerCommentEn:
                      'Very cooperative renter, returned right on schedule in 100% clean condition.',
                    submittedAt: '25 Des 2026, 12:30 WIB',
                  },
                }))
              }
              className="w-full h-12 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              <span>{lang === 'id' ? 'Kirim Ulasan Dua Arah' : 'Submit Two-Way Review'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

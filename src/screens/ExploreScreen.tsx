import React, { useMemo, useState } from 'react';
import {
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Truck,
  Zap,
} from 'lucide-react';
import {
  CategoryKey,
  JogjaArea,
  Language,
  RentalItem,
  ScreenId,
} from '../types/rentiva';
import { RentivaLogo } from '../components/RentivaLogo';
import { ProductImage } from '../components/ProductImage';
import { formatIDR } from '../utils/pricing';
import { t } from '../data/i18n';

interface ExploreScreenProps {
  lang: Language;
  onToggleLang: () => void;
  items: RentalItem[];
  selectedArea: JogjaArea;
  onSelectArea: (area: JogjaArea) => void;
  onSelectItem: (item: RentalItem) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  lang,
  onToggleLang,
  items,
  selectedArea,
  onSelectArea,
  onSelectItem,
  onNavigate,
}) => {
  const copy = t(lang);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryKey>('all');
  const [onlyDelivery, setOnlyDelivery] = useState(false);
  const [onlyInstant, setOnlyInstant] = useState(false);
  const [onlyTopRated, setOnlyTopRated] = useState(false);
  const [showAreaPicker, setShowAreaPicker] = useState(false);

  const areas: { key: JogjaArea; label: string }[] = [
    { key: 'all', label: copy.allAreas },
    { key: 'Kota Yogyakarta', label: 'Kota Yogyakarta' },
    { key: 'Sleman', label: 'Sleman' },
    { key: 'Bantul', label: 'Bantul' },
    { key: 'Bandara YIA', label: 'Bandara YIA' },
  ];

  const categories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: copy.allCategories },
    { key: 'baby', label: copy.catBaby },
    { key: 'camera', label: copy.catCamera },
    { key: 'outdoor', label: copy.catOutdoor },
    { key: 'bundle', label: copy.catBundle },
  ];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!item.available) return false;
      if (category !== 'all' && item.category !== category) return false;
      if (selectedArea !== 'all' && selectedArea !== 'Bandara YIA' && item.area !== selectedArea) {
        return false;
      }
      if (selectedArea === 'Bandara YIA' && !item.deliveryAvailable) return false;
      if (onlyDelivery && !item.deliveryAvailable) return false;
      if (onlyInstant && !item.instantConfirm) return false;
      if (onlyTopRated && item.rating < 4.8) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName =
          item.name.toLowerCase().includes(q) ||
          item.nameEn.toLowerCase().includes(q) ||
          item.district.toLowerCase().includes(q) ||
          item.ownerName.toLowerCase().includes(q);
        if (!matchName) return false;
      }
      return true;
    });
  }, [items, category, selectedArea, onlyDelivery, onlyInstant, onlyTopRated, search]);

  return (
    <div className="min-h-full bg-[#F5F8FB] pb-6">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <RentivaLogo size="sm" />
            <div className="min-w-0">
              <span className="font-display font-bold text-base text-[#273469] block leading-none">
                Rentiva
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5 truncate">
                {copy.yogyakartaTag}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowAreaPicker((v) => !v)}
              className="h-9 px-2.5 rounded-lg bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold flex items-center gap-1 whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="max-w-[96px] truncate">
                {selectedArea === 'all' ? 'Yogyakarta' : selectedArea}
              </span>
            </button>

            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/80">
              <button
                type="button"
                onClick={() => lang !== 'id' && onToggleLang()}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md ${
                  lang === 'id' ? 'bg-[#273469] text-white' : 'text-slate-600'
                }`}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => lang !== 'en' && onToggleLang()}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md ${
                  lang === 'en' ? 'bg-[#273469] text-white' : 'text-slate-600'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Location Filter Drawer */}
        {showAreaPicker && (
          <div className="pt-1 pb-1 flex flex-wrap gap-1.5">
            {areas.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => {
                  onSelectArea(a.key);
                  setShowAreaPicker(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedArea === a.key
                    ? 'bg-[#273469] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-100/80 border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#273469]"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAreaPicker((v) => !v)}
            aria-label="Filter lokasi"
            className="w-11 h-11 rounded-xl bg-slate-100/80 border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-200/60 shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setCategory(cat.key)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                category === cat.key
                  ? 'bg-[#273469] text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setOnlyDelivery((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 border transition-colors ${
              onlyDelivery
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{copy.filterDelivery}</span>
          </button>
          <button
            type="button"
            onClick={() => setOnlyInstant((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 border transition-colors ${
              onlyInstant
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{copy.filterInstant}</span>
          </button>
          <button
            type="button"
            onClick={() => setOnlyTopRated((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 border transition-colors ${
              onlyTopRated
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>{copy.filterRating}</span>
          </button>
        </div>
      </header>

      <div className="px-4 pt-3 space-y-3">
        {/* Count & Duration Discount Hint */}
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>
            <strong className="font-mono-num text-slate-900">{filteredItems.length}</strong>{' '}
            {copy.itemsReady}
          </span>
          <span className="text-teal-700 font-semibold">
            {lang === 'id' ? '3+ hari -10% · 7+ hari -20%' : '3+ days -10% · 7+ days -20%'}
          </span>
        </div>

        {/* Product Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-900">
              {lang === 'id' ? 'Belum ada alat yang sesuai filter' : 'No gear matches your filters'}
            </p>
            <p className="text-xs text-slate-500">
              {lang === 'id'
                ? 'Coba ubah area Yogyakarta/Sleman/Bantul atau hapus kata pencarian.'
                : 'Try switching area filters or clearing your search query.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('all');
                onSelectArea('all');
                setOnlyDelivery(false);
                setOnlyInstant(false);
                setOnlyTopRated(false);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#273469] text-white text-xs font-semibold"
            >
              {lang === 'id' ? 'Reset Filter' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem(item)}
                className="text-left bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-[#273469]/40 hover:shadow-sm active:scale-[0.99] transition-all flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                  <ProductImage
                    src={item.image}
                    alt={lang === 'id' ? item.name : item.nameEn}
                    className="w-full h-full"
                  />
                  {item.isBundle && item.bundleSavingsLabel && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#273469] text-white text-[10px] font-semibold">
                      {item.bundleSavingsLabel}
                    </span>
                  )}
                </div>

                <div className="p-2.5 flex-1 flex flex-col justify-between gap-1.5">
                  <div>
                    <h3 className="text-[13px] font-semibold text-slate-900 line-clamp-2 leading-snug">
                      {lang === 'id' ? item.name : item.nameEn}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 truncate">
                      {item.distanceKm} km · {item.area}
                    </p>
                    <p className="text-[11px] text-teal-700 font-medium mt-0.5 truncate">
                      {item.ownerBadge} · {item.rating.toFixed(1)} ★
                    </p>
                  </div>

                  <div className="pt-1 border-t border-slate-100 flex items-baseline gap-0.5">
                    <span className="text-sm font-bold text-[#273469] font-mono-num">
                      {formatIDR(item.pricePerDay)}
                    </span>
                    <span className="text-[10px] text-slate-500">{copy.perDay}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Hygiene Guarantee Footer Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900">
              {lang === 'id'
                ? 'Peralatan Steril & Perlindungan Escrow'
                : 'Sterilized Gear & Escrow Protection'}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              {lang === 'id'
                ? 'Setiap unit wajib foto 4 sisi sebelum & sesudah sewa. Deposit 100% kembali.'
                : 'Every item requires 4-angle photo verification before and after rental. 100% deposit refund.'}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('ekyc')}
              className="mt-1.5 text-[11px] font-semibold text-[#273469] hover:underline"
            >
              {lang === 'id' ? 'Cek Status eKYC Saya →' : 'Check My eKYC Status →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

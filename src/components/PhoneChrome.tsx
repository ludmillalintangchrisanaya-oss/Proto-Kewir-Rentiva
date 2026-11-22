import React from 'react';
import { ArrowLeft, Compass, FileText, MessageSquare, User } from 'lucide-react';
import { Language, ScreenId } from '../types/rentiva';
import { t } from '../data/i18n';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  lang: Language;
  onToggleLang?: () => void;
  rightSlot?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  onBack,
  lang,
  onToggleLang,
  rightSlot,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 h-14 flex items-center justify-between gap-2 shrink-0">
      <div className="flex items-center gap-1.5 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label={t(lang).back}
            className="min-w-[44px] min-h-[44px] -ml-1.5 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold text-slate-900 truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-slate-500 truncate leading-tight">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {onToggleLang && (
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/70">
            <button
              type="button"
              onClick={() => lang !== 'id' && onToggleLang()}
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                lang === 'id' ? 'bg-[#273469] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ID
            </button>
            <button
              type="button"
              onClick={() => lang !== 'en' && onToggleLang()}
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                lang === 'en' ? 'bg-[#273469] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>
        )}
        {rightSlot}
      </div>
    </header>
  );
};

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  lang: Language;
  activeOrdersCount: number;
  unreadChatsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  lang,
  activeOrdersCount,
  unreadChatsCount,
}) => {
  const copy = t(lang);
  const tabs: {
    id: ScreenId;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'explore', label: copy.explore, icon: Compass },
    { id: 'orders', label: copy.orders, icon: FileText, badge: activeOrdersCount },
    { id: 'chat', label: copy.chat, icon: MessageSquare, badge: unreadChatsCount },
    { id: 'profile', label: copy.profile, icon: User },
  ];

  return (
    <nav
      aria-label="Navigasi utama"
      className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 grid grid-cols-4 h-16 px-2 shrink-0"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          currentScreen === tab.id ||
          (tab.id === 'chat' && currentScreen === 'chat_room') ||
          (tab.id === 'orders' &&
            [
              'order_waiting',
              'pre_condition',
              'handover',
              'active_rental',
              'return_condition',
              'inspection_escrow',
              'review',
            ].includes(currentScreen));
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id)}
            className={`relative min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
              isActive ? 'text-[#273469]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-teal-600 text-white text-[10px] font-semibold flex items-center justify-center font-mono-num">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={`text-[11px] leading-tight whitespace-nowrap ${isActive ? 'font-semibold' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

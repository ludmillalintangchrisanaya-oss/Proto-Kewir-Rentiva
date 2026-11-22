import React, { useState } from 'react';
import {
  ArrowRight,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { ChatThread, Language, ScreenId } from '../types/rentiva';
import { TopBar } from '../components/PhoneChrome';
import { ProductImage } from '../components/ProductImage';

interface ChatScreensProps {
  screen: 'chat' | 'chat_room';
  lang: Language;
  onToggleLang: () => void;
  threads: ChatThread[];
  activeThreadId: string;
  onSelectThread: (id: string) => void;
  onSendMessage: (threadId: string, text: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ChatScreens: React.FC<ChatScreensProps> = ({
  screen,
  lang,
  onToggleLang,
  threads,
  activeThreadId,
  onSelectThread,
  onSendMessage,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | 'owner' | 'support'>('all');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');

  const activeThread = threads.find((th) => th.id === activeThreadId) || threads[0];

  if (screen === 'chat') {
    const shown = threads.filter((th) => {
      if (filter !== 'all' && th.role !== filter) return false;
      if (query.trim()) {
        return th.participantName.toLowerCase().includes(query.toLowerCase());
      }
      return true;
    });

    return (
      <div className="min-h-full bg-[#F5F8FB] pb-8">
        <TopBar
          title="Chat"
          subtitle={lang === 'id' ? 'Komunikasi aman terenkripsi' : 'Encrypted partner chat'}
          onBack={() => onNavigate('explore')}
          lang={lang}
          onToggleLang={onToggleLang}
        />

        <div className="p-4 space-y-3.5">
          {/* Escrow Shield Notice */}
          <div className="bg-[#EFF5FB] border border-[#273469]/15 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
            <ShieldCheck className="w-5 h-5 text-[#273469] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Rentiva Escrow Shield</p>
              <p className="mt-0.5 leading-relaxed">
                {lang === 'id'
                  ? 'Semua kontak & pembayaran terlindungi. Jangan pernah bertransaksi di luar aplikasi demi garansi alat.'
                  : 'All chats and payments are protected. Never transact outside the app.'}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === 'id' ? 'Cari pesan atau mitra...' : 'Search messages or partners...'}
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#273469]"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5">
            {[
              { key: 'all' as const, label: lang === 'id' ? 'Semua' : 'All' },
              { key: 'owner' as const, label: lang === 'id' ? 'Mitra Rental' : 'Partners' },
              { key: 'support' as const, label: lang === 'id' ? 'Bantuan' : 'Support' },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  filter === f.key
                    ? 'bg-[#273469] text-white'
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Thread List */}
          <div className="space-y-2.5">
            {shown.map((th) => {
              const lastMsg = th.messages[th.messages.length - 1];
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    onSelectThread(th.id);
                    onNavigate('chat_room');
                  }}
                  className="w-full text-left bg-white rounded-2xl border border-slate-200/80 p-3.5 hover:border-[#273469]/40 transition-all flex items-start gap-3"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#273469] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {th.participantName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {th.participantName}
                      </p>
                      <span className="text-[11px] text-slate-400 font-mono-num shrink-0">
                        {th.lastTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-teal-700 font-medium truncate">
                      {th.badge} {th.orderTitle ? `· ${th.orderTitle}` : ''}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-xs text-slate-600 truncate">{lastMsg?.text}</p>
                      {th.unread > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center font-mono-num shrink-0">
                          {th.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // CHAT ROOM
  const quickReplies =
    lang === 'id'
      ? ['Kirim Titik Temu Hotel', 'Ubah Waktu Antar', 'Apakah sudah steril UV-C?']
      : ['Send Hotel Meet Point', 'Change Delivery Time', 'Is it UV-C sterilized?'];

  const handleSend = (textToSend?: string) => {
    const clean = (textToSend ?? draft).trim();
    if (!clean) return;
    onSendMessage(activeThread.id, clean);
    if (!textToSend) setDraft('');
  };

  return (
    <div className="min-h-full bg-[#F5F8FB] flex flex-col">
      <TopBar
        title={activeThread.participantName}
        subtitle={`${activeThread.badge || 'Mitra Rentiva'} · Online`}
        onBack={() => onNavigate('chat')}
        lang={lang}
        onToggleLang={onToggleLang}
      />

      {/* Pinned Order Card */}
      {activeThread.orderId && (
        <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-mono-num text-teal-700 font-semibold">
              #{activeThread.orderId}
            </p>
            <p className="text-xs font-bold text-slate-900 truncate">
              {activeThread.orderTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="px-3 py-1.5 rounded-lg bg-[#EFF5FB] text-[#273469] text-xs font-semibold flex items-center gap-1 shrink-0"
          >
            <span>{lang === 'id' ? 'Lihat Pesanan' : 'View Order'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        <p className="text-center text-[11px] text-slate-400">
          {lang === 'id'
            ? 'Nomor ponsel disamarkan demi privasi Anda'
            : 'Phone numbers masked for your privacy'}
        </p>

        {activeThread.messages.map((msg) => {
          const isMe = msg.sender === 'renter';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed space-y-2 ${
                  isMe
                    ? 'bg-[#273469] text-white rounded-br-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                }`}
              >
                {msg.image && (
                  <div className="rounded-xl overflow-hidden bg-slate-100">
                    <ProductImage src={msg.image} alt="Unit photo" className="w-full h-32" />
                    {msg.imageCaption && (
                      <p className="p-2 text-[11px] text-slate-600 bg-slate-50">
                        {msg.imageCaption}
                      </p>
                    )}
                  </div>
                )}
                <p>{msg.text}</p>
                <p
                  className={`text-[10px] font-mono-num text-right ${
                    isMe ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Replies + Input */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 p-3 space-y-2">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((qr) => (
            <button
              key={qr}
              type="button"
              onClick={() => handleSend(qr)}
              className="px-3 py-1.5 rounded-lg bg-[#EFF5FB] text-[#273469] text-[11px] font-semibold whitespace-nowrap shrink-0 hover:bg-slate-200/70"
            >
              {qr}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={lang === 'id' ? 'Tulis pesan...' : 'Type a message...'}
            className="flex-1 h-11 px-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-[#273469]"
          />
          <button
            type="submit"
            aria-label="Send"
            className="w-11 h-11 rounded-xl bg-[#273469] hover:bg-[#1e2854] text-white flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

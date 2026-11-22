/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import {
  ChatThread,
  DeliveryMethod,
  EkycState,
  JogjaArea,
  Language,
  OrderRecord,
  PaymentMethod,
  PromoCode,
  RentalItem,
  RoleMode,
  ScreenId,
} from './types/rentiva';
import {
  INITIAL_CHATS,
  INITIAL_ORDERS,
  RENTAL_CATALOG,
  createInitialPostPhotos,
  createInitialPrePhotos,
} from './data/mockCatalog';
import { calculateEscrowBreakdown } from './utils/pricing';
import { BottomNav } from './components/PhoneChrome';
import { StudioFlowInspector } from './components/StudioFlowInspector';
import { AuthScreens } from './screens/AuthScreens';
import { EkycScreen } from './screens/EkycScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { DetailScreen } from './screens/DetailScreen';
import { CheckoutScreen, PaymentScreen } from './screens/CheckoutPaymentScreens';
import { OrderLifecycleScreens } from './screens/OrderLifecycleScreens';
import { ChatScreens } from './screens/ChatScreens';
import { OwnerDashboard, ProfileScreen } from './screens/ProfileAndOwnerScreens';

export default function App() {
  const [lang, setLang] = useState<Language>('id');
  const [roleMode, setRoleMode] = useState<RoleMode>('renter');
  const [screen, setScreen] = useState<ScreenId>('splash');
  const [ekycReturnScreen, setEkycReturnScreen] = useState<ScreenId>('explore');

  // Catalog & Filters
  const [catalog, setCatalog] = useState<RentalItem[]>(RENTAL_CATALOG);
  const [selectedArea, setSelectedArea] = useState<JogjaArea>('all');
  const [selectedItemId, setSelectedItemId] = useState<string>(RENTAL_CATALOG[0].id);

  // Booking Draft State
  const [startDay, setStartDay] = useState<number>(22);
  const [durationDays, setDurationDays] = useState<number>(3);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('hotel_courier');
  const [deliveryLocationName, setDeliveryLocationName] = useState<string>(
    'Hotel Tentrem Yogyakarta'
  );
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    'Jl. P. Mangkubumi No.72A, Jetis, Kota Yogyakarta · Resepsionis'
  );
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');

  // User & eKYC State
  const [userEmail, setUserEmail] = useState('ajeng.prasetya@email.com');
  const [ekyc, setEkyc] = useState<EkycState>({
    verified: true,
    docType: 'ktp',
    fullName: 'Ajeng Prasetya',
    docNumberMasked: '2172••••••••1234',
    phone: '+62 812-3456-7890',
    phoneVerified: true,
    docScanned: true,
    faceMatched: true,
    biometricConsented: true,
  });

  // Orders & Chats
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [activeOrderId, setActiveOrderId] = useState<string>(INITIAL_ORDERS[0].id);
  const [chats, setChats] = useState<ChatThread[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>(INITIAL_CHATS[0].id);

  const selectedItem = useMemo(
    () => catalog.find((c) => c.id === selectedItemId) || catalog[0],
    [catalog, selectedItemId]
  );

  const activeOrder = useMemo(
    () => orders.find((o) => o.id === activeOrderId) || orders[0],
    [orders, activeOrderId]
  );

  const draftBreakdown = useMemo(
    () =>
      calculateEscrowBreakdown({
        pricePerDay: selectedItem.pricePerDay,
        durationDays,
        deposit: selectedItem.deposit,
        deliveryMethod,
        promo: appliedPromo,
      }),
    [selectedItem, durationDays, deliveryMethod, appliedPromo]
  );

  const toggleLang = () => setLang((l) => (l === 'id' ? 'en' : 'id'));

  const handleUpdateOrder = (orderId: string, updater: (prev: OrderRecord) => OrderRecord) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updater(o) : o)));
  };

  const handleConfirmPayment = () => {
    const newId = `RNT-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    const newOrder: OrderRecord = {
      id: newId,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      itemNameEn: selectedItem.nameEn,
      itemImage: selectedItem.image,
      ownerName: selectedItem.ownerName,
      ownerBadge: selectedItem.ownerBadge,
      renterName: ekyc.fullName,
      startDate: `${startDay} Des 2026`,
      endDate: `${startDay + durationDays} Des 2026`,
      durationDays,
      deliveryMethod,
      deliveryLocationName,
      deliveryAddress,
      paymentMethod,
      promoCodeApplied: appliedPromo?.code,
      breakdown: draftBreakdown,
      stage: 'awaiting_owner_confirmation',
      prePhotos: createInitialPrePhotos(selectedItem.image),
      preChecklist: {
        uvcSealed: true,
        physicalIntact: false,
        accessoriesComplete: false,
      },
      postPhotos: createInitialPostPhotos(),
      postChecklist: {
        allPartsReturned: false,
        lightCleaned: false,
      },
      handoverOtp: String(Math.floor(1000 + Math.random() * 8999)),
      courierName: 'Budi Santoso',
      courierVehicle: 'Honda Vario · AB 1234 XX',
      createdAt: 'Baru saja',
    };
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    setScreen('order_waiting');
  };

  const handleOpenChatWithOwner = (ownerName: string) => {
    const existing = chats.find((c) =>
      c.participantName.toLowerCase().includes(ownerName.toLowerCase().slice(0, 6))
    );
    if (existing) {
      setActiveChatId(existing.id);
      setChats((prev) =>
        prev.map((c) => (c.id === existing.id ? { ...c, unread: 0 } : c))
      );
    } else {
      const created: ChatThread = {
        id: `chat-${Date.now()}`,
        participantName: ownerName,
        role: 'owner',
        badge: 'Mitra Rentiva',
        orderId: activeOrder.id,
        orderTitle: selectedItem.name,
        unread: 0,
        lastTime: 'Sekarang',
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'owner',
            text:
              lang === 'id'
                ? `Halo Kak ${ekyc.fullName}, ada yang ingin ditanyakan terkait ${selectedItem.name}?`
                : `Hi ${ekyc.fullName}, anything we can help with regarding ${selectedItem.name}?`,
            time: '10:50',
          },
        ],
      };
      setChats((prev) => [created, ...prev]);
      setActiveChatId(created.id);
    }
    setScreen('chat_room');
  };

  const handleSendMessage = (threadId: string, text: string) => {
    const nowTime = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setChats((prev) =>
      prev.map((th) => {
        if (th.id !== threadId) return th;
        const replyText =
          lang === 'id'
            ? 'Siap Kak, informasi sudah kami catat di sistem Rentiva. Kurir akan menyesuaikan jadwal Anda!'
            : 'Got it! Noted in Rentiva system. Our courier will coordinate with your schedule!';
        return {
          ...th,
          unread: 0,
          lastTime: nowTime,
          messages: [
            ...th.messages,
            { id: `m-${Date.now()}`, sender: 'renter', text, time: nowTime },
            {
              id: `m-${Date.now() + 1}`,
              sender: th.role === 'support' ? 'support' : 'owner',
              text: replyText,
              time: nowTime,
            },
          ],
        };
      })
    );
  };

  const handleSwitchRole = (role: RoleMode) => {
    setRoleMode(role);
    if (role === 'owner') {
      setScreen('owner_dashboard');
    } else if (screen === 'owner_dashboard') {
      setScreen('explore');
    }
  };

  const handleResetDemo = () => {
    setCatalog(RENTAL_CATALOG);
    setOrders(INITIAL_ORDERS);
    setActiveOrderId(INITIAL_ORDERS[0].id);
    setChats(INITIAL_CHATS);
    setRoleMode('renter');
    setScreen('splash');
  };

  const showRenterBottomNav =
    roleMode === 'renter' && ['explore', 'orders', 'chat', 'profile'].includes(screen);

  const activeOrdersCount = orders.filter(
    (o) => o.stage !== 'completed_escrow_released'
  ).length;
  const unreadChatsCount = chats.reduce((sum, c) => sum + c.unread, 0);

  const renderMobileScreen = () => {
    if (roleMode === 'owner' || screen === 'owner_dashboard') {
      return (
        <OwnerDashboard
          lang={lang}
          onToggleLang={toggleLang}
          items={catalog}
          orders={orders}
          onUpdateOrder={handleUpdateOrder}
          onToggleItemAvailability={(itemId) =>
            setCatalog((prev) =>
              prev.map((it) => (it.id === itemId ? { ...it, available: !it.available } : it))
            )
          }
          onAddNewListing={(newItem) => setCatalog((prev) => [newItem, ...prev])}
          onSwitchToRenter={() => handleSwitchRole('renter')}
          onNavigateRenterScreen={(targetScreen, ordId) => {
            if (ordId) setActiveOrderId(ordId);
            setRoleMode('renter');
            setScreen(targetScreen);
          }}
        />
      );
    }

    switch (screen) {
      case 'splash':
      case 'onboarding':
      case 'login':
      case 'register':
      case 'otp':
        return (
          <AuthScreens
            screen={screen}
            lang={lang}
            onToggleLang={toggleLang}
            onNavigate={setScreen}
            userEmail={userEmail}
            userName={ekyc.fullName}
            onUpdateUser={(name, email, phone) => {
              setUserEmail(email);
              setEkyc((prev) => ({ ...prev, fullName: name, phone }));
            }}
          />
        );

      case 'ekyc':
        return (
          <EkycScreen
            lang={lang}
            onToggleLang={toggleLang}
            ekyc={ekyc}
            onUpdateEkyc={setEkyc}
            onBack={() => setScreen(ekycReturnScreen)}
            onComplete={() => setScreen(ekycReturnScreen)}
          />
        );

      case 'explore':
        return (
          <ExploreScreen
            lang={lang}
            onToggleLang={toggleLang}
            items={catalog}
            selectedArea={selectedArea}
            onSelectArea={setSelectedArea}
            onSelectItem={(item) => {
              setSelectedItemId(item.id);
              setScreen('detail');
            }}
            onNavigate={(sc) => {
              if (sc === 'ekyc') setEkycReturnScreen('explore');
              setScreen(sc);
            }}
          />
        );

      case 'detail':
        return (
          <DetailScreen
            lang={lang}
            onToggleLang={toggleLang}
            item={selectedItem}
            durationDays={durationDays}
            startDay={startDay}
            onChangeDates={(s, d) => {
              setStartDay(s);
              setDurationDays(d);
            }}
            onBack={() => setScreen('explore')}
            onProceedToCheckout={() => setScreen('checkout')}
            onChatOwner={handleOpenChatWithOwner}
          />
        );

      case 'checkout':
        return (
          <CheckoutScreen
            lang={lang}
            onToggleLang={toggleLang}
            item={selectedItem}
            startDay={startDay}
            durationDays={durationDays}
            deliveryMethod={deliveryMethod}
            deliveryLocationName={deliveryLocationName}
            deliveryAddress={deliveryAddress}
            appliedPromo={appliedPromo}
            ekyc={ekyc}
            onChangeDelivery={(m, name, addr) => {
              setDeliveryMethod(m);
              setDeliveryLocationName(name);
              setDeliveryAddress(addr);
            }}
            onApplyPromo={setAppliedPromo}
            onRequireEkyc={() => {
              setEkycReturnScreen('checkout');
              setScreen('ekyc');
            }}
            onBack={() => setScreen('detail')}
            onProceedToPayment={() => setScreen('payment')}
          />
        );

      case 'payment':
        return (
          <PaymentScreen
            lang={lang}
            onToggleLang={toggleLang}
            orderId={`RNT-2026-NEW`}
            itemName={`${lang === 'id' ? selectedItem.name : selectedItem.nameEn} (${durationDays} ${
              lang === 'id' ? 'hari' : 'days'
            })`}
            totalEscrow={draftBreakdown.totalEscrow}
            depositAmount={draftBreakdown.depositAmount}
            paymentMethod={paymentMethod}
            onSelectPaymentMethod={setPaymentMethod}
            onBack={() => setScreen('checkout')}
            onConfirmPaid={handleConfirmPayment}
          />
        );

      case 'orders':
      case 'order_waiting':
      case 'pre_condition':
      case 'handover':
      case 'active_rental':
      case 'return_condition':
      case 'inspection_escrow':
      case 'review':
        return (
          <OrderLifecycleScreens
            screen={screen}
            lang={lang}
            onToggleLang={toggleLang}
            orders={orders}
            activeOrder={activeOrder}
            onSelectOrder={setActiveOrderId}
            onUpdateOrder={handleUpdateOrder}
            onNavigate={setScreen}
            onOpenChat={handleOpenChatWithOwner}
          />
        );

      case 'chat':
      case 'chat_room':
        return (
          <ChatScreens
            screen={screen}
            lang={lang}
            onToggleLang={toggleLang}
            threads={chats}
            activeThreadId={activeChatId}
            onSelectThread={(id) => {
              setActiveChatId(id);
              setChats((prev) =>
                prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
              );
            }}
            onSendMessage={handleSendMessage}
            onNavigate={setScreen}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            lang={lang}
            onToggleLang={toggleLang}
            ekyc={ekyc}
            onToggleEkycStatus={() =>
              setEkyc((prev) => ({ ...prev, verified: !prev.verified }))
            }
            onNavigate={(sc) => {
              if (sc === 'ekyc') setEkycReturnScreen('profile');
              setScreen(sc);
            }}
            onSwitchRole={handleSwitchRole}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#E9EFF6] lg:py-6 lg:px-6 flex items-center justify-center">
      <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[412px_1fr] gap-6 items-start">
        {/* Interactive Mobile App Frame (Full-bleed on mobile, crisp device frame on desktop) */}
        <main className="w-full min-h-screen lg:min-h-0 lg:h-[820px] bg-[#F5F8FB] lg:rounded-[36px] lg:border-[6px] lg:border-[#1B254B] lg:shadow-2xl overflow-hidden flex flex-col mx-auto max-w-[430px] lg:max-w-none relative">
          <div className="flex-1 overflow-y-auto phone-scroll">{renderMobileScreen()}</div>
          {showRenterBottomNav && (
            <BottomNav
              currentScreen={screen}
              onNavigate={setScreen}
              lang={lang}
              activeOrdersCount={activeOrdersCount}
              unreadChatsCount={unreadChatsCount}
            />
          )}
        </main>

        {/* Desktop Companion Flow Navigator & Live Escrow Ledger */}
        <StudioFlowInspector
          lang={lang}
          onToggleLang={toggleLang}
          roleMode={roleMode}
          onSwitchRole={handleSwitchRole}
          currentScreen={screen}
          onJumpScreen={(sc) => {
            if (sc === 'ekyc') setEkycReturnScreen('checkout');
            setScreen(sc);
          }}
          onResetDemo={handleResetDemo}
          liveBreakdown={screen === 'checkout' || screen === 'payment' ? draftBreakdown : activeOrder.breakdown}
          activeOrderId={screen === 'checkout' || screen === 'payment' ? 'DRAFT' : activeOrder.id}
        />
      </div>
    </div>
  );
}

export type Language = 'id' | 'en';
export type RoleMode = 'renter' | 'owner';

export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'otp'
  | 'ekyc'
  | 'explore'
  | 'detail'
  | 'checkout'
  | 'payment'
  | 'orders'
  | 'order_waiting'
  | 'pre_condition'
  | 'handover'
  | 'active_rental'
  | 'return_condition'
  | 'inspection_escrow'
  | 'review'
  | 'chat'
  | 'chat_room'
  | 'profile'
  | 'owner_dashboard';

export type CategoryKey = 'all' | 'baby' | 'camera' | 'outdoor' | 'bundle';
export type JogjaArea = 'all' | 'Kota Yogyakarta' | 'Sleman' | 'Bantul' | 'Bandara YIA';
export type DeliveryMethod = 'hotel_courier' | 'yia_courier' | 'pickup_hub';
export type PaymentMethod = 'qris' | 'va' | 'card';
export type OwnerBadge = 'Mitra Pro' | 'Pemilik Tepercaya';

export type OrderStage =
  | 'awaiting_payment'
  | 'awaiting_owner_confirmation'
  | 'pre_condition_docs'
  | 'in_delivery_or_pickup'
  | 'active_usage'
  | 'return_submitted'
  | 'owner_inspection'
  | 'completed_escrow_released'
  | 'dispute_open';

export interface RentalItem {
  id: string;
  name: string;
  nameEn: string;
  category: Exclude<CategoryKey, 'all'>;
  isBundle?: boolean;
  bundleItems?: string[];
  bundleItemsEn?: string[];
  bundleSavingsLabel?: string;
  pricePerDay: number;
  deposit: number;
  area: Exclude<JogjaArea, 'all'>;
  district: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  conditionGrade: string;
  conditionNote: string;
  conditionNoteEn: string;
  instantConfirm: boolean;
  deliveryAvailable: boolean;
  available: boolean;
  image: string;
  ownerId: string;
  ownerName: string;
  ownerBadge: OwnerBadge;
  ownerResponseRate: number;
  hubAddress: string;
  hubHours: string;
  specs: { labelId: string; labelEn: string; valueId: string; valueEn: string }[];
  hygieneNoteId: string;
  hygieneNoteEn: string;
  reviews: {
    id: string;
    author: string;
    roleId: string;
    roleEn: string;
    date: string;
    rating: number;
    textId: string;
    textEn: string;
  }[];
}

export interface PromoCode {
  code: string;
  type: 'flat' | 'percent';
  value: number;
  maxDiscount?: number;
  labelId: string;
  labelEn: string;
}

export interface ConditionPhotoSlot {
  id: string;
  labelId: string;
  labelEn: string;
  captured: boolean;
  timestamp?: string;
  locationTag?: string;
  evidenceCode?: string;
  previewImage?: string;
}

export interface OrderBreakdown {
  durationDays: number;
  baseRent: number;
  durationDiscountRate: number;
  durationDiscountAmount: number;
  promoDiscountAmount: number;
  rentAfterDiscounts: number;
  renterServiceFee8: number;
  courierFee: number;
  depositAmount: number;
  totalEscrow: number;
  platformCommission12: number;
  ownerNet88: number;
}

export interface DisputeRecord {
  reason: string;
  description: string;
  status: 'mediation' | 'resolved';
  createdAt: string;
}

export interface TwoWayReview {
  renterCleanliness: number;
  renterAccuracy: number;
  renterCourier: number;
  renterTags: string[];
  renterComment: string;
  ownerPunctualityScore: number;
  ownerCareScore: number;
  ownerCommentId: string;
  ownerCommentEn: string;
  submittedAt: string;
}

export interface OrderRecord {
  id: string;
  itemId: string;
  itemName: string;
  itemNameEn: string;
  itemImage: string;
  ownerName: string;
  ownerBadge: OwnerBadge;
  renterName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  deliveryMethod: DeliveryMethod;
  deliveryLocationName: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  promoCodeApplied?: string;
  breakdown: OrderBreakdown;
  stage: OrderStage;
  prePhotos: ConditionPhotoSlot[];
  preChecklist: {
    uvcSealed: boolean;
    physicalIntact: boolean;
    accessoriesComplete: boolean;
  };
  postPhotos: ConditionPhotoSlot[];
  postChecklist: {
    allPartsReturned: boolean;
    lightCleaned: boolean;
  };
  handoverOtp: string;
  courierName: string;
  courierVehicle: string;
  dispute?: DisputeRecord;
  review?: TwoWayReview;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'renter' | 'owner' | 'support';
  text: string;
  time: string;
  image?: string;
  imageCaption?: string;
}

export interface ChatThread {
  id: string;
  participantName: string;
  role: 'owner' | 'support';
  badge?: string;
  orderId?: string;
  orderTitle?: string;
  unread: number;
  lastTime: string;
  messages: ChatMessage[];
}

export interface EkycState {
  verified: boolean;
  docType: 'ktp' | 'passport';
  fullName: string;
  docNumberMasked: string;
  phone: string;
  phoneVerified: boolean;
  docScanned: boolean;
  faceMatched: boolean;
  biometricConsented: boolean;
}

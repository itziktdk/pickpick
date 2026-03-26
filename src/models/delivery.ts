// שליחויות בין חברים - Friend Delivery Service

export interface DeliveryOffer {
  id: string;
  offererId: string; // מי שנמצא בנקודת האיסוף
  pickupLocationId: string;
  pickupLocationName: string;
  status: 'active' | 'expired' | 'completed';
  availablePackageIds: string[]; // חבילות של חברים באותו מיקום
  createdAt: string;
  expiresAt: string; // 30 דקות TTL
}

export interface DeliveryRequest {
  id: string;
  offerId: string;
  packageId: string;
  requesterId: string; // בעל החבילה שרוצה משלוח
  delivererId: string; // מי שאוסף
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  price: number; // 10₪
  delivererEarnings: number; // 7₪
  commission: number; // 3₪ - עמלת PickPick
  deliveryAddress: string;
  pickupConfirmedAt?: string;
  deliveredAt?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

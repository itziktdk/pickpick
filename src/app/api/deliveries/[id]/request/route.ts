import { NextRequest, NextResponse } from 'next/server';
import { getDeliveryOffersRepo, getDeliveryRequestsRepo } from '@/lib/db';
import { DeliveryRequest } from '@/models/delivery';
import { v4 as uuid } from 'uuid';

const PRICE = 10;
const DELIVERER_EARNINGS = 7;
const COMMISSION = 3;

// POST - חבר מבקש שליחות (מקבל את ההצעה, משלם 10₪)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { requesterId, packageId, deliveryAddress } = await req.json();

    if (!requesterId || !packageId || !deliveryAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ודא שההצעה קיימת ופעילה
    const offersRepo = await getDeliveryOffersRepo();
    const offer = await offersRepo.findById(params.id);

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    if (offer.status !== 'active') {
      return NextResponse.json({ error: 'Offer is no longer active' }, { status: 400 });
    }

    if (new Date(offer.expiresAt) < new Date()) {
      await offersRepo.update(params.id, { status: 'expired' });
      return NextResponse.json({ error: 'Offer has expired' }, { status: 400 });
    }

    if (!offer.availablePackageIds.includes(packageId)) {
      return NextResponse.json({ error: 'Package not in this offer' }, { status: 400 });
    }

    // בדוק שלא כבר ביקשו את החבילה הזו
    const requestsRepo = await getDeliveryRequestsRepo();
    const existing = await requestsRepo.findBy(
      r => r.offerId === params.id && r.packageId === packageId && r.status !== 'cancelled'
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Package already requested' }, { status: 409 });
    }

    const now = new Date().toISOString();
    const request: DeliveryRequest = {
      id: uuid(),
      offerId: params.id,
      packageId,
      requesterId,
      delivererId: offer.offererId,
      status: 'pending',
      price: PRICE,
      delivererEarnings: DELIVERER_EARNINGS,
      commission: COMMISSION,
      deliveryAddress,
      createdAt: now,
      updatedAt: now,
    };

    await requestsRepo.create(request);

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error('Error creating delivery request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - עדכון סטטוס בקשה (picked_up, in_transit, delivered)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { requestId, status } = await req.json();

    if (!requestId || !status) {
      return NextResponse.json({ error: 'requestId and status required' }, { status: 400 });
    }

    const validTransitions: Record<string, string[]> = {
      pending: ['accepted', 'cancelled'],
      accepted: ['picked_up', 'cancelled'],
      picked_up: ['in_transit'],
      in_transit: ['delivered'],
    };

    const requestsRepo = await getDeliveryRequestsRepo();
    const existing = await requestsRepo.findById(requestId);

    if (!existing) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (!validTransitions[existing.status]?.includes(status)) {
      return NextResponse.json({
        error: `Cannot transition from ${existing.status} to ${status}`
      }, { status: 400 });
    }

    const updates: Partial<DeliveryRequest> = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (status === 'picked_up') updates.pickupConfirmedAt = new Date().toISOString();
    if (status === 'delivered') updates.deliveredAt = new Date().toISOString();

    const updated = await requestsRepo.update(requestId, updates);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating delivery request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

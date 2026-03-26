import { NextRequest, NextResponse } from 'next/server';
import { getDeliveryOffersRepo } from '@/lib/db';

// GET - פרטי הצעת שליחות
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const offersRepo = await getDeliveryOffersRepo();
    const offer = await offersRepo.findById(params.id);

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // בדוק אם פג תוקף
    if (offer.status === 'active' && new Date(offer.expiresAt) < new Date()) {
      await offersRepo.update(params.id, { status: 'expired' });
      offer.status = 'expired';
    }

    return NextResponse.json(offer);
  } catch (error) {
    console.error('Error fetching offer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - עדכון סטטוס הצעה
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();

    if (!['active', 'expired', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const offersRepo = await getDeliveryOffersRepo();
    const updated = await offersRepo.update(params.id, { status });

    if (!updated) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

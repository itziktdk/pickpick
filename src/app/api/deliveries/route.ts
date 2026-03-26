import { NextRequest, NextResponse } from 'next/server';
import { getDeliveryOffersRepo, getDeliveryRequestsRepo, getPackagesRepo, getFamiliesRepo } from '@/lib/db';
import { DeliveryOffer } from '@/models/delivery';
import { v4 as uuid } from 'uuid';

// POST - יצירת הצעת שליחות (כשמשתמש מגיע לנקודת איסוף)
export async function POST(req: NextRequest) {
  try {
    const { offererId, pickupLocationId, pickupLocationName } = await req.json();

    if (!offererId || !pickupLocationId || !pickupLocationName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // מצא את כל המשפחות/חברים של המשתמש
    const familiesRepo = await getFamiliesRepo();
    const families = await familiesRepo.findBy(f => f.members.includes(offererId));
    const friendIds = [...new Set(families.flatMap(f => f.members))].filter(id => id !== offererId);

    if (friendIds.length === 0) {
      return NextResponse.json({ error: 'No friends found' }, { status: 404 });
    }

    // מצא חבילות של חברים באותו מיקום
    const packagesRepo = await getPackagesRepo();
    const allPackages = await packagesRepo.findBy(
      p => friendIds.includes(p.userId) &&
        p.pickupLocationId === pickupLocationId &&
        p.status === 'ready_for_pickup'
    );

    if (allPackages.length === 0) {
      return NextResponse.json({ error: 'No friend packages at this location' }, { status: 404 });
    }

    const now = new Date();
    const offer: DeliveryOffer = {
      id: uuid(),
      offererId,
      pickupLocationId,
      pickupLocationName,
      status: 'active',
      availablePackageIds: allPackages.map(p => p.id),
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 30 * 60 * 1000).toISOString(), // 30 דקות
    };

    const offersRepo = await getDeliveryOffersRepo();
    await offersRepo.create(offer);

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error('Error creating delivery offer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - היסטוריית שליחויות של המשתמש
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const role = req.nextUrl.searchParams.get('role'); // 'deliverer' | 'requester' | undefined (both)

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const offersRepo = await getDeliveryOffersRepo();
    const requestsRepo = await getDeliveryRequestsRepo();

    const results: { offers: DeliveryOffer[]; requests: any[] } = { offers: [], requests: [] };

    if (!role || role === 'deliverer') {
      results.offers = await offersRepo.findBy(o => o.offererId === userId);
    }

    if (!role || role === 'requester') {
      results.requests = await requestsRepo.findBy(r => r.requesterId === userId);
    }

    if (role === 'deliverer') {
      // גם בקשות שהוא שליח בהן
      const delivererRequests = await requestsRepo.findBy(r => r.delivererId === userId);
      results.requests = delivererRequests;
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

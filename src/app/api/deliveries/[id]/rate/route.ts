import { NextRequest, NextResponse } from 'next/server';
import { getDeliveryRequestsRepo } from '@/lib/db';

// POST - דירוג שליחות (1-5 כוכבים)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { requestId, rating } = await req.json();

    if (!requestId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'requestId and rating (1-5) required' }, { status: 400 });
    }

    const requestsRepo = await getDeliveryRequestsRepo();
    const request = await requestsRepo.findById(requestId);

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (request.status !== 'delivered') {
      return NextResponse.json({ error: 'Can only rate delivered requests' }, { status: 400 });
    }

    if (request.rating) {
      return NextResponse.json({ error: 'Already rated' }, { status: 409 });
    }

    const updated = await requestsRepo.update(requestId, {
      rating,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error rating delivery:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

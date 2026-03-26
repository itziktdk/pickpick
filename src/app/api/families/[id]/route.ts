import { NextRequest, NextResponse } from 'next/server';
import { getFamiliesRepo } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = await getFamiliesRepo();
    const family = await repo.findById(params.id);

    if (!family) {
      return NextResponse.json({ error: 'משפחה לא נמצאה' }, { status: 404 });
    }

    return NextResponse.json(family);
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה' }, { status: 500 });
  }
}

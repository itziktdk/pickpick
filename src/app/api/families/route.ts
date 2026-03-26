import { NextRequest, NextResponse } from 'next/server';
import { getFamiliesRepo, getUsersRepo } from '@/lib/db';
import { Family } from '@/models/family';
import { v4 as uuid } from 'uuid';

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, ownerId } = body;

    if (!name || !ownerId) {
      return NextResponse.json({ error: 'שם וownerId נדרשים' }, { status: 400 });
    }

    const repo = await getFamiliesRepo();
    const family: Family = {
      id: uuid(),
      name,
      ownerId,
      memberIds: [ownerId],
      inviteCode: generateInviteCode(),
      createdAt: new Date().toISOString(),
    };

    await repo.create(family);

    // Add family to user's familyIds
    const usersRepo = await getUsersRepo();
    const user = await usersRepo.findById(ownerId);
    if (user) {
      const familyIds = [...(user.familyIds || []), family.id];
      await usersRepo.update(ownerId, { familyIds } as any);
    }

    return NextResponse.json(family, { status: 201 });
  } catch (error) {
    console.error('Error creating family:', error);
    return NextResponse.json({ error: 'שגיאה ביצירת משפחה' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const repo = await getFamiliesRepo();
    const families = await repo.findAll();
    return NextResponse.json(families);
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה בטעינת משפחות' }, { status: 500 });
  }
}

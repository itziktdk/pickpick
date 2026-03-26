import { NextRequest, NextResponse } from 'next/server';
import { getFamiliesRepo, getUsersRepo } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { inviteCode, userId } = body;

    if (!inviteCode || !userId) {
      return NextResponse.json({ error: 'קוד הזמנה ומשתמש נדרשים' }, { status: 400 });
    }

    const repo = await getFamiliesRepo();
    const family = await repo.findById(params.id);

    if (!family) {
      return NextResponse.json({ error: 'משפחה לא נמצאה' }, { status: 404 });
    }

    if (family.inviteCode !== inviteCode) {
      return NextResponse.json({ error: 'קוד הזמנה שגוי' }, { status: 403 });
    }

    if (family.memberIds.includes(userId)) {
      return NextResponse.json({ error: 'כבר חבר במשפחה' }, { status: 400 });
    }

    const updatedMembers = [...family.memberIds, userId];
    await repo.update(params.id, { memberIds: updatedMembers } as any);

    // Add family to user
    const usersRepo = await getUsersRepo();
    const user = await usersRepo.findById(userId);
    if (user) {
      const familyIds = [...(user.familyIds || []), family.id];
      await usersRepo.update(userId, { familyIds } as any);
    }

    return NextResponse.json({ ...family, memberIds: updatedMembers });
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה בהצטרפות' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getFamiliesRepo, getUsersRepo } from '@/lib/db';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const repo = await getFamiliesRepo();
    const family = await repo.findById(params.id);

    if (!family) {
      return NextResponse.json({ error: 'משפחה לא נמצאה' }, { status: 404 });
    }

    if (!family.memberIds.includes(params.userId)) {
      return NextResponse.json({ error: 'המשתמש אינו חבר במשפחה' }, { status: 400 });
    }

    // Owner can't be removed, only delete family
    if (family.ownerId === params.userId) {
      return NextResponse.json({ error: 'לא ניתן להסיר את בעל המשפחה' }, { status: 400 });
    }

    const updatedMembers = family.memberIds.filter((id) => id !== params.userId);
    await repo.update(params.id, { memberIds: updatedMembers } as any);

    // Remove family from user
    const usersRepo = await getUsersRepo();
    const user = await usersRepo.findById(params.userId);
    if (user) {
      const familyIds = (user.familyIds || []).filter((fid) => fid !== params.id);
      await usersRepo.update(params.userId, { familyIds } as any);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה בהסרת חבר' }, { status: 500 });
  }
}

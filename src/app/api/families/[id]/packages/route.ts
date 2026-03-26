import { NextRequest, NextResponse } from 'next/server';
import { getFamiliesRepo, getPackagesRepo } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const familiesRepo = await getFamiliesRepo();
    const family = await familiesRepo.findById(params.id);

    if (!family) {
      return NextResponse.json({ error: 'משפחה לא נמצאה' }, { status: 404 });
    }

    const packagesRepo = await getPackagesRepo();
    const allPackages = await packagesRepo.findAll();

    // Get packages belonging to family members OR explicitly shared with family
    const familyPackages = allPackages.filter(
      (pkg) => family.memberIds.includes(pkg.userId) || pkg.familyId === params.id
    );

    return NextResponse.json(familyPackages);
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה בטעינת חבילות' }, { status: 500 });
  }
}

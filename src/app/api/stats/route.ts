import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { packageRepository } from '@/lib/db/repositories/package-repository';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const packages = await packageRepository.findBy(p => p.userId === auth.userId);

  const now = new Date();
  const thisMonth = packages.filter(p => {
    const d = new Date(p.receivedDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const storeCounts: Record<string, number> = {};
  packages.forEach(p => { storeCounts[p.storeName] = (storeCounts[p.storeName] || 0) + 1; });
  const favoriteStores = Object.entries(storeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return NextResponse.json({
    totalThisMonth: thisMonth.length,
    totalAll: packages.length,
    activeCount: packages.filter(p => p.status !== 'picked_up').length,
    readyCount: packages.filter(p => p.status === 'ready_for_pickup').length,
    favoriteStores,
  });
}

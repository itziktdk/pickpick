import { mockPackages } from '@/lib/mock-data';
import PackageDetailClient from './package-detail-client';

export function generateStaticParams() {
  return mockPackages.map((pkg) => ({ id: pkg.id }));
}

export default function PackageDetailPage() {
  return <PackageDetailClient />;
}

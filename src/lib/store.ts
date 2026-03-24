import { create } from 'zustand';
import { Package, PackageStatus } from '@/types/package';
import { mockPackages } from '@/lib/mock-data';

interface PackageStore {
  packages: Package[];
  filter: PackageStatus | 'all';
  setFilter: (f: PackageStatus | 'all') => void;
  addPackage: (pkg: Omit<Package, 'id' | 'statusHistory'>) => void;
  getPackage: (id: string) => Package | undefined;
  filteredPackages: () => Package[];
}

export const usePackageStore = create<PackageStore>((set, get) => ({
  packages: mockPackages,
  filter: 'all',
  setFilter: (f) => set({ filter: f }),
  addPackage: (pkg) => {
    const newPkg: Package = {
      ...pkg,
      id: crypto.randomUUID(),
      statusHistory: [{ status: pkg.status, date: new Date().toISOString(), note: 'נוסף ידנית' }],
    };
    set((s) => ({ packages: [newPkg, ...s.packages] }));
  },
  getPackage: (id) => get().packages.find((p) => p.id === id),
  filteredPackages: () => {
    const { packages, filter } = get();
    const filtered = filter === 'all' ? packages : packages.filter((p) => p.status === filter);
    return [...filtered].sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime());
  },
}));

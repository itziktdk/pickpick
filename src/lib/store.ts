import { create } from 'zustand';
import { Package, PackageStatus } from '@/types/package';
import { mockPackages } from '@/lib/mock-data';

interface PackageStore {
  packages: Package[];
  filter: PackageStatus | 'all';
  setFilter: (f: PackageStatus | 'all') => void;
  addPackage: (pkg: Omit<Package, 'id' | 'statusHistory'>) => void;
  getPackage: (id: string) => Package | undefined;
  updatePackageStatus: (id: string, status: PackageStatus, note?: string) => void;
  filteredPackages: () => Package[];
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
  showConfetti: boolean;
  triggerConfetti: () => void;
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
    get().showToast('חבילה נוספה! ✅');
  },
  getPackage: (id) => get().packages.find((p) => p.id === id),
  updatePackageStatus: (id, status, note) => {
    set((s) => ({
      packages: s.packages.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              statusHistory: [...p.statusHistory, { status, date: new Date().toISOString(), note }],
            }
          : p
      ),
    }));
    if (status === 'picked_up') {
      get().triggerConfetti();
      get().showToast('חבילה נאספה! 🎉');
    }
  },
  filteredPackages: () => {
    const { packages, filter } = get();
    const filtered = filter === 'all' ? packages : packages.filter((p) => p.status === filter);
    return [...filtered].sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime());
  },
  toastMessage: null,
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => set({ toastMessage: null }), 3000);
  },
  clearToast: () => set({ toastMessage: null }),
  showConfetti: false,
  triggerConfetti: () => {
    set({ showConfetti: true });
    setTimeout(() => set({ showConfetti: false }), 3000);
  },
}));

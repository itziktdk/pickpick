'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <div className="text-center text-white">
          <div className="text-5xl mb-4 animate-bounce">📦</div>
          <p className="text-lg font-bold">טוען...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

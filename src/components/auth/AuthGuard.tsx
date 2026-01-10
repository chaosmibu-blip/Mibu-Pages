'use client';
import { useAuth, useAuthHydrated } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const hydrated = useAuthHydrated();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.push(`/merchant/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, isLoggedIn, pathname, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">正在跳轉到登入頁...</div>
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { hexToHsl } from '@/lib/utils';
import { CustomCursor } from '@/components/custom-cursor';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, workshop } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  useEffect(() => {
    if (workshop) {
      const root = document.documentElement;
      if (workshop.primaryColor) root.style.setProperty('--primary', hexToHsl(workshop.primaryColor));
      if (workshop.accentColor) root.style.setProperty('--accent', hexToHsl(workshop.accentColor));
      if (workshop.sidebarBgColor) root.style.setProperty('--sidebar-background', hexToHsl(workshop.sidebarBgColor));
    }
  }, [workshop]);

  if (loading || !user) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Cargando...</p>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <CustomCursor />
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="p-3 sm:p-6 lg:p-8 max-w-[100vw] overflow-hidden">
          {children}
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}

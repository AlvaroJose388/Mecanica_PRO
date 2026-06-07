'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/logo';
import { GlobalSearch } from '../global-search';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 sm:px-6">
      {/* Botón de Hamburguesa - Visible en móvil y tablet (md:hidden) */}
      <div className="flex items-center md:hidden">
        <SidebarTrigger className="h-9 w-9 text-primary hover:bg-primary/10">
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
      </div>
      
      {/* Branding del Taller - Oculto en móviles muy pequeños para dar espacio a la búsqueda */}
      <div className="hidden xs:flex items-center">
        <Logo className="text-foreground scale-90 sm:scale-100" />
      </div>

      <div className="ml-auto flex-1 md:grow-0 flex justify-end">
        <GlobalSearch />
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Home,
  Building2,
  ListTodo,
  HeartPulse,
  Calendar,
  Wrench,
  BookOpen,
  ShoppingBag,
  Warehouse,
  Users,
  MessageSquare,
  BarChart2,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { useUser } from '@/contexts/user-context';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', label: 'Bienvenido', icon: Home, roles: ['SuperAdmin', 'TallerAdmin', 'Observer'] },
  { href: '/settings/workshop', label: 'Mi empresa', icon: Building2, roles: ['TallerAdmin'] },
  { href: '/tasks', label: 'Tareas', icon: ListTodo, roles: ['TallerAdmin', 'Observer', 'Mechanic'] },
  { href: '/crm', label: 'Cliente potencial', icon: HeartPulse, roles: ['TallerAdmin', 'Observer'] },
  { href: '/agenda', label: 'Citas', icon: Calendar, roles: ['TallerAdmin', 'Observer'] },
  { href: '/orders', label: 'Órdenes de trabajo', icon: Wrench, roles: ['TallerAdmin', 'Observer', 'Mechanic'] },
  { href: '/protocols', label: 'Protocolos', icon: BookOpen, roles: ['TallerAdmin', 'Observer', 'Mechanic'] },
  { href: '/invoices', label: 'Ventas', icon: ShoppingBag, roles: ['TallerAdmin', 'Observer'] },
  { href: '/inventory', label: 'Almacenes', icon: Warehouse, roles: ['TallerAdmin', 'Observer'] },
  { href: '/clients', label: 'Contactos', icon: Users, roles: ['TallerAdmin', 'Observer'] },
  { href: '/chat', label: 'Chats', icon: MessageSquare, roles: ['SuperAdmin', 'TallerAdmin', 'Mechanic', 'Observer'], premium: true },
  { href: '/analytics', label: 'Informes', icon: BarChart2, roles: ['SuperAdmin', 'TallerAdmin', 'Observer'], premium: true },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
  };
  
  const accessibleMenuItems = menuItems.filter(item => {
    if (!user) return false;
    if (!item.roles.includes(user.role)) return false;
    return true;
  });

  return (
    <Sidebar className="border-r-2 border-slate-100">
      <SidebarHeader className="p-6">
        <Logo className="scale-110" />
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu className="gap-1.5">
          {accessibleMenuItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <SidebarMenuItem key={item.label}>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-11 px-4 rounded-xl transition-all font-bold text-sm border-l-4 border-transparent",
                    isActive 
                        ? "bg-slate-900 text-white shadow-xl border-primary" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "")} />
                    <span className="tracking-tight">{item.label}</span>
                    {item.premium && <Sparkles className="ml-auto h-3 w-3 text-yellow-400" />}
                  </Link>
                </Button>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-2">
         <div className="h-px bg-slate-100 mx-2 mb-2" />
         <Button asChild variant="ghost" className="w-full justify-start h-11 px-4 rounded-xl text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-900">
            <Link href="/settings">
                <Settings className="mr-3 h-5 w-5" />
                <span className="text-sm">Ajustes</span>
            </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start h-11 px-4 rounded-xl text-red-500 font-bold hover:bg-red-50 hover:text-red-600 transition-colors" onClick={handleLogout}>
          <LogOut className="mr-3 h-5 w-5" />
          <span className="text-sm">Cerrar Sesión</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}


'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/contexts/user-context';
import { getInitials } from '@/lib/utils/get-initials';
import { LogOut, User as UserIcon, Settings, Building2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function UserNav() {
  const { user, workshop, logout } = useUser();

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-background shadow-sm hover:ring-primary/20 transition-all overflow-hidden p-0">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage src={user.avatarUrl} alt={`@${user.name}`} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 rounded-2xl shadow-2xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-3 p-2">
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl border overflow-hidden flex-shrink-0 bg-muted shadow-inner">
                    {workshop?.logoUrl ? (
                        <img src={workshop.logoUrl} alt={workshop.name} className="h-full w-full object-contain p-1.5" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/5">
                            <Building2 className="h-6 w-6 text-primary/40" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-bold leading-none truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
                </div>
            </div>
            <div className="bg-slate-900 text-white rounded-lg p-2 text-[9px] uppercase tracking-widest font-black flex items-center justify-center gap-2">
                <ShieldCheck className="h-3 w-3 text-primary" />
                {workshop?.name || 'MecanicaPro'} • {user.role}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem asChild className="rounded-xl h-10">
            <Link href="/settings">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </Link>
          </DropdownMenuItem>
           <DropdownMenuItem asChild className="rounded-xl h-10">
            <Link href="/settings/workshop">
              <Settings className="mr-2 h-4 w-4" />
              <span>Ajustes del Taller</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-xl h-10 m-1">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

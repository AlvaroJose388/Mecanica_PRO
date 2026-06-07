'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUser } from '@/contexts/user-context';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Building2, User as UserIcon, Bell, Loader2, Wrench, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { updateUser } from '@/app/actions/users';
import type { User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const { user, workshop, login, updateCurrentUser } = useUser();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const canManageWorkshop = user?.role === 'TallerAdmin' || user?.role === 'SuperAdmin';

  const handleProfileSave = async () => {
    if (!user) return;
    setIsSaving(true);
    
    const updatedUserData: Partial<User> = { name, email };
    if (password) {
        updatedUserData.password = password;
    }

    try {
        const updatedUser = await updateUser(user.id, updatedUserData);
        
        if (password) {
            const success = await login(updatedUser.email, password);
            if (!success) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Hubo un problema al re-iniciar sesión. Inicia sesión manualmente.',
                });
                return;
            }
        } else {
            updateCurrentUser(updatedUser);
        }

        toast({
            title: 'Perfil actualizado',
            description: 'Tus cambios han sido guardados.',
        });
        setPassword('');
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudieron guardar los cambios en el perfil.',
        });
    } finally {
        setIsSaving(false);
    }
  }

  const handleNotificationSave = () => {
    toast({
        title: 'Ajustes guardados',
        description: `Tus cambios en "Notificaciones" han sido guardados.`,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ajustes de Perfil"
        description="Gestiona tu cuenta personal y las preferencias de tu taller."
        icon={Settings}
      />
      
      <div className="grid gap-6">
        {workshop && (
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{workshop.name}</CardTitle>
                                <CardDescription>Información del Taller</CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                {workshop.type || 'Automotriz'}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-muted-foreground block">Suscripción</span>
                            <span className="font-medium text-base">{workshop.subscription}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-muted-foreground block">Sucursales</span>
                            <span className="font-medium text-base">{workshop.branches.length} activas</span>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Wrench className="h-4 w-4" />
                            <span className="font-semibold text-xs uppercase tracking-wider">Especialidades</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="font-normal">Mecánica General</Badge>
                            <Badge variant="secondary" className="font-normal">Diagnóstico</Badge>
                            <Badge variant="secondary" className="font-normal">Electricidad</Badge>
                            <Badge variant="secondary" className="font-normal">Pintura</Badge>
                        </div>
                    </div>
                </CardContent>
                {canManageWorkshop && (
                    <CardFooter className="border-t pt-4">
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/settings/workshop">
                                Gestionar Identidad del Taller
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                )}
            </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Información Personal</CardTitle>
            </div>
            <CardDescription>
              Actualiza tu nombre, correo y contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="password">Cambiar Contraseña</Label>
              <Input id="password" type="password" placeholder="Dejar en blanco para no cambiar" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleProfileSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Notificaciones</CardTitle>
            </div>
            <CardDescription>
              Controla cómo quieres recibir las alertas del taller.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-base">Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">
                        Recibe actualizaciones sobre nuevas órdenes y mensajes.
                    </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="push-notifications" className="text-base">Notificaciones Push</Label>
                    <p className="text-sm text-muted-foreground">
                        Recibe notificaciones en tiempo real en tu navegador.
                    </p>
                </div>
                <Switch id="push-notifications" />
            </div>
          </CardContent>
           <CardFooter>
            <Button onClick={handleNotificationSave}>Guardar Preferencias</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function Separator() {
    return <div className="h-px bg-border w-full" />
}

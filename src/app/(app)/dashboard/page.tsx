
'use client';

import { useUser } from '@/contexts/user-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Wrench, 
    Loader2, 
    Users, 
    DollarSign, 
    PlusCircle, 
    Building2, 
    ShieldCheck, 
    Activity, 
    ArrowUpRight, 
    Globe, 
    UserCog,
    Edit,
    Search,
    LayoutDashboard
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getDashboardData, getWorkshops, createWorkshop, updateWorkshop, getSuperAdminDashboardData } from '@/app/actions/workshops';
import { getAllUsers } from '@/app/actions/users';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Workshop, User, Role } from '@/lib/types';
import { getInitials } from '@/lib/utils/get-initials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function WorkshopForm({ 
    workshop, 
    users,
    onSave, 
    onCancel, 
    isSaving 
}: { 
    workshop: Partial<Workshop> | null, 
    users: User[],
    onSave: (data: Partial<Workshop>) => void, 
    onCancel: () => void, 
    isSaving: boolean 
}) {
    const [formData, setFormData] = useState<Partial<Workshop>>(workshop || {
        name: '',
        subscription: 'Basic',
        ownerId: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const admins = users.filter(u => u.role === 'TallerAdmin' || u.role === 'SuperAdmin');

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="w-name">Nombre del Taller</Label>
                    <Input 
                        id="w-name" 
                        value={formData.name || ''} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Ej: Mecánica Pro Norte"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="w-owner">Dueño / Administrador Principal</Label>
                    <Select value={formData.ownerId} onValueChange={val => setFormData({...formData, ownerId: val})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar responsable..." />
                        </SelectTrigger>
                        <SelectContent>
                            {admins.map(u => (
                                <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="w-sub">Plan de Suscripción</Label>
                    <Select value={formData.subscription} onValueChange={val => setFormData({...formData, subscription: val as any})}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {workshop ? 'Actualizar Taller' : 'Crear Taller'}
                </Button>
            </DialogFooter>
        </form>
    );
}

function SuperAdminDashboard() {
    const { toast } = useToast();
    const [stats, setStats] = useState<any>(null);
    const [workshops, setWorkshopsList] = useState<Workshop[]>([]);
    const [systemUsers, setSystemUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [statsData, workshopsData, usersData] = await Promise.all([
                getSuperAdminDashboardData(),
                getWorkshops(),
                getAllUsers()
            ]);
            setStats(statsData);
            setWorkshopsList(workshopsData);
            setSystemUsers(usersData);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron sincronizar los datos globales.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSaveWorkshop = async (data: Partial<Workshop>) => {
        setIsSaving(true);
        try {
            if (editingWorkshop) {
                await updateWorkshop(editingWorkshop.id, data);
                toast({ title: 'Taller Actualizado' });
            } else {
                await createWorkshop(data, data.ownerId || '');
                toast({ title: 'Taller Creado' });
            }
            setIsAddDialogOpen(false);
            setEditingWorkshop(null);
            await loadData();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                icon={Globe}
                title="Consola de Mando Global"
                description="Gestión centralizada de la red de talleres certificados y usuarios del ecosistema."
            >
                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if(!open) setEditingWorkshop(null); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-950 text-white hover:bg-primary shadow-xl rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Añadir Taller
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2.5rem] p-8">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">{editingWorkshop ? 'Modificar Taller' : 'Crear Nuevo Taller'}</DialogTitle>
                            <DialogDescription>Configure los parámetros técnicos del nuevo centro de servicio.</DialogDescription>
                        </DialogHeader>
                        <WorkshopForm 
                            workshop={editingWorkshop} 
                            users={systemUsers}
                            onSave={handleSaveWorkshop} 
                            onCancel={() => setIsAddDialogOpen(false)} 
                            isSaving={isSaving} 
                        />
                    </DialogContent>
                </Dialog>
            </PageHeader>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
                <Card className="hover-lift border-none shadow-xl rounded-[2rem]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Talleres Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-950">{stats?.totalWorkshops || 0}</div>
                        <p className="text-[9px] text-emerald-600 font-bold uppercase mt-1">Nodos Activos</p>
                    </CardContent>
                </Card>
                <Card className="hover-lift border-none shadow-xl rounded-[2rem]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Directorio Global</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-950">{stats?.totalUsers || 0}</div>
                        <p className="text-[9px] text-primary font-bold uppercase mt-1">Usuarios Registrados</p>
                    </CardContent>
                </Card>
                <Card className="hover-lift border-none shadow-xl rounded-[2rem]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Suscripciones Pro</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-950">{stats?.premiumSubscriptions || 0}</div>
                        <p className="text-[9px] text-orange-600 font-bold uppercase mt-1">Cuentas Premium</p>
                    </CardContent>
                </Card>
                <Card className="hover-lift border-none shadow-xl rounded-[2rem] bg-slate-950 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Ingresos SaaS Est.</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">${new Intl.NumberFormat('es-CO').format(stats?.totalMonthlyRevenue || 0)}</div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Recurrencia Estimada</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50 border-b p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter">Talleres Certificados</CardTitle>
                                <CardDescription className="font-bold">Red de centros de servicio bajo supervisión.</CardDescription>
                            </div>
                            <Building2 className="h-8 w-8 text-primary opacity-20" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="px-8 font-black text-[10px] uppercase">Nombre del Taller</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase">Plan</TableHead>
                                    <TableHead className="text-right px-8 font-black text-[10px] uppercase">Acción</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {workshops.map(w => (
                                    <TableRow key={w.id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell className="px-8 font-black text-slate-900 uppercase text-xs">{w.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={w.subscription === 'Premium' ? 'default' : 'outline'} className="text-[9px] font-black uppercase">
                                                {w.subscription}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right px-8">
                                            <Button variant="ghost" size="icon" onClick={() => { setEditingWorkshop(w); setIsAddDialogOpen(true); }}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50 border-b p-8">
                         <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter">Directorio de Usuarios</CardTitle>
                                <CardDescription className="font-bold">Vista global de roles y asignaciones.</CardDescription>
                            </div>
                            <UserCog className="h-8 w-8 text-primary opacity-20" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                         <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="px-8 font-black text-[10px] uppercase">Usuario</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase">Rol</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase">Taller</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {systemUsers.slice(0, 10).map(u => {
                                    const userWorkshop = workshops.find(w => w.id === u.workshopId);
                                    return (
                                        <TableRow key={u.id} className="hover:bg-slate-50 transition-colors">
                                            <TableCell className="px-8 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 border shadow-sm shrink-0">
                                                        <AvatarImage src={u.avatarUrl} alt={u.name} />
                                                        <AvatarFallback className="text-[9px] font-black">{getInitials(u.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="overflow-hidden">
                                                        <p className="font-black text-[11px] text-slate-900 uppercase truncate leading-none">{u.name}</p>
                                                        <p className="text-[9px] text-slate-400 font-bold truncate mt-1">{u.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-[8px] font-black uppercase tracking-widest">{u.role}</Badge>
                                            </TableCell>
                                            <TableCell className="text-[10px] font-bold text-slate-500 uppercase">
                                                {userWorkshop?.name || 'S/T'}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="p-4 bg-slate-50 border-t flex justify-center">
                        <Button variant="link" asChild className="text-[10px] font-black uppercase tracking-widest text-primary">
                            <a href="/users">Ver todos los usuarios <ArrowUpRight className="ml-2 h-3 w-3" /></a>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

function DefaultDashboard() {
    const { user, workshop } = useUser();
    const [data, setData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
    
    useEffect(() => {
        async function loadDashboardData() {
            if (user?.workshopId) {
                setIsLoading(true);
                try {
                    const branchFilter = selectedBranchId === 'all' ? undefined : selectedBranchId;
                    const dashboardData = await getDashboardData(user.workshopId, branchFilter);
                    setData(dashboardData);
                } catch (error) {
                    console.error("Failed to load dashboard data", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        }
        loadDashboardData();
    }, [user?.workshopId, selectedBranchId]);

    if (isLoading && !data) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        )
    }
    
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                icon={LayoutDashboard}
                title={user?.role === 'Mecánico' ? 'Centro de Operaciones' : `Panel de Dirección Técnica`}
                description="Monitoreo en tiempo real del rendimiento operativo y financiero certificado."
            >
                <div className="flex items-center gap-3">
                    {workshop && workshop.branches.length > 1 && (
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border-2 border-slate-100 shadow-lg">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                                <SelectTrigger className="border-none shadow-none h-8 text-[10px] font-black uppercase tracking-widest min-w-[150px] bg-transparent">
                                    <SelectValue placeholder="Seleccionar Sede" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las Sedes</SelectItem>
                                    {workshop.branches.map(b => (
                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="hidden sm:flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border-2 border-slate-100 shadow-xl">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">Sistema Certificado v2.4</span>
                    </div>
                </div>
            </PageHeader>
            
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="hover-lift border-none shadow-xl rounded-[2rem]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ingresos Mensuales</CardTitle>
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-950 truncate tracking-tighter">
                            ${new Intl.NumberFormat('es-CO').format(data?.monthlyRevenue?.total || 0)}
                        </div>
                        <p className="text-[9px] text-emerald-600 font-black uppercase mt-2">Rendimiento Actual</p>
                    </CardContent>
                </Card>

                <Card className="hover-lift border-none shadow-xl rounded-[2rem]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Órdenes Activas</CardTitle>
                        <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                            <Activity className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-950">{data?.activeOrders?.count || 0}</div>
                        <p className="text-[10px] text-slate-500 mt-2 font-black uppercase">En ejecución técnica</p>
                    </CardContent>
                </Card>

                <Card className="hover-lift border-none shadow-xl rounded-[2rem]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Agenda Hoy</CardTitle>
                        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                            <Activity className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-950">{data?.appointmentsToday?.count || 0}</div>
                        <p className="text-[10px] text-slate-500 mt-2 font-black uppercase">Citas programadas</p>
                    </CardContent>
                </Card>

                 <Card className="hover-lift border-none shadow-xl rounded-[2rem]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Base Clientes</CardTitle>
                        <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600">
                            <Users className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-950">{data?.totalClients?.count || 0}</div>
                        <p className="text-[10px] text-slate-500 mt-2 font-black uppercase">Fidelización Activa</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 border-none shadow-2xl bg-slate-950 text-white overflow-hidden rounded-[2.5rem]">
                    <CardHeader className="p-10 pb-6">
                        <CardTitle className="text-3xl font-black uppercase tracking-tighter italic">Gestión <br/>Rápida.</CardTitle>
                        <CardDescription className="text-slate-400 text-sm font-bold uppercase mt-2">Acciones operativas directas.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 pt-0 space-y-6">
                        <Button asChild className="w-full text-[11px] font-black uppercase tracking-widest h-16 shadow-2xl bg-white text-slate-950 hover:bg-primary hover:text-white border-none rounded-2xl">
                            <a href="/orders" className="flex items-center justify-center gap-3">
                                Gestionar Órdenes
                                <ArrowUpRight className="h-5 w-5" />
                            </a>
                        </Button>
                        <Button asChild variant="outline" className="w-full text-[11px] font-black uppercase tracking-widest h-16 border-2 border-white/10 text-white hover:bg-white/5 rounded-2xl">
                            <a href="/inventory" className="flex items-center justify-center gap-3">
                                Almacén de Partes
                                <ArrowUpRight className="h-5 w-5" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="p-10 border-b bg-slate-50">
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter text-slate-950">Módulos de Ingeniería</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                         <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y border-b">
                            <a href="/crm" className="p-8 hover:bg-slate-50 transition-all group">
                                <Activity className="h-8 w-8 text-emerald-600 mb-4 group-hover:scale-110 transition-transform" />
                                <h4 className="font-black uppercase tracking-tight text-slate-950 mb-1">CRM Predictivo</h4>
                                <p className="text-xs text-slate-500 font-bold uppercase">Fidelización inteligente.</p>
                            </a>
                            <a href="/protocols" className="p-8 hover:bg-slate-50 transition-all group">
                                <Wrench className="h-8 w-8 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                                <h4 className="font-black uppercase tracking-tight text-slate-950 mb-1">Biblioteca</h4>
                                <p className="text-xs text-slate-500 font-bold uppercase">Protocolos OEM.</p>
                            </a>
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'Mecánico') {
      router.replace('/orders');
    }
  }, [user, router]);

  if (!user) return <div className="flex justify-center items-center h-64"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  if (user.role === 'SuperAdmin') {
    return <SuperAdminDashboard />;
  }

  return <DefaultDashboard />;
}

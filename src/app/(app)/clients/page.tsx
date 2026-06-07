'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUser } from '@/contexts/user-context';
import type { Client, Vehicle, Order } from '@/lib/types';
import { PlusCircle, Trash2, Loader2, Edit, Car, History, Wrench, Users, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { createClient, updateClient, deleteClient, getClientsForWorkshop } from '@/app/actions/clients';
import { createVehicle, getVehiclesForClient, updateVehicle, deleteVehicle } from '@/app/actions/vehicles';
import { getOrdersByClientId } from '@/app/actions/orders';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

function ClientForm({
  client,
  onSave,
  onCancel,
  isSaving,
}: {
  client: Partial<Client>;
  onSave: (client: Partial<Client>) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(client);

  useEffect(() => {
    setFormData(client);
  }, [client]);

  const handleChange = (field: keyof Client, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData?.name) {
      toast({ variant: 'destructive', title: 'Error', description: 'El nombre es obligatorio.' });
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Nombre</Label>
          <Input id="name" value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} className="col-span-3 border-2 border-slate-200" required disabled={isSaving} />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">Email</Label>
          <Input id="email" type="email" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="col-span-3 border-2 border-slate-200" disabled={isSaving} />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone" className="text-right">Teléfono</Label>
          <Input id="phone" value={formData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="col-span-3 border-2 border-slate-200" disabled={isSaving} />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="address" className="text-right">Dirección</Label>
          <Input id="address" value={formData.address || ''} onChange={(e) => handleChange('address', e.target.value)} className="col-span-3 border-2 border-slate-200" disabled={isSaving} />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving} className="font-bold border border-slate-200">Cancelar</Button>
        <Button type="submit" disabled={isSaving} className="font-bold bg-slate-950 text-white hover:bg-primary">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Cliente
        </Button>
      </DialogFooter>
    </form>
  );
}

function HistoryManager({ client, isOpen, onOpenChange }: { client: Client | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchHistory = useCallback(async () => {
        if (!client) return;
        setIsLoading(true);
        try {
            const data = await getOrdersByClientId(client.id);
            setOrders(data);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el historial." });
        } finally {
            setIsLoading(false);
        }
    }, [client, toast]);

    useEffect(() => {
        if (isOpen) fetchHistory();
    }, [isOpen, fetchHistory]);

    const getStatusBadge = (status: string) => {
        const variants: any = {
            'Completed': 'default',
            'InProgress': 'secondary',
            'Pending': 'outline',
            'Cancelled': 'destructive',
            'Ready': 'default'
        };
        const labels: any = {
            'Pending': 'Pendiente',
            'InProgress': 'En Progreso',
            'Ready': 'Listo',
            'Completed': 'Completado',
            'Cancelled': 'Cancelado'
        };
        return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="font-headline font-black uppercase text-2xl tracking-tighter">Historial de Servicios: {client?.name}</DialogTitle>
                    <DialogDescription className="font-bold text-slate-500">Listado de todos los trabajos realizados a este cliente.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
                    ) : orders.length > 0 ? (
                        <div className="border-2 border-slate-100 rounded-2xl overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="font-black text-[10px] uppercase">Fecha</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase">Orden #</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase">Vehículo</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase">Estado</TableHead>
                                        <TableHead className="text-right font-black text-[10px] uppercase">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map(order => (
                                        <TableRow key={order.id} className="hover:bg-slate-50 transition-colors">
                                            <TableCell className="font-bold text-xs">
                                                {format(new Date(order.createdAt), "d MMM, yyyy", { locale: es })}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs font-black text-primary">{order.orderNumber}</TableCell>
                                            <TableCell className="font-bold text-xs">{order.vehicle ? `${order.vehicle.plate}` : 'N/A'}</TableCell>
                                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                                            <TableCell className="text-right font-black text-xs">
                                                ${new Intl.NumberFormat('es-CO').format(order.total)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-400 font-bold uppercase text-xs italic bg-slate-50 rounded-2xl border-2 border-dashed">
                            Este cliente no tiene órdenes registradas todavía.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function VehicleManager({ client, isOpen, onOpenChange }: { client: Client | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(null);

    const fetchVehicles = useCallback(async () => {
        if (!client) return;
        setIsLoading(true);
        try {
            const data = await getVehiclesForClient(client.id);
            setVehicles(data);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los vehículos." });
        } finally {
            setIsLoading(false);
        }
    }, [client, toast]);

    useEffect(() => {
        if (isOpen) {
            fetchVehicles();
        }
    }, [isOpen, fetchVehicles]);
    
    const handleSaveVehicle = async (vehicleData: Partial<Vehicle>) => {
        if (!client) return;
        setIsSaving(true);
        try {
            if (vehicleData.id) {
                await updateVehicle(vehicleData.id, vehicleData);
                toast({ title: "Vehículo actualizado" });
            } else {
                await createVehicle(client.id, vehicleData);
                toast({ title: "Vehículo añadido" });
            }
            setEditingVehicle(null);
            await fetchVehicles();
        } catch (e) {
            toast({ variant: "destructive", title: "Error", description: (e as Error).message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteVehicle = async (vehicleId: string) => {
        await deleteVehicle(vehicleId);
        toast({ title: 'Vehículo eliminado' });
        await fetchVehicles();
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="font-headline font-black uppercase text-2xl tracking-tighter">Vehículos de {client?.name}</DialogTitle>
                    <DialogDescription className="font-bold text-slate-500">Gestiona los vehículos asociados a este cliente.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    <div className="space-y-4">
                        <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Añadir/Editar Vehículo</h3>
                         <VehicleForm 
                            vehicle={editingVehicle || {}}
                            onSave={handleSaveVehicle}
                            onCancel={() => setEditingVehicle(null)}
                            isSaving={isSaving}
                        />
                    </div>
                     <div className="space-y-4">
                         <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Vehículos Registrados</h3>
                         {isLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div> : (
                            vehicles.length > 0 ? (
                                 <div className="border-2 border-slate-100 rounded-xl overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow>
                                                <TableHead className="font-black text-[9px] uppercase">Placa</TableHead>
                                                <TableHead className="font-black text-[9px] uppercase">Marca/Modelo</TableHead>
                                                <TableHead className="text-right"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {vehicles.map(v => (
                                                <TableRow key={v.id} className="hover:bg-slate-50 transition-colors">
                                                    <TableCell className="font-mono font-black text-xs text-primary">{v.plate}</TableCell>
                                                    <TableCell className="font-bold text-xs">{v.brand} {v.model}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setEditingVehicle(v)}><Edit className="h-3.5 w-3.5"/></Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5"/></Button></AlertDialogTrigger>
                                                                <AlertDialogContent className="rounded-[2rem]">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle className="font-black uppercase tracking-tighter">¿Eliminar vehículo?</AlertDialogTitle>
                                                                        <AlertDialogDescription className="font-bold text-slate-500">Esta acción eliminará el vehículo permanentemente del sistema.</AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel className="font-bold border-2 border-slate-200 rounded-xl">Cancelar</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => handleDeleteVehicle(v.id)} className="bg-destructive text-white font-bold rounded-xl">Eliminar</AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                 </div>
                            ) : <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-[10px] font-black uppercase text-slate-400">Sin vehículos</div>
                         )}
                     </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function VehicleForm({ vehicle, onSave, onCancel, isSaving }: { vehicle: Partial<Vehicle>, onSave: (v: Partial<Vehicle>) => void, onCancel: () => void, isSaving: boolean }) {
    const [formData, setFormData] = useState(vehicle);
    
    useEffect(() => {
        setFormData(vehicle);
    }, [vehicle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({ ...prev, [id]: type === 'number' ? (value ? parseInt(value) : undefined) : value }));
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="plate" className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Placa</Label>
                <Input id="plate" value={formData.plate || ''} onChange={handleChange} className="border-2 border-slate-200 rounded-xl h-11 font-bold" required disabled={isSaving} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="brand" className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Marca</Label>
                    <Input id="brand" value={formData.brand || ''} onChange={handleChange} className="border-2 border-slate-200 rounded-xl h-11 font-bold" disabled={isSaving} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="model" className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Modelo</Label>
                    <Input id="model" value={formData.model || ''} onChange={handleChange} className="border-2 border-slate-200 rounded-xl h-11 font-bold" disabled={isSaving} />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="year" className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Año</Label>
                    <Input id="year" type="number" value={formData.year || ''} onChange={handleChange} className="border-2 border-slate-200 rounded-xl h-11 font-bold" disabled={isSaving} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="color" className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Color</Label>
                    <Input id="color" value={formData.color || ''} onChange={handleChange} className="border-2 border-slate-200 rounded-xl h-11 font-bold" disabled={isSaving} />
                </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
                {formData.id && <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving} className="font-bold border border-slate-200">Cancelar</Button>}
                <Button type="submit" disabled={isSaving} className="bg-slate-950 text-white hover:bg-primary font-bold shadow-lg">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {formData.id ? 'Actualizar' : 'Añadir'}
                </Button>
            </div>
        </form>
    );
}

export default function ClientsPage() {
  const { user, workshop } = useUser();
  const { toast } = useToast();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isClientFormOpen, setClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [managingVehiclesFor, setManagingVehiclesFor] = useState<Client | null>(null);
  const [viewingHistoryFor, setViewingHistoryFor] = useState<Client | null>(null);

  const fetchClients = useCallback(async () => {
    if (!user?.workshopId) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
        const clientsData = await getClientsForWorkshop(user.workshopId);
        setClients(clientsData);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los clientes.' });
    } finally {
        setIsLoading(false);
    }
  }, [user?.workshopId, toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);


  const handleSaveClient = async (clientData: Partial<Client>) => {
    if (!user?.workshopId || !clientData.name) return;

    setIsSaving(true);
    try {
        if (clientData.id) {
          await updateClient(clientData.id, clientData);
          toast({ title: 'Cliente actualizado', description: `El cliente ha sido actualizado.` });
        } else {
          await createClient({ ...clientData, workshopId: user.workshopId });
          toast({ title: 'Cliente creado', description: `El nuevo cliente ha sido creado.` });
        }
        await fetchClients();
        closeClientForm();
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error al guardar', description: (error as Error).message });
    } finally {
        setIsSaving(false);
    }
  };

  const openClientFormForNew = () => {
    setEditingClient({});
    setClientFormOpen(true);
  }

  const openClientFormForEdit = (client: Client) => {
    setEditingClient(client);
    setClientFormOpen(true);
  }

  const handleDeleteClient = async (clientId: string) => {
    try {
        await deleteClient(clientId);
        await fetchClients();
        toast({ title: 'Cliente eliminado', description: 'El cliente ha sido eliminado de la lista.' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error al eliminar', description: (error as Error).message });
    }
  }

  const closeClientForm = () => {
    setClientFormOpen(false);
    setEditingClient(null);
  }

  const filteredClients = useMemo(() => {
      if (!searchTerm) return clients;
      const term = searchTerm.toLowerCase();
      return clients.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.email.toLowerCase().includes(term) || 
        c.phone.includes(term)
      );
  }, [clients, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Contactos y Clientes"
        description="Gestiona los clientes corporativos y sus vehículos certificados."
        logoUrl={workshop?.logoUrl}
        icon={Users}
      >
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar contacto..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11 pl-10 rounded-xl border-2 border-slate-200 bg-white shadow-sm font-bold text-xs uppercase"
                />
            </div>
            <Button onClick={openClientFormForNew} className="bg-slate-950 text-white hover:bg-primary shadow-xl rounded-xl h-11 px-6 font-black uppercase text-[10px] tracking-widest transition-all">
                <PlusCircle className="mr-2 h-5 w-5" />
                Añadir Cliente
            </Button>
        </div>
      </PageHeader>

      <Dialog open={isClientFormOpen} onOpenChange={(isOpen) => { if(!isOpen) closeClientForm() }}>
          <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] p-8 border-none shadow-2xl">
              <DialogHeader className="mb-6">
                  <DialogTitle className="font-headline font-black uppercase text-2xl tracking-tighter">{editingClient?.id ? 'Editar Ficha' : 'Registro de Cliente'}</DialogTitle>
                  <DialogDescription className="font-bold text-slate-500">
                      {editingClient?.id ? 'Actualiza los detalles técnicos del contacto.' : 'Rellena los detalles para el nuevo nodo de cliente.'}
                  </DialogDescription>
              </DialogHeader>
              {editingClient !== null && (
                  <ClientForm 
                      client={editingClient}
                      onSave={handleSaveClient} 
                      onCancel={closeClientForm}
                      isSaving={isSaving}
                  />
              )}
          </DialogContent>
      </Dialog>
      
      {managingVehiclesFor && (
        <VehicleManager client={managingVehiclesFor} isOpen={!!managingVehiclesFor} onOpenChange={() => setManagingVehiclesFor(null)} />
      )}

      {viewingHistoryFor && (
        <HistoryManager client={viewingHistoryFor} isOpen={!!viewingHistoryFor} onOpenChange={() => setViewingHistoryFor(null)} />
      )}

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/80 border-b-2 border-slate-100 py-8 px-10">
          <CardTitle className="font-headline font-black uppercase text-2xl tracking-tighter">Directorio de Ingeniería</CardTitle>
          <CardDescription className="font-bold text-slate-500">Listado consolidado de clientes bajo gestión técnica.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-40"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-b">
                <TableHead className="font-black text-[10px] uppercase px-10 h-14">Nombre del Titular</TableHead>
                <TableHead className="font-black text-[10px] uppercase h-14">Email Corporativo</TableHead>
                <TableHead className="font-black text-[10px] uppercase h-14">Teléfono</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase px-10 h-14">Gestión Operativa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-slate-50 transition-colors group">
                  <TableCell className="font-black text-sm px-10 text-slate-900 uppercase tracking-tight">{client.name}</TableCell>
                  <TableCell className="font-bold text-xs text-slate-500">{client.email}</TableCell>
                  <TableCell className="font-mono font-black text-xs text-primary">{client.phone}</TableCell>
                  <TableCell className="text-right space-x-2 px-10">
                     <Button variant="secondary" size="sm" onClick={() => setViewingHistoryFor(client)} className="rounded-xl h-9 bg-slate-100 text-slate-900 border border-slate-200 font-bold uppercase text-[9px] tracking-widest hover:bg-slate-200 shadow-sm">
                        <History className="mr-2 h-3.5 w-3.5"/>
                        Historial
                     </Button>
                     <Button variant="secondary" size="sm" onClick={() => setManagingVehiclesFor(client)} className="rounded-xl h-9 bg-slate-100 text-slate-900 border border-slate-200 font-bold uppercase text-[9px] tracking-widest hover:bg-slate-200 shadow-sm">
                        <Car className="mr-2 h-3.5 w-3.5"/>
                        Vehículos
                     </Button>
                     <Button variant="ghost" size="icon" onClick={() => openClientFormForEdit(client)} className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary">
                        <Edit className="h-4 w-4" />
                     </Button>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2.5rem]">
                            <AlertDialogHeader>
                            <AlertDialogTitle className="font-black uppercase tracking-tighter">¿Está absolutamente seguro?</AlertDialogTitle>
                            <AlertDialogDescription className="font-bold text-slate-500">
                                Esta acción purgará al cliente y todos sus vehículos del sistema de trazabilidad. No se puede deshacer.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel className="font-bold border-2 border-slate-200 rounded-xl">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteClient(client.id)} className="bg-destructive text-white font-bold rounded-xl">Eliminar Permanentemente</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
           {(!isLoading && filteredClients.length === 0) && (
            <div className="text-center py-32 text-slate-300 font-black uppercase tracking-[0.2em] italic bg-slate-50 mx-10 my-10 rounded-[2rem] border-2 border-dashed border-slate-100">
                {searchTerm ? 'No se encontraron contactos para la búsqueda' : 'No tienes clientes registrados en el nodo técnico'}
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

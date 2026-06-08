'use client';
import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/user-context';
import { 
  PlusCircle, 
  Loader2, 
  Wrench, 
  FileText, 
  Check, 
  Play, 
  Trash2, 
  AlertCircle, 
  Plus, 
  Filter, 
  Settings, 
  Mail,
  MoreVertical,
  Car,
  Search,
  Send
} from 'lucide-react';
import type { Order, OrderStatus, Client, User, InventoryItem, Invoice, Vehicle } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getFullOrdersForWorkshop, createOrder, updateOrderStatus, assignMechanicToOrder } from '@/app/actions/orders';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getClientsForWorkshop } from '@/app/actions/clients';
import { getInventoryForWorkshop } from '@/app/actions/inventory';
import { getVehiclesForClient } from '@/app/actions/vehicles';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { createInvoice } from '@/app/actions/invoices';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type FullOrder = Order & { client: Client, assignedMechanic?: User, invoice?: Invoice | null, vehicle?: Vehicle | null };

type OrderFormData = {
  clientId: string;
  vehicleId?: string;
  services: { name: string; price: number }[];
  parts: { inventoryItemId: string; quantity: number; price: number; name: string }[];
}

const STATUS_RANK: Record<OrderStatus, number> = {
    'Pending': 0,
    'InProgress': 1,
    'Ready': 2,
    'Completed': 3,
    'Cancelled': 4,
};

function OrderForm({ 
    formData,
    setFormData,
    onSave,
    onCancel, 
    workshopId 
}: { 
    formData: OrderFormData,
    setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>,
    onSave: () => void, 
    onCancel: () => void, 
    workshopId: string 
}) {
    const { toast } = useToast();
    const [clients, setClients] = useState<Client[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
    
    const [currentServiceName, setCurrentServiceName] = useState('');
    const [currentServicePrice, setCurrentServicePrice] = useState('');
    const [currentPartId, setCurrentPartId] = useState('');
    const [currentPartQuantity, setCurrentPartQuantity] = useState('1');


    useEffect(() => {
        async function loadData() {
            if (!workshopId) return;
            const [clientsData, inventoryData] = await Promise.all([
                getClientsForWorkshop(workshopId),
                getInventoryForWorkshop(workshopId)
            ]);
            setClients(clientsData);
            setInventory(inventoryData);
        }
        loadData();
    }, [workshopId]);

    useEffect(() => {
        const loadVehicles = async () => {
            if (formData.clientId) {
                setIsLoadingVehicles(true);
                setVehicles([]);
                const clientVehicles = await getVehiclesForClient(formData.clientId);
                setVehicles(clientVehicles);
                setIsLoadingVehicles(false);
            } else {
                setVehicles([]);
            }
        }
        loadVehicles();
    }, [formData.clientId]);

    const handleAddService = () => {
        const price = parseFloat(currentServicePrice);
        if (currentServiceName && !isNaN(price)) {
            setFormData(prev => ({...prev, services: [...prev.services, { name: currentServiceName, price }]}));
            setCurrentServiceName('');
            setCurrentServicePrice('');
        }
    }
    
    const handleAddPart = () => {
        const quantityToAdd = parseInt(currentPartQuantity);
        const partDetails = inventory.find(p => p.id === currentPartId);
        
        if (!partDetails) return;

        if (partDetails.quantity < quantityToAdd) {
            toast({ variant: 'destructive', title: 'Sin Stock', description: `Solo quedan ${partDetails.quantity} unidades.` });
            return;
        }

        if (quantityToAdd > 0) {
            setFormData(prev => ({...prev, parts: [...prev.parts, { inventoryItemId: partDetails.id, quantity: quantityToAdd, price: partDetails.price, name: partDetails.name }]}));
            setCurrentPartId('');
            setCurrentPartQuantity('1');
        }
    }

    const handleRemoveService = (index: number) => {
        setFormData(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }));
    }
    
    const handleRemovePart = (index: number) => {
        setFormData(prev => ({ ...prev, parts: prev.parts.filter((_, i) => i !== index) }));
    }

    const total = formData.services.reduce((sum, s) => sum + s.price, 0) + formData.parts.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="client" className="text-slate-900 font-bold">Cliente</Label>
                    <Select value={formData.clientId} onValueChange={(value) => setFormData(prev => ({...prev, clientId: value, vehicleId: ''}))}>
                        <SelectTrigger id="client" className="h-12 rounded-xl text-slate-950 bg-white border-2 border-slate-200 shadow-sm"><SelectValue placeholder="Seleccionar cliente..." /></SelectTrigger>
                        <SelectContent>
                            {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="vehicle" className="text-slate-900 font-bold">Vehículo</Label>
                    <Select value={formData.vehicleId} onValueChange={(value) => setFormData(prev => ({...prev, vehicleId: value}))} disabled={!formData.clientId || isLoadingVehicles}>
                        <SelectTrigger id="vehicle" className="h-12 rounded-xl text-slate-950 bg-white border-2 border-slate-200 shadow-sm">
                            <SelectValue placeholder={isLoadingVehicles ? 'Cargando vehículos...' : 'Seleccionar vehículo...'} />
                        </SelectTrigger>
                        <SelectContent>
                            {vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.plate} - {v.brand}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <Separator />

            <div className="space-y-4">
                <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Servicios Técnicos</Label>
                <div className="flex gap-2">
                    <input placeholder="Descripción" value={currentServiceName} onChange={e => setCurrentServiceName(e.target.value)} className="flex-1 h-11 rounded-xl text-slate-950 bg-white border-2 border-slate-200 shadow-sm px-4 text-sm font-bold" />
                    <input type="number" placeholder="Precio" value={currentServicePrice} onChange={e => setCurrentServicePrice(e.target.value)} className="w-32 h-11 rounded-xl text-slate-950 bg-white border-2 border-slate-200 shadow-sm px-4 text-sm font-bold" />
                    <Button type="button" onClick={handleAddService} className="h-11 px-6 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold">Añadir</Button>
                </div>
                 <div className="space-y-2">
                    {formData.services.map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl text-sm border-2 border-slate-100 shadow-sm">
                            <span className="font-bold text-slate-950">{s.name} - ${new Intl.NumberFormat('es-CO').format(s.price)}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleRemoveService(i)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))}
                </div>
            </div>

             <Separator />

             <div className="space-y-4">
                <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Repuestos</Label>
                <div className="flex gap-2">
                     <Select value={currentPartId} onValueChange={setCurrentPartId}>
                        <SelectTrigger className="h-11 rounded-xl text-slate-950 bg-white border-2 border-slate-200 shadow-sm"><SelectValue placeholder="Seleccionar parte..." /></SelectTrigger>
                        <SelectContent>
                           {inventory.map(p => (
                               <SelectItem key={p.id} value={p.id} disabled={p.quantity <= 0}>
                                   {p.name} (Stock: {p.quantity})
                               </SelectItem>
                           ))}
                        </SelectContent>
                    </Select>
                    <input type="number" placeholder="Cant." value={currentPartQuantity} onChange={e => setCurrentPartQuantity(e.target.value)} className="w-24 h-11 rounded-xl text-slate-950 bg-white border-2 border-slate-200 shadow-sm px-4 text-sm font-bold" />
                    <Button type="button" onClick={handleAddPart} className="h-11 px-6 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold">Añadir</Button>
                </div>
                 <div className="space-y-2">
                    {formData.parts.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl text-sm border-2 border-slate-100 shadow-sm">
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-950">{p.name}</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-black">{p.quantity} UD • ${new Intl.NumberFormat('es-CO').format(p.price)} C/U</span>
                            </div>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleRemovePart(i)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />
            
            <div className="flex justify-between items-center bg-primary/10 p-6 rounded-2xl border-2 border-primary/20 shadow-inner">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Presupuesto Estimado</span>
                <span className="text-3xl font-headline font-black text-primary">${new Intl.NumberFormat('es-CO').format(total)}</span>
            </div>

            <DialogFooter className="gap-3">
                <Button variant="outline" onClick={onCancel} className="rounded-xl h-12 px-8 border-2 border-slate-200 text-slate-900 font-bold hover:bg-slate-50">Cancelar</Button>
                <Button onClick={onSave} className="rounded-xl h-12 px-8 shadow-xl shadow-primary/20 bg-slate-950 text-white hover:bg-primary transition-all font-bold">Abrir Orden Técnica</Button>
            </DialogFooter>
        </div>
    )
}

function OrderDetails({ order, onUpdate, allUsers, onNavigateToInvoice }: { order: FullOrder | null, onUpdate: () => void, allUsers: User[], onNavigateToInvoice: (invoiceId: string) => void }) {
    const { user, workshop } = useUser();
    const { toast } = useToast();
    const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState<OrderStatus | undefined>(order?.status);
    const [mechanicId, setMechanicId] = useState(order?.assignedMechanicId);

    const isMechanic = user?.role === 'Mechanic';
    const mechanics = allUsers.filter(u => u.role === 'Mechanic' && u.workshopId === user?.workshopId);

    useEffect(() => {
        if (order) {
            setStatus(order.status);
            setMechanicId(order.assignedMechanicId);
        }
    }, [order]);

    const handleAutoNotify = (currentOrder: FullOrder) => {
        if (!currentOrder.client || !workshop) return;
        
        // Plantilla técnica profesional estandarizada (Sin IA)
        const vehicleDesc = currentOrder.vehicle ? `${currentOrder.vehicle.brand} ${currentOrder.vehicle.model}` : "tu vehículo";
        const serviceDesc = currentOrder.services[0]?.name || "mantenimiento técnico";
        
        const messageText = `Hola ${currentOrder.client.name}, te informamos desde ${workshop.name} que tu vehículo (${vehicleDesc}) se encuentra listo para ser recogido tras realizar el servicio de ${serviceDesc}. ¡Te esperamos en nuestro centro certificado!`;
        
        const message = encodeURIComponent(messageText);
        const whatsappUrl = `https://wa.me/${currentOrder.client.phone?.replace(/\D/g, '')}?text=${message}`;
        
        toast({
            title: '¡Vehículo Listo!',
            description: 'El protocolo de entrega ha finalizado. Notifique al cliente.',
            action: (
                <Button onClick={() => window.open(whatsappUrl, '_blank')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] h-8 px-3 rounded-lg uppercase tracking-widest shadow-lg">
                    <Send className="mr-1.5 h-3 w-3" /> Enviar WhatsApp
                </Button>
            )
        });
    };

    const handleUpdateStatus = async () => {
        if (!order || !status || !user) return;
        setIsUpdating(true);
        try {
            await updateOrderStatus(order.id, status, user.id);
            toast({ title: 'Estado actualizado' });
            
            if (status === 'Ready') {
                handleAutoNotify(order);
            }
            
            onUpdate();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error de Flujo', description: (error as Error).message });
            setStatus(order.status);
        } finally {
            setIsUpdating(false);
        }
    }

    const handleAssignMechanic = async () => {
        if (!order || !mechanicId || isMechanic || !user) return;
        setIsUpdating(true);
        try {
            await assignMechanicToOrder(order.id, mechanicId, user.id);
            toast({ title: 'Mecánico asignado' });
            onUpdate();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo asignar el mecánico.' });
        } finally {
            setIsUpdating(false);
        }
    }

    const handleCreateInvoice = async () => {
        if (!order || isMechanic) return;
        setIsCreatingInvoice(true);
        try {
            const newInvoice = await createInvoice(order.id);
            toast({ title: 'Factura Creada', description: `Se ha creado la factura ${newInvoice.invoiceNumber}`});
            onUpdate();
        } catch(error) {
            toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
        } finally {
            setIsCreatingInvoice(false);
        }
    }

    if (!order) return null;

    const canChangeStatus = !isMechanic || order.assignedMechanicId === user?.id;
    const currentRank = STATUS_RANK[order.status];

    // Opciones de estado disponibles (Solo hacia adelante o Cancelar) - Alineado con Informe
    const availableOptions = [
        { value: 'Pending', label: 'Abierta', rank: 0 },
        { value: 'InProgress', label: 'En Diagnóstico', rank: 1 },
        { value: 'Ready', label: 'En Reparación', rank: 2 },
        { value: 'Completed', label: 'Lista para Entregar', rank: 3 },
        { value: 'Cancelled', label: 'Cerrada / Anulada', rank: 4 },
    ].filter(opt => {
        if (opt.value === order.status) return true;
        return opt.rank > currentRank;
    });

    return (
        <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl h-12 bg-slate-200 p-1">
                <TabsTrigger value="info" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 font-bold">Detalles Técnicos</TabsTrigger>
                <TabsTrigger value="audit" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 font-bold flex items-center gap-2">Auditoría</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white border-2 border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Cliente</p>
                        <p className="font-black text-sm text-slate-950">{order.client.name}</p>
                    </div>
                    {order.vehicle && (
                        <div className="p-4 rounded-xl bg-white border-2 border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Vehículo</p>
                            <p className="font-black text-sm text-slate-950">{order.vehicle.plate} • {order.vehicle.brand}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Servicios Técnicos</h4>
                        <div className="space-y-2">
                            {order.services.map(s => (
                                <div key={s.name} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-slate-900 font-bold">{s.name}</span>
                                    <span className="font-mono font-black text-slate-950">${new Intl.NumberFormat('es-CO').format(s.price)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Repuestos / Consumibles</h4>
                        <div className="space-y-2">
                            {order.parts.length > 0 ? order.parts.map(p => (
                                <div key={p.inventoryItemId} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-slate-900 font-bold">{p.name} (x{p.quantity})</span>
                                    <span className="font-mono font-black text-slate-950">${new Intl.NumberFormat('es-CO').format(p.price)}</span>
                                </div>
                            )) : <p className="text-xs italic text-muted-foreground p-2">Ninguno registrado</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center p-5 bg-slate-950 text-white rounded-2xl shadow-xl">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total General</span>
                    <span className="text-2xl font-headline font-black text-white">${new Intl.NumberFormat('es-CO').format(order.total)}</span>
                </div>

                <div className="space-y-6 pt-4">
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {canChangeStatus && order.status !== 'Completed' && order.status !== 'Cancelled' && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Avanzar Estado de Operación</Label>
                                <div className="flex gap-2">
                                    <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
                                        <SelectTrigger className="rounded-xl h-11 text-slate-950 bg-white border-2 border-slate-200"><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {availableOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={handleUpdateStatus} disabled={status === order.status || isUpdating} className="h-11 px-5 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-lg font-bold">
                                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin"/> : 'OK'}
                                    </Button>
                                </div>
                            </div>
                        )}
                        {!isMechanic && order.status !== 'Completed' && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Mecánico Asignado</Label>
                                <div className="flex gap-2">
                                    <Select value={mechanicId || ''} onValueChange={setMechanicId}>
                                        <SelectTrigger className="rounded-xl h-11 text-slate-950 bg-white border-2 border-slate-200"><SelectValue placeholder="Sin asignar" /></SelectTrigger>
                                        <SelectContent>
                                            {mechanics.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={handleAssignMechanic} disabled={mechanicId === order.assignedMechanicId || isUpdating} className="h-11 px-5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg font-bold">
                                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Asignar'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {!isMechanic && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t">
                            {['Ready', 'Completed'].includes(order.status) && (
                                order.invoice ? (
                                    <Button variant="secondary" onClick={() => onNavigateToInvoice(order.invoice!.id)} className="flex-1 rounded-xl h-12 bg-slate-100 text-slate-900 border-2 border-slate-200 font-black uppercase text-[10px] tracking-widest hover:bg-slate-200">
                                        <FileText className="mr-2 h-4 w-4" /> Ver Factura
                                    </Button>
                                ) : (
                                    <Button onClick={handleCreateInvoice} disabled={isCreatingInvoice} className="flex-1 rounded-xl h-12 shadow-xl bg-primary text-white hover:bg-primary/90 font-black uppercase text-[10px] tracking-widest">
                                        {isCreatingInvoice ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                                        Generar Factura Pro
                                    </Button>
                                )
                            )}
                        </div>
                    )}
                </div>
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
                <div className="border-2 border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50 p-6 min-h-[300px]">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Trazabilidad Operativa</span>
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs text-slate-400 text-center py-10 italic font-medium">
                            Los registros de auditoría garantizan la transparencia en el taller. Aquí aparecerán los cambios de estado y asignaciones técnicas con sello de tiempo.
                        </p>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    )
}

interface KanbanColumnProps {
    title: string;
    status: OrderStatus;
    orders: FullOrder[];
    bgColor: string;
    onOrderClick: (order: FullOrder) => void;
}

function KanbanColumn({ title, orders, bgColor, onOrderClick }: KanbanColumnProps) {
    return (
        <div className={cn("flex flex-col min-w-[280px] flex-1 rounded-2xl overflow-hidden shadow-sm border border-slate-100", bgColor)}>
            <div className="p-4 flex items-center justify-between border-b bg-white/40 backdrop-blur-sm">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-tight">{title} — {orders.length}</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6"><MoreVertical className="h-3 w-3" /></Button>
            </div>
            <ScrollArea className="flex-1 p-3 min-h-[500px]">
                <div className="space-y-3">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <Card 
                                key={order.id} 
                                className="border-none shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all bg-white rounded-xl group"
                                onClick={() => onOrderClick(order)}
                            >
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{order.orderNumber}</p>
                                        <Badge variant="outline" className="text-[8px] font-bold uppercase py-0 px-1.5 border-slate-200">{order.vehicle?.plate || 'S/P'}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-slate-950 truncate uppercase leading-tight">{order.client.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{order.vehicle ? `${order.vehicle.brand} ${order.vehicle.model}` : 'Vehículo no registrado'}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                        <div className="flex -space-x-2">
                                            <div className="h-6 w-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black uppercase text-slate-400">
                                                {order.assignedMechanic?.name ? order.assignedMechanic.name.substring(0, 2) : '??'}
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-black text-slate-950">${new Intl.NumberFormat('es-CO').format(order.total)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                            <p className="text-xs font-black uppercase text-slate-950">Aún no hay nada aquí</p>
                            <p className="text-[10px] font-medium text-slate-500 max-w-[160px] mt-1">No tienes ninguna orden accesible en este grupo de estado</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

function OrdersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, allUsers, workshop } = useUser();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<FullOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<FullOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const defaultFormData: OrderFormData = { clientId: '', vehicleId: '', services: [], parts: [] };
  const [orderFormData, setOrderFormData] = useState<OrderFormData>(defaultFormData);

  const fetchOrders = useCallback(async () => {
      if (!user?.workshopId) {
          setIsLoading(false);
          return;
      };
      setIsLoading(true);
      try {
          let data = await getFullOrdersForWorkshop(user.workshopId);
          if (user.role === 'Mechanic') {
              data = data.filter(order => order.assignedMechanicId === user.id);
          }
          setOrders(data);
      } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar las órdenes.' });
      } finally {
          setIsLoading(false);
      }
  }, [user, toast]);
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  useEffect(() => {
    if (viewingOrder) {
        const updatedOrder = orders.find(o => o.id === viewingOrder.id);
        if (updatedOrder) setViewingOrder(updatedOrder);
    }
  }, [orders, viewingOrder]);

  const handleSaveOrder = async () => {
    if (!user?.workshopId || !user) return;

    try {
        await createOrder(user.workshopId, orderFormData, user.id);
        toast({ title: 'Orden Creada', description: `La orden ha sido registrada exitosamente.` });
        await fetchOrders();
        setAddDialogOpen(false);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error operativo', description: (error as Error).message || "No se pudo registrar la orden. Verifique la base de datos." });
    }
  }

  const handleNavigateToInvoice = (invoiceId: string) => {
    setViewingOrder(null);
    router.push(`/invoices?view=${invoiceId}`);
  };

  const isMechanic = user?.role === 'Mechanic';

  // Nombres de columnas alineados con Informe Maestro (US-03)
  const kanbanColumns: { title: string; status: OrderStatus; color: string }[] = [
    { title: 'Abierta', status: 'Pending', color: 'bg-blue-50/50' },
    { title: 'En Diagnóstico', status: 'InProgress', color: 'bg-green-50/50' },
    { title: 'En Reparación', status: 'Ready', color: 'bg-orange-50/50' },
    { title: 'Lista para Entregar', status: 'Completed', color: 'bg-cyan-50/50' },
    { title: 'Cerrada', status: 'Cancelled', color: 'bg-slate-100/50' }
  ];

  const filteredOrders = useMemo(() => {
      if (!searchTerm) return orders;
      const term = searchTerm.toLowerCase();
      return orders.filter(o => 
        o.orderNumber.toLowerCase().includes(term) || 
        o.client.name.toLowerCase().includes(term) || 
        o.vehicle?.plate.toLowerCase().includes(term)
      );
  }, [orders, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <h1 className="text-2xl font-headline font-black uppercase tracking-tighter text-slate-950">Ordenes de trabajo</h1>
            <div className="flex items-center gap-1">
                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 border border-slate-200"><Wrench className="h-4 w-4" /></Button>
                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 border border-slate-200"><Settings className="h-4 w-4" /></Button>
            </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                    placeholder="Buscar orden o placa..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 pl-9 pr-4 rounded-lg border-2 border-slate-200 bg-white text-xs font-bold w-full"
                />
            </div>
            {!isMechanic && (
                <>
                    <Button onClick={() => setAddDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-10 px-4 font-black uppercase text-[10px] tracking-widest shadow-lg">
                        <Plus className="mr-2 h-4 w-4" strokeWidth={3} />
                        Orden
                    </Button>
                </>
            )}
            <Button variant="outline" className="rounded-lg h-10 px-4 font-black uppercase text-[10px] tracking-widest border-2 border-slate-200 text-slate-900 font-bold hover:bg-slate-50">
                <Filter className="mr-2 h-4 w-4" />
                Filtro
            </Button>
        </div>
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="sm:max-w-3xl rounded-[2.5rem] bg-slate-50 border-2 border-slate-200 shadow-2xl p-8">
              <DialogHeader className="mb-6">
                  <DialogTitle className="text-3xl font-headline font-black uppercase tracking-tighter text-slate-950">Apertura de Orden</DialogTitle>
                  <DialogDescription className="font-bold text-slate-500">Registra los detalles técnicos y requerimientos certificados para el servicio.</DialogDescription>
              </DialogHeader>
              <OrderForm 
                  formData={orderFormData}
                  setFormData={setOrderFormData}
                  onSave={handleSaveOrder} 
                  onCancel={() => setAddDialogOpen(false)} 
                  workshopId={user?.workshopId || ''} 
              />
          </DialogContent>
      </Dialog>

      <div className="flex-1 overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-max h-full">
              {isLoading ? (
                  <div className="flex-1 flex items-center justify-center py-40">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
              ) : (
                  kanbanColumns.map(col => (
                      <KanbanColumn 
                        key={col.status}
                        title={col.title}
                        status={col.status}
                        orders={filteredOrders.filter(o => o.status === col.status)}
                        bgColor={col.color}
                        onOrderClick={setViewingOrder}
                      />
                  ))
              )}
          </div>
      </div>

      <Dialog open={!!viewingOrder} onOpenChange={(isOpen) => { if (!isOpen) setViewingOrder(null) }}>
          <DialogContent className="rounded-[2.5rem] sm:max-w-2xl bg-slate-50 border-2 border-slate-200 shadow-2xl p-8">
              <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-headline font-black uppercase tracking-tighter text-slate-950">
                      Control de Orden {viewingOrder?.orderNumber}
                  </DialogTitle>
              </DialogHeader>
              <OrderDetails 
                order={viewingOrder} 
                onUpdate={fetchOrders} 
                allUsers={allUsers} 
                onNavigateToInvoice={handleNavigateToInvoice} 
              />
          </DialogContent>
      </Dialog>
    </div>
  );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen font-black uppercase tracking-[0.3em] text-slate-400">Iniciando Sistemas Operativos...</div>}>
            <OrdersPageContent />
        </Suspense>
    )
}

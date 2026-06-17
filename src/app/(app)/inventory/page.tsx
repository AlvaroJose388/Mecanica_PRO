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
import type { InventoryItem } from '@/lib/types';
import { PlusCircle, Trash2, Loader2, Edit, Warehouse, AlertTriangle, ShieldCheck, Search } from 'lucide-react';
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
import { createInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryForWorkshop } from '@/app/actions/inventory';
import { Badge } from '@/components/ui/badge';

function ItemForm({
    item,
    onSave,
    onCancel,
    isSaving
}: {
    item: Partial<InventoryItem>,
    onSave: (formData: Partial<InventoryItem>) => void,
    onCancel: () => void,
    isSaving: boolean
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    let newValue: any = value;
    
    if (type === 'number') {
      newValue = value === '' ? 0 : parseFloat(value) || 0;
    }
    
    setFormData(prev => ({ ...prev, [id]: newValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación completa
    if (!formData.name || formData.name.trim() === '') {
        toast({ variant: 'destructive', title: 'Error', description: 'El nombre es obligatorio.' });
        return;
    }
    
    if ((formData.quantity ?? 0) <= 0) {
        toast({ variant: 'destructive', title: 'Error', description: 'La cantidad debe ser mayor a 0.' });
        return;
    }
    
    if ((formData.price ?? 0) <= 0) {
        toast({ variant: 'destructive', title: 'Error', description: 'El precio debe ser mayor a 0.' });
        return;
    }
    
    console.log('Enviando datos:', formData);
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Nombre</Label>
          <Input id="name" value={formData.name ?? ''} onChange={handleChange} className="col-span-3 border-2 border-slate-200" placeholder="Ej: Llanta Michelin 185/65R15" disabled={isSaving} />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sku" className="text-right">SKU</Label>
          <Input id="sku" value={formData.sku ?? ''} onChange={handleChange} className="col-span-3 border-2 border-slate-200" disabled={isSaving} />
        </div>
        <div className="grid grid-cols-2 gap-4 ml-[25%]">
            <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input id="quantity" type="number" min="1" value={formData.quantity ?? ''} onChange={handleChange} className="border-2 border-slate-200" placeholder="0" disabled={isSaving} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="minStock">Mínimo</Label>
                <Input id="minStock" type="number" min="1" value={formData.minStock ?? 5} onChange={handleChange} className="border-2 border-slate-200" placeholder="5" disabled={isSaving} />
            </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">Precio</Label>
          <Input id="price" type="number" step="0.01" min="0.01" value={formData.price ?? ''} onChange={handleChange} className="col-span-3 border-2 border-slate-200" placeholder="0.00" disabled={isSaving} />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving} className="font-bold border border-slate-200">Cancelar</Button>
        <Button type="submit" disabled={isSaving} className="font-bold bg-slate-950 text-white hover:bg-primary">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Artículo
        </Button>
      </DialogFooter>
    </form>
  );
}


export default function InventoryPage() {
  const { user, workshop } = useUser();
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<InventoryItem> | null>(null);

  const fetchInventory = useCallback(async () => {
    if (!user?.workshopId) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
        const items = await getInventoryForWorkshop(user.workshopId);
        setInventory(items);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar el inventario.' });
    } finally {
        setIsLoading(false);
    }
  }, [user?.workshopId, toast]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleSaveItem = async (formData: Partial<InventoryItem>) => {
    if (!user?.workshopId) {
        toast({ variant: 'destructive', title: 'Error', description: 'No hay taller asociado. Por favor, inicia sesión nuevamente.' });
        return;
    }
    
    if (!user.workshop) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la información del taller.' });
        return;
    }
    
    if (!user.workshop.branches || user.workshop.branches.length === 0) {
        toast({ variant: 'destructive', title: 'Error', description: 'No hay sucursales configuradas para este taller. Contacta al administrador.' });
        return;
    }
    
    if (!formData.name) {
        toast({ variant: 'destructive', title: 'Error', description: 'El nombre del artículo es requerido.' });
        return;
    }
    
    setIsSaving(true);
    try {
        console.log('Guardando artículo:', formData);
        
        if (formData.id) {
            console.log('Actualizando artículo:', formData.id);
            await updateInventoryItem(formData.id, formData);
            toast({ title: '✅ Artículo actualizado correctamente' });
        } else {
            const inventoryData = {
                ...formData,
                workshopId: user.workshopId,
                branchId: user.workshop.branches[0].id
            };
            console.log('Creando nuevo artículo:', inventoryData);
            await createInventoryItem(inventoryData);
            toast({ title: '✅ Artículo creado correctamente' });
        }
        closeForm();
        await fetchInventory();
    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar el artículo';
        console.error('Error saving inventory item:', error);
        toast({ variant: 'destructive', title: 'Error al guardar', description: errorMessage });
    } finally {
      setIsSaving(false);
    }
  }

  const openFormForNew = () => {
    setEditingItem({});
    setFormOpen(true);
  }

  const openFormForEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormOpen(true);
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
        await deleteInventoryItem(itemId);
        await fetchInventory();
        toast({ title: 'Artículo eliminado' });
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar el artículo.' });
    }
  }
  
  const closeForm = () => {
    setEditingItem(null);
    setFormOpen(false);
  }

  const filteredInventory = useMemo(() => {
      if (!searchTerm) return inventory;
      const term = searchTerm.toLowerCase();
      return inventory.filter(i => i.name.toLowerCase().includes(term) || i.sku?.toLowerCase().includes(term));
  }, [inventory, searchTerm]);


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Almacenes de Precisión"
        description="Gestión logística de partes y consumibles certificados bajo vigilancia técnica."
        logoUrl={workshop?.logoUrl}
        icon={Warehouse}
      >
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar parte o SKU..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11 pl-10 rounded-xl border-2 border-slate-200 bg-white shadow-sm font-bold text-xs uppercase"
                />
            </div>
            <Button onClick={openFormForNew} className="bg-slate-950 text-white hover:bg-primary shadow-xl rounded-xl h-11 px-6 font-black uppercase text-[10px] tracking-widest transition-all">
                <PlusCircle className="mr-2 h-5 w-5" />
                Añadir Artículo
            </Button>
        </div>
      </PageHeader>

        <Dialog open={isFormOpen} onOpenChange={closeForm}>
            <DialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-headline font-black uppercase tracking-tighter text-slate-950">{editingItem?.id ? 'Editar Ficha Técnica' : 'Registro de Insumo'}</DialogTitle>
                    <DialogDescription className="font-bold text-slate-500">Asegura la trazabilidad de cada parte en el inventario logístico.</DialogDescription>
                </DialogHeader>
                {editingItem !== null && (
                  <ItemForm
                      item={editingItem}
                      onSave={handleSaveItem}
                      onCancel={closeForm}
                      isSaving={isSaving}
                  />
                )}
            </DialogContent>
        </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/80 border-b-2 border-slate-100 py-8 px-10">
              <CardTitle className="font-headline font-black uppercase text-2xl tracking-tighter">Stock General del Almacén</CardTitle>
              <CardDescription className="font-bold text-slate-500">Consolidado de piezas bajo protocolos de vigilancia logística.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-40"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
              ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-b">
                    <TableHead className="font-black text-[10px] uppercase px-10 h-14">Articulo Técnico</TableHead>
                    <TableHead className="font-black text-[10px] uppercase h-14">SKU / Serie</TableHead>
                    <TableHead className="font-black text-[10px] uppercase h-14">Cantidad</TableHead>
                    <TableHead className="font-black text-[10px] uppercase h-14">Precio Unitario</TableHead>
                    <TableHead className="text-right font-black text-[10px] uppercase px-10 h-14">Gestión</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50 transition-colors border-b group">
                      <TableCell className="font-black text-sm px-10 text-slate-900 uppercase tracking-tight">{item.name}</TableCell>
                      <TableCell className="font-mono text-xs font-bold text-slate-500">{item.sku}</TableCell>
                      <TableCell>
                          <div className="flex items-center gap-3">
                              <span className="font-black text-sm">{item.quantity}</span>
                              {item.quantity <= (item.minStock || 5) && (
                                  <Badge variant="destructive" className="h-5 px-2 text-[8px] font-black uppercase tracking-widest shadow-sm border-none">Crítico</Badge>
                              )}
                          </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-black text-slate-950">${new Intl.NumberFormat('es-CO').format(item.price)}</TableCell>
                      <TableCell className="text-right space-x-1 px-10">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all" onClick={() => openFormForEdit(item)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 transition-all">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2.5rem]">
                                <AlertDialogHeader>
                                <AlertDialogTitle className="font-black uppercase tracking-tighter">¿Eliminar artículo logístico?</AlertDialogTitle>
                                <AlertDialogDescription className="font-bold text-slate-500">
                                    Esta acción es irreversible y afectará los reportes históricos del Almacén Central.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel className="font-bold border-2 border-slate-200 rounded-xl">Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteItem(item.id)} className="bg-destructive text-white font-bold rounded-xl">Eliminar permanentemente</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
              {(!isLoading && filteredInventory.length === 0) && (
                <div className="text-center py-32 text-slate-300 font-black uppercase tracking-[0.2em] italic bg-slate-50 mx-10 my-10 rounded-[2rem] border-2 border-dashed border-slate-100">
                    Sin artículos detectados en la búsqueda
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-8">
              <Card className="border-none shadow-2xl bg-slate-950 text-white overflow-hidden rounded-[2.5rem]">
                  <CardHeader className="p-8">
                      <div className="flex items-center gap-2 mb-4">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Alertas Logísticas Pro</span>
                      </div>
                      <CardTitle className="text-2xl font-headline font-black uppercase tracking-tighter">Vigilancia de Stock</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-8 pt-0">
                      {inventory.filter(i => i.quantity <= (i.minStock || 5)).length > 0 ? (
                          inventory.filter(i => i.quantity <= (i.minStock || 5)).slice(0, 5).map(item => (
                              <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-all">
                                  <div className="flex flex-col gap-1">
                                      <span className="text-xs font-black uppercase tracking-tight">{item.name}</span>
                                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Umbral crítico: {item.quantity} unidades</span>
                                  </div>
                                  <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 shadow-2xl">
                                      <ShieldCheck className="h-5 w-5" />
                                  </div>
                              </div>
                          ))
                      ) : (
                          <div className="p-10 text-center border-2 border-dashed border-white/10 rounded-3xl opacity-40">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Niveles de stock certificados..</p>
                          </div>
                      )}
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}

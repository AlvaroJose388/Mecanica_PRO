'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useUser } from '@/contexts/user-context';
import { getWorkshopById, updateWorkshop, deleteBranch } from '@/app/actions/workshops';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, PlusCircle, Trash2, Loader2, ImagePlus, Building2 } from 'lucide-react';
import { UpgradeToPremium } from '@/components/upgrade-to-premium';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { Workshop, Branch, WorkshopType } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter as DialogFooterNew, DialogHeader as DialogHeaderNew, DialogTitle as DialogTitleNew, DialogTrigger as DialogTriggerNew } from '@/components/ui/dialog';

const workAreas = ["Diagnóstico", "Mecánica General", "Latonería", "Pintura", "Electricidad", "Llantas y Alineación", "Aire Acondicionado"];
const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function WorkshopSettingsPage() {
  const { user, refreshAllData } = useUser();
  const { toast } = useToast();
  
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('https://storage.googleapis.com/gweb-aip-dev.appspot.com/work-execution-assets/images/jR_2_S-hSJmQ0dCh8P5Hq_mecanicapro-logo.png');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#E53E3E');
  const [accentColor, setAccentColor] = useState('#F56565');
  const [sidebarBgColor, setSidebarBgColor] = useState('#4A0404');
  const [workshopType, setWorkshopType] = useState<WorkshopType>('Automotriz');
  const [branches, setBranches] = useState<Branch[]>([]);

  const loadWorkshopData = useCallback(async () => {
    if (user?.workshopId) {
      setIsLoading(true);
      try {
        const data = await getWorkshopById(user.workshopId);
        setWorkshop(data);
        if (data) {
            setName(data.name);
            setLogoUrl(data.logoUrl || 'https://storage.googleapis.com/gweb-aip-dev.appspot.com/work-execution-assets/images/jR_2_S-hSJmQ0dCh8P5Hq_mecanicapro-logo.png');
            setPrimaryColor(data.primaryColor || '#E53E3E');
            setAccentColor(data.accentColor || '#F56565');
            setSidebarBgColor(data.sidebarBgColor || '#4A0404');
            setWorkshopType(data.type || 'Automotriz');
            setBranches(data.branches);
        }
      } catch(err) {
        console.error(err);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la información del taller.' });
      } finally {
        setIsLoading(false);
      }
    }
  }, [user?.workshopId, toast]);

  useEffect(() => {
    loadWorkshopData();
  }, [loadWorkshopData]);
  
  const isPremium = useMemo(() => {
    if (!workshop) return false;
    if (user?.role === 'SuperAdmin') return true;
    return workshop.subscription === 'Premium';
  }, [workshop, user]);
  
  const handleBranchChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const field = id.split('-')[0] as keyof Omit<Branch, 'id' | 'workshopId'>;
    const newBranches = [...branches];
    newBranches[index] = { ...newBranches[index], [field]: value };
    setBranches(newBranches);
  }

  const handleAddBranch = () => {
    setBranches([...branches, { id: `new-${uuidv4()}`, name: '', address: '', phone: '' }]);
  }

  const handleDeleteBranch = async (branchId: string, index: number) => {
    if (branchId.startsWith('new-')) {
        setBranches(branches.filter((_, i) => i !== index));
    } else {
        setIsSaving(true);
        try {
            await deleteBranch(branchId);
            toast({
                title: 'Sucursal eliminada',
                description: 'La sucursal ha sido eliminada.',
            });
            await loadWorkshopData();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar la sucursal.' });
        } finally {
            setIsSaving(false);
        }
    }
  }

  const handleUpdateLogo = () => {
      if (newLogoUrl) {
          setLogoUrl(newLogoUrl);
          toast({ title: 'Logo actualizado en la vista previa' });
      }
  }

  const handleSaveChanges = async () => {
    if (!workshop || !user) return;
    setIsSaving(true);
    try {
      const payload: Partial<Workshop> = {
        name,
        logoUrl,
        primaryColor,
        accentColor,
        sidebarBgColor,
        type: workshopType,
        branches,
      };
      await updateWorkshop(workshop.id, payload);
      await refreshAllData(user);
      toast({
          title: 'Ajustes guardados',
          description: `Los ajustes de ${name} han sido guardados exitosamente.`,
      });
    } catch (error) {
       toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron guardar los cambios.' });
    } finally {
        setIsSaving(false);
    }
  }


  if (isLoading) {
    return (
        <div>
            <PageHeader title="Ajustes del Taller" description="Cargando configuración..." icon={Building2} />
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        </div>
    );
  }

  if (!workshop) {
    return (
        <div>
            <PageHeader title="Ajustes del Taller" description="No se encontró información del taller." icon={Building2} />
            <p>Parece que no estás asociado a ningún taller.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Ajustes de ${workshop.name}`}
        description="Gestiona la información visual y operativa de tu taller."
        icon={Building2}
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>Nombre y marca visual de tu negocio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Taller</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>Logo del Taller</Label>
                <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/20">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden border bg-background flex items-center justify-center">
                        <Image src={logoUrl} alt="Logo del Taller" fill className="object-contain p-2" />
                    </div>
                    <Dialog>
                        <DialogTriggerNew asChild>
                            <Button variant="outline"><ImagePlus className="mr-2 h-4 w-4" />Cambiar Logo</Button>
                        </DialogTriggerNew>
                        <DialogContent>
                            <DialogHeaderNew>
                                <DialogTitleNew>Actualizar Logo del Taller</DialogTitleNew>
                                <DialogDescription>Ingresa la dirección URL de la imagen de tu logo.</DialogDescription>
                            </DialogHeaderNew>
                            <div className="space-y-2">
                                <Label htmlFor="logo-url">URL del Logo</Label>
                                <Input id="logo-url" placeholder="https://ejemplo.com/logo.png" value={newLogoUrl} onChange={(e) => setNewLogoUrl(e.target.value)} />
                            </div>
                            <DialogFooterNew>
                                <DialogClose asChild>
                                    <Button type="button" onClick={handleUpdateLogo}>Aplicar en Vista Previa</Button>
                                </DialogClose>
                            </DialogFooterNew>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Colores de la Marca</CardTitle>
                <CardDescription>Define los colores que verán tus empleados y clientes.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-6">
                <div className="space-y-3">
                    <Label htmlFor="primary-color" className="text-xs font-bold uppercase tracking-wider">Color Primario</Label>
                    <div className="flex gap-2">
                        <Input id="primary-color" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 w-12 p-1 shrink-0" />
                        <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono text-xs uppercase" maxLength={7} />
                    </div>
                </div>
                <div className="space-y-3">
                    <Label htmlFor="accent-color" className="text-xs font-bold uppercase tracking-wider">Color de Acento</Label>
                    <div className="flex gap-2">
                        <Input id="accent-color" type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-10 w-12 p-1 shrink-0" />
                        <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="font-mono text-xs uppercase" maxLength={7} />
                    </div>
                </div>
                 <div className="space-y-3">
                    <Label htmlFor="sidebar-bg-color" className="text-xs font-bold uppercase tracking-wider">Fondo Lateral</Label>
                    <div className="flex gap-2">
                        <Input id="sidebar-bg-color" type="color" value={sidebarBgColor} onChange={(e) => setSidebarBgColor(e.target.value)} className="h-10 w-12 p-1 shrink-0" />
                        <Input value={sidebarBgColor} onChange={(e) => setSidebarBgColor(e.target.value)} className="font-mono text-xs uppercase" maxLength={7} />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Operación del Taller</CardTitle>
                <CardDescription>Configura las especialidades de tu negocio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Label>Tipo de Vehículos</Label>
                    <RadioGroup 
                        value={workshopType} 
                        onValueChange={(v) => setWorkshopType(v as WorkshopType)}
                        className="flex flex-wrap gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Automotriz" id="r-auto" />
                            <Label htmlFor="r-auto">Automotriz</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Motos" id="r-moto" />
                            <Label htmlFor="r-moto">Motos</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Camiones" id="r-camion" />
                            <Label htmlFor="r-camion">Camiones</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Mixto" id="r-mixto" />
                            <Label htmlFor="r-mixto">Mixto</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="space-y-4">
                    <Label>Áreas de Trabajo</Label>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {workAreas.map(area => (
                            <div key={area} className="flex items-center space-x-2">
                                <Checkbox id={`area-${area}`} defaultChecked={true} />
                                <Label htmlFor={`area-${area}`} className="font-normal">{area}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Horario de Atención</CardTitle>
                <CardDescription>Establece los días y horas de operación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {daysOfWeek.map(day => (
                    <div key={day} className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-md border p-4 hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <Checkbox id={`day-open-${day}`} defaultChecked={!["Sábado", "Domingo"].includes(day)}/>
                            <Label htmlFor={`day-open-${day}`} className="w-24 font-medium">{day}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select defaultValue="08:00">
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="08:00">08:00 AM</SelectItem>
                                    <SelectItem value="09:00">09:00 AM</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-muted-foreground">-</span>
                             <Select defaultValue="18:00">
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="17:00">05:00 PM</SelectItem>
                                    <SelectItem value="18:00">06:00 PM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building className="h-6 w-6" />
                    Sucursales
                </CardTitle>
                <CardDescription>Gestiona las ubicaciones físicas de tu taller.</CardDescription>
            </CardHeader>
            <CardContent>
                {!isPremium && branches.length <= 1 ? (
                    <div className="space-y-4">
                        <div className="p-4 border rounded-md bg-muted/50">
                            <div className="space-y-2">
                                <Label htmlFor={`name-0`}>Nombre de Sucursal</Label>
                                <Input id={`name-0`} value={branches[0]?.name || ''} onChange={(e) => handleBranchChange(0, e)} />
                            </div>
                             <div className="space-y-2 mt-4">
                                <Label htmlFor={`address-0`}>Dirección</Label>
                                <Input id={`address-0`} value={branches[0]?.address || ''} onChange={(e) => handleBranchChange(0, e)} />
                            </div>
                             <div className="space-y-2 mt-4">
                                <Label htmlFor={`phone-0`}>Teléfono</Label>
                                <Input id={`phone-0`} value={branches[0]?.phone || ''} onChange={(e) => handleBranchChange(0, e)} />
                            </div>
                        </div>
                        <Separator />
                        <UpgradeToPremium featureName="Múltiples Sucursales" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {branches.map((branch, index) => (
                            <div key={branch.id} className="p-4 border rounded-lg space-y-4 bg-background shadow-sm">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-sm">Sucursal #{index + 1}</h4>
                                    {branches.length > 1 && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 text-destructive hover:bg-destructive/10" disabled={isSaving}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Eliminar sucursal?</AlertDialogTitle>
                                                    <AlertDialogDescription>Esta acción no se puede deshacer y borrará los datos asociados.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteBranch(branch.id, index)} className="bg-destructive text-destructive-foreground">Eliminar</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                                <div className="grid gap-4">
                                     <div className="space-y-2">
                                        <Label htmlFor={`name-${index}`}>Nombre</Label>
                                        <Input id={`name-${index}`} value={branch.name} onChange={(e) => handleBranchChange(index, e)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`address-${index}`}>Dirección</Label>
                                        <Input id={`address-${index}`} value={branch.address || ''} onChange={(e) => handleBranchChange(index, e)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`phone-${index}`}>Teléfono</Label>
                                        <Input id={`phone-${index}`} value={branch.phone || ''} onChange={(e) => handleBranchChange(index, e)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                         <Button variant="outline" className="mt-4 w-full dashed border-2 border-dashed" onClick={handleAddBranch} disabled={isSaving}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Añadir Nueva Sucursal
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
        
        <div className="flex justify-end sticky bottom-4 z-10">
            <Button onClick={handleSaveChanges} disabled={isSaving} size="lg" className="shadow-lg px-10">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Guardar Todos los Cambios
            </Button>
        </div>
      </div>
    </div>
  );
}

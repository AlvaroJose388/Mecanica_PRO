'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Send, PlusCircle, Clock, Loader2, Calendar } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import type { Appointment, Client } from '@/lib/types';
import { useUser } from '@/contexts/user-context';
import { getAppointments, createAppointment } from '@/app/actions/agenda';
import { getClientsForWorkshop } from '@/app/actions/clients';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type FullAppointment = Appointment & {
  client: Client | null;
};

type AppointmentFormData = {
  clientId: string;
  service: string;
  time: string;
}

function AppointmentForm({
    formData,
    setFormData,
    clients,
    onSave,
    onCancel,
    isSaving
}: {
    formData: AppointmentFormData,
    setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>,
    clients: Client[],
    onSave: () => void,
    onCancel: () => void,
    isSaving: boolean
}) {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="client" className="text-slate-900 font-bold">Cliente</Label>
                    <Select value={formData.clientId} onValueChange={(value) => setFormData(prev => ({...prev, clientId: value}))} disabled={isSaving}>
                        <SelectTrigger id="client" className="h-12 rounded-xl text-slate-950 bg-white border-2 border-slate-200 shadow-sm"><SelectValue placeholder="Seleccionar cliente..." /></SelectTrigger>
                        <SelectContent>
                            {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="service" className="text-slate-900 font-bold">Descripción del Servicio</Label>
                    <Input id="service" value={formData.service} onChange={(e) => setFormData(prev => ({...prev, service: e.target.value}))} placeholder="Ej: Cambio de llantas OEM" className="h-12 rounded-xl text-slate-950 bg-white border-2 border-slate-200 shadow-sm" disabled={isSaving} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time" className="text-slate-900 font-bold">Hora Programada</Label>
                    <Input id="time" type="time" value={formData.time} onChange={(e) => setFormData(prev => ({...prev, time: e.target.value}))} className="h-12 rounded-xl text-slate-950 bg-white border-2 border-slate-200 shadow-sm" disabled={isSaving} />
                </div>
            </div>
            <DialogFooter className="gap-3 mt-8">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving} className="h-12 rounded-xl border-2 border-slate-200 text-slate-900 px-8 hover:bg-slate-50">Cancelar</Button>
                <Button type="submit" disabled={isSaving} className="h-12 rounded-xl bg-slate-950 text-white hover:bg-primary px-8 shadow-xl transition-all">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Cita Técnica
                </Button>
            </DialogFooter>
        </form>
    )
}

export default function AgendaPage() {
  const { user, workshop } = useUser();
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<FullAppointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({ clientId: '', service: '', time: '10:00'});

  const loadData = useCallback(async () => {
    if (!user?.workshopId) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    
    try {
        const [clientsData, apptsData] = await Promise.all([
            getClientsForWorkshop(user.workshopId),
            getAppointments(user.workshopId)
        ]);
        setClients(clientsData);
        setAppointments(apptsData as FullAppointment[]);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los datos de la agenda.' });
    } finally {
        setIsLoading(false);
    }
  }, [user?.workshopId, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const selectedDayAppointments = useMemo(() => {
    if (!date) return [];
    return appointments
      .filter(appt => {
        const apptDate = new Date(appt.date);
        return apptDate.getDate() === date.getDate() &&
               apptDate.getMonth() === date.getMonth() &&
               apptDate.getFullYear() === date.getFullYear();
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [date, appointments]);

  const handleWhatsAppConfirmation = (appointment: FullAppointment) => {
    if (!appointment.client) return;
    const appointmentDate = format(new Date(appointment.date), "eeee d 'de' LLLL", { locale: es });
    const appointmentTime = format(new Date(appointment.date), 'h:mm a');
    
    const message = encodeURIComponent(
      `Hola ${appointment.client.name}, te recordamos tu cita técnica en MecanicaPro para el servicio de "${appointment.service}" el día ${appointmentDate} a las ${appointmentTime}. ¡Te esperamos en el centro certificado!`
    );

    const whatsappUrl = `https://wa.me/${appointment.client.phone?.replace(/\D/g, '')}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const closeForm = () => {
    setAddDialogOpen(false);
    setFormData({ clientId: '', service: '', time: '10:00'});
  }

  const handleSaveAppointment = async () => {
    if (!user?.workshopId || !formData.clientId || !formData.service || !date) {
        toast({ variant: 'destructive', title: 'Error', description: 'Por favor, completa todos los campos requeridos.' });
        return;
    }
    setIsSaving(true);
    try {
        const [hours, minutes] = formData.time.split(':').map(Number);
        const appointmentDate = new Date(date);
        appointmentDate.setHours(hours, minutes, 0, 0);

        const newAppointmentData: Partial<Appointment> = {
            clientId: formData.clientId,
            service: formData.service,
            date: appointmentDate.toISOString(),
            workshopId: user.workshopId
        };

        const newAppointment = await createAppointment(newAppointmentData);
        setAppointments(prev => [...prev, newAppointment]);
        toast({
            title: 'Cita Agendada',
            description: `Servicio técnico programado para "${newAppointment.service}".`,
            action: (
                <ToastAction altText="Notificar VIP" onClick={() => handleWhatsAppConfirmation(newAppointment)} className="bg-slate-900 text-white border-none px-4 rounded-xl font-black text-[10px] tracking-widest uppercase">
                    Notificar WhatsApp
                </ToastAction>
            )
        });
        closeForm();
    } catch (error) {
         toast({ variant: 'destructive', title: 'Error', description: 'No se pudo registrar la cita en la base de datos.' });
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Agenda Operativa"
        description="Gestione las citas técnicas y optimice la capacidad instalada del taller."
        logoUrl={workshop?.logoUrl}
        icon={Calendar}
      >
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
                <Button className="shadow-2xl rounded-2xl h-12 px-8 bg-slate-950 text-white hover:bg-primary transition-all font-black uppercase text-[10px] tracking-widest">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Crear Nueva Cita
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[2.5rem] bg-slate-50 border-2 border-slate-200 shadow-2xl p-8">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-headline font-black uppercase tracking-tighter text-slate-950">Agendar Cita</DialogTitle>
                    <DialogDescription className="font-bold text-slate-500">
                        Programación técnica para el {date ? format(date, "d 'de' LLLL", { locale: es }) : ''}.
                    </DialogDescription>
                </DialogHeader>
                <AppointmentForm 
                    formData={formData}
                    setFormData={setFormData}
                    clients={clients}
                    onSave={handleSaveAppointment} 
                    onCancel={closeForm} 
                    isSaving={isSaving}
                />
            </DialogContent>
        </Dialog>
      </PageHeader>
      
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card className="overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white p-4">
                <CardContent className="p-0">
                    <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="w-full flex justify-center scale-110 md:scale-125 my-10"
                        locale={es}
                    />
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card className="h-full border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-slate-50 border-b-2 border-slate-100 p-8">
                    <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-slate-900">
                        <Clock className="h-6 w-6 text-primary" />
                        Citas: {date ? format(date, "d MMM", { locale: es }) : 'hoy'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 min-h-[300px]">
                     {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                     ) : selectedDayAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {selectedDayAppointments.map(appt => (
                                <div key={appt.id} className="p-5 border-2 border-slate-100 rounded-2xl bg-white hover:border-primary/20 transition-all group shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="bg-slate-950 text-white px-3 py-1 rounded-lg font-mono font-black text-sm shadow-lg">
                                            {format(new Date(appt.date), 'h:mm a')}
                                        </div>
                                        <Button size="icon" variant="secondary" className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 shadow-inner" onClick={() => handleWhatsAppConfirmation(appt)}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{appt.client?.name || 'Cliente'}</p>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1 leading-tight">{appt.service}</p>
                                </div>
                            ))}
                        </div>
                     ) : (
                        <div className="text-center py-20 text-slate-300 font-black uppercase tracking-[0.2em] italic border-2 border-dashed border-slate-100 rounded-3xl">
                            Sin citas programadas
                        </div>
                     )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

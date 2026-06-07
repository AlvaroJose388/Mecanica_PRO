'use client';
import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUser } from '@/contexts/user-context';
import { Printer, Mail, Loader2, Plus, CheckCircle, FileText, Calendar, Settings, MoreVertical, ShoppingBag, Send } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Invoice, InvoiceStatus, Order, Client } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { InvoiceView } from '@/components/invoice-view';
import { getInvoicesForWorkshop, updateInvoiceStatus } from '@/app/actions/invoices';
import { getClientsForWorkshop } from '@/app/actions/clients';
import { getFullOrdersForWorkshop } from '@/app/actions/orders';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type FullInvoice = Invoice & { branchName?: string };

function InvoicesPageContent() {
  const router = useRouter();
  const { user, workshop } = useUser();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  
  const [invoices, setInvoices] = useState<FullInvoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [viewingInvoice, setViewingInvoice] = useState<FullInvoice | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);


  const loadData = useCallback(async () => {
    if (!user?.workshopId) {
        setIsLoading(false);
        return;
    };
    setIsLoading(true);
    try {
        const [invoicesData, clientsData, ordersData] = await Promise.all([
            getInvoicesForWorkshop(user.workshopId),
            getClientsForWorkshop(user.workshopId),
            getFullOrdersForWorkshop(user.workshopId)
        ]);
        setInvoices(invoicesData);
        setClients(clientsData);
        setOrders(ordersData);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los datos de las ventas.' });
    } finally {
        setIsLoading(false);
    }
  }, [user?.workshopId, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  useEffect(() => {
    if (viewingInvoice) {
      const updatedInvoice = invoices.find(inv => inv.id === viewingInvoice.id);
      if (updatedInvoice) {
        setViewingInvoice(updatedInvoice);
      }
    }
  }, [invoices, viewingInvoice]);


  useEffect(() => {
    const invoiceToViewId = searchParams.get('view');
    if (invoiceToViewId && invoices.length > 0) {
      const foundInvoice = invoices.find(inv => inv.id === invoiceToViewId);
      if (foundInvoice) {
        setViewingInvoice(foundInvoice);
      }
    }
  }, [searchParams, invoices]);

  
  const handleGeneratePdf = async () => {
    if (!invoiceRef.current || !viewingInvoice) return;
    setIsGeneratingPdf(true);
    try {
        const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`Venta-${viewingInvoice.invoiceNumber}.pdf`);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo generar el PDF.' });
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  const handleSendEmail = () => {
      if (!viewingInvoice) return;
      
      const client = clients.find(c => c.id === viewingInvoice.clientId);

      if (!client || !client.email) {
          toast({
              variant: 'destructive',
              title: 'Cliente sin email',
              description: 'Este cliente no tiene un correo electrónico registrado.',
          });
          return;
      }
      
      const subject = `Factura de tu servicio en ${workshop?.name || 'MecanicaPro'}: #${viewingInvoice.invoiceNumber}`;
      const mailtoLink = `mailto:${client.email}?subject=${encodeURIComponent(subject)}`;
      window.location.href = mailtoLink;
  };

  const handleUpdateStatus = async (invoiceId: string, status: InvoiceStatus) => {
    setIsUpdatingStatus(true);
    try {
        await updateInvoiceStatus(invoiceId, status);
        toast({ title: 'Venta Pagada' });
        await loadData();
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar el estado.' });
    } finally {
        setIsUpdatingStatus(false);
    }
  }

  const viewingOrder = viewingInvoice ? orders.find(o => o.id === viewingInvoice.orderId) : null;
  const viewingClient = viewingInvoice ? clients.find(c => c.id === viewingInvoice.clientId) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      {/* Banner de Notificación SaaS */}
      <div className="bg-orange-100/80 border border-orange-200 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden group">
          <div className="bg-orange-500 text-white p-2.5 rounded-lg shadow-lg">
              <Mail className="h-5 w-5" />
          </div>
          <div className="flex-1">
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Confirme su dirección de correo electrónico</p>
              <p className="text-[11px] text-slate-600 font-medium">
                  Enviamos un correo electrónico a <span className="font-bold">{user?.email}</span>. Por favor, revise su correo.
              </p>
          </div>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-9 px-4 font-black uppercase text-[10px] tracking-widest shadow-lg">
              Enviar de nuevo
          </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-headline font-black uppercase tracking-tighter text-slate-950">Ventas</h1>
        <div className="flex items-center gap-2">
            <Button onClick={() => router.push('/orders')} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-10 px-4 font-black uppercase text-[10px] tracking-widest shadow-lg">
                <Plus className="mr-2 h-4 w-4" strokeWidth={3} />
                Venta
            </Button>
            <div className="flex items-center gap-2 border-2 border-slate-200 rounded-lg p-1 bg-white">
                <Calendar className="h-4 w-4 text-slate-400 ml-2" />
                <Select defaultValue="month">
                    <SelectTrigger className="border-none shadow-none h-8 text-[10px] font-bold uppercase tracking-widest">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="month">Período: Este mes</SelectItem>
                        <SelectItem value="week">Esta semana</SelectItem>
                        <SelectItem value="today">Hoy</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-1 border-2 border-slate-200 rounded-lg p-1 bg-white">
                <Select defaultValue="acc">
                    <SelectTrigger className="border-none shadow-none h-8 text-[10px] font-bold uppercase tracking-widest min-w-[100px]">
                        <SelectValue placeholder="Acciones" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="acc">Acciones</SelectItem>
                        <SelectItem value="export">Exportar CSV</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-slate-400"><Settings className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-slate-400"><MoreVertical className="h-4 w-4" /></Button>
            </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
        {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-40">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        ) : invoices.length > 0 ? (
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-transparent border-b">
                        <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-400 h-10 px-6">Venta</TableHead>
                        <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-400 h-10">Creado</TableHead>
                        <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-400 h-10">Almacén</TableHead>
                        <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-400 h-10">Cliente</TableHead>
                        <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-400 h-10">Comentario</TableHead>
                        <TableHead className="text-right font-black text-[9px] uppercase tracking-widest text-slate-400 h-10 px-6">Cantidad, COLS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => {
                        const client = clients.find((c) => c.id === invoice.clientId);
                        return (
                            <TableRow key={invoice.id} className="hover:bg-slate-50 transition-colors border-b cursor-pointer" onClick={() => setViewingInvoice(invoice)}>
                                <TableCell className="font-bold text-slate-900 px-6 text-xs">{invoice.invoiceNumber}</TableCell>
                                <TableCell className="text-xs text-slate-500">{format(new Date(invoice.createdAt), "dd/MM/yyyy HH:mm")}</TableCell>
                                <TableCell className="text-xs font-medium text-slate-600">{invoice.branchName || 'Sede Principal'}</TableCell>
                                <TableCell className="text-xs font-bold text-slate-900">{client?.name}</TableCell>
                                <TableCell className="text-xs text-slate-400 italic max-w-[200px] truncate">{invoice.notes || '-'}</TableCell>
                                <TableCell className="text-right px-6 font-mono font-black text-xs">
                                    ${new Intl.NumberFormat('es-CO').format(invoice.amount)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-32 text-center">
                <div className="bg-blue-50 text-blue-500 p-6 rounded-3xl mb-6 shadow-inner animate-pulse">
                    <ShoppingBag className="h-16 w-16" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-950 mb-2">Aún no hay ventas</h3>
                <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto mb-6 leading-relaxed">
                    Venda productos en unos pocos clics, realice un seguimiento de su facturación y analice los ingresos
                </p>
                <Button variant="link" onClick={() => router.push('/orders')} className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:no-underline">
                    Crear una venta
                </Button>
            </div>
        )}
      </div>

      <Dialog open={!!viewingInvoice} onOpenChange={(isOpen) => !isOpen && setViewingInvoice(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 border-none overflow-hidden rounded-[2.5rem] shadow-2xl">
              <DialogHeader className="p-8 pb-4 bg-slate-50 border-b">
                  <DialogTitle className="text-3xl font-headline font-black uppercase tracking-tighter text-slate-950">Factura {viewingInvoice?.invoiceNumber}</DialogTitle>
                  <DialogDescription className="font-bold text-slate-500">Documento oficial certificado por MecanicaPro.</DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="flex-1 p-8 bg-white">
                  <div ref={invoiceRef} className="bg-white rounded-2xl shadow-inner border border-slate-100">
                      {viewingInvoice && viewingOrder && viewingClient && user && (
                          <InvoiceView 
                              invoice={viewingInvoice} 
                              order={viewingOrder} 
                              client={viewingClient} 
                              workshop={user.workshop} 
                          />
                      )}
                  </div>
              </ScrollArea>

              <DialogFooter className="p-8 pt-4 border-t bg-slate-50 gap-4">
                  <div className="flex-1 flex justify-start">
                      {viewingInvoice?.status !== 'Paid' && (
                          <Button 
                              onClick={() => handleUpdateStatus(viewingInvoice!.id, 'Paid')} 
                              disabled={isUpdatingStatus}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 px-8 shadow-xl shadow-emerald-100 font-black uppercase tracking-widest text-xs"
                          >
                              {isUpdatingStatus ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" strokeWidth={3} />}
                              Marcar como Pagada
                          </Button>
                      )}
                  </div>
                  <div className="flex gap-3">
                      <Button variant="outline" onClick={handleSendEmail} className="rounded-2xl h-14 px-6 border-2 border-slate-200 text-slate-900 font-black uppercase tracking-widest text-[10px] hover:bg-slate-100">
                          <Mail className="mr-2 h-4 w-4" />Email Cliente
                      </Button>
                      <Button onClick={handleGeneratePdf} disabled={isGeneratingPdf} className="rounded-2xl h-14 px-8 bg-slate-950 text-white hover:bg-primary shadow-xl font-black uppercase tracking-widest text-xs">
                          {isGeneratingPdf ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Printer className="mr-2 h-5 w-5" />}
                          {isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}
                      </Button>
                  </div>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}

export default function InvoicesPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen font-black uppercase tracking-[0.3em] text-slate-400">Accediendo al Nodo de Finanzas...</div>}>
            <InvoicesPageContent />
        </Suspense>
    )
}
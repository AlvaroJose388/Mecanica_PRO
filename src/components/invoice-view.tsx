import type { Invoice, Order, Client, Workshop } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';

interface InvoiceViewProps {
    invoice: Invoice;
    order: Order;
    client: Client;
    workshop: Workshop | null;
}

const IVA_RATE = 0.19; // 19%

export function InvoiceView({ invoice, order, client, workshop }: InvoiceViewProps) {
    const subtotal = order.services.reduce((acc, s) => acc + s.price, 0) + order.parts.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const ivaAmount = subtotal * IVA_RATE;
    const total = subtotal + ivaAmount;

    return (
        <div className="p-8 bg-white text-slate-950">
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex justify-between items-start mb-10">
                    <div>
                         <div className="text-2xl text-primary mb-4">
                            <Logo />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Emisor Certificado</p>
                            <p className="text-sm font-black">{workshop?.name || 'MecanicaPro Central'}</p>
                            <p className="text-xs text-muted-foreground">{workshop?.branches?.[0]?.address || 'Sede Principal'}</p>
                            <p className="text-xs text-muted-foreground">{workshop?.branches?.[0]?.phone || 'mecanicapro.com'}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-5xl font-headline font-black text-primary tracking-tighter mb-2">FACTURA</h2>
                        <p className="text-xl font-mono font-bold text-slate-900">{invoice.invoiceNumber}</p>
                        <div className="mt-4 space-y-1">
                            <p className="text-xs text-muted-foreground">
                                Fecha de Emisión: <span className="text-slate-900 font-bold">{format(new Date(invoice.createdAt), "d 'de' LLLL, yyyy", { locale: es })}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Fecha de Vencimiento: <span className="text-slate-900 font-bold">{invoice.dueDate ? format(new Date(invoice.dueDate), "d 'de' LLLL, yyyy", { locale: es }) : 'N/A'}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <Separator className="my-8 bg-slate-100" />

                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Facturar a:</h3>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-base font-black text-slate-900">{client.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{client.address}</p>
                            <p className="text-xs font-medium text-slate-500">{client.email}</p>
                            <p className="text-xs font-bold text-primary mt-2">{client.phone}</p>
                        </div>
                    </div>
                     {order.vehicle && (
                         <div className="text-right space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Detalles del Vehículo:</h3>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 inline-block min-w-[200px]">
                                <p className="text-2xl font-mono font-black text-slate-900 tracking-tighter">{order.vehicle.plate}</p>
                                <p className="text-sm font-bold text-muted-foreground uppercase">{order.vehicle.brand} {order.vehicle.model}</p>
                            </div>
                         </div>
                     )}
                </div>

                <div className="mb-12">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-2 border-slate-900 hover:bg-transparent">
                                <TableHead className="w-1/2 text-slate-900 font-black uppercase text-[10px] tracking-widest">Descripción Técnica</TableHead>
                                <TableHead className="text-right text-slate-900 font-black uppercase text-[10px] tracking-widest">Cant.</TableHead>
                                <TableHead className="text-right text-slate-900 font-black uppercase text-[10px] tracking-widest">P. Unitario</TableHead>
                                <TableHead className="text-right text-slate-900 font-black uppercase text-[10px] tracking-widest">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.services.map((service, index) => (
                                <TableRow key={`service-${index}`} className="border-slate-100">
                                    <TableCell className="font-bold text-slate-800">Servicio: {service.name}</TableCell>
                                    <TableCell className="text-right font-medium">1</TableCell>
                                    <TableCell className="text-right font-mono">${new Intl.NumberFormat('es-CO').format(service.price)}</TableCell>
                                    <TableCell className="text-right font-bold text-slate-900">${new Intl.NumberFormat('es-CO').format(service.price)}</TableCell>
                                </TableRow>
                            ))}
                            {order.parts.map((part, index) => (
                                <TableRow key={`part-${index}`} className="border-slate-100">
                                    <TableCell className="font-bold text-slate-800">Repuesto: {part.name}</TableCell>
                                    <TableCell className="text-right font-medium">{part.quantity}</TableCell>
                                    <TableCell className="text-right font-mono">${new Intl.NumberFormat('es-CO').format(part.price)}</TableCell>
                                    <TableCell className="text-right font-bold text-slate-900">${new Intl.NumberFormat('es-CO').format(part.price * part.quantity)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-end pt-8 border-t-2 border-slate-900">
                    <div className="w-full max-w-xs space-y-4">
                         <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                            <span className="uppercase tracking-widest text-[10px] font-black">Subtotal</span>
                            <span className="font-mono">${new Intl.NumberFormat('es-CO').format(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                            <span className="uppercase tracking-widest text-[10px] font-black">IVA (19%)</span>
                            <span className="font-mono">${new Intl.NumberFormat('es-CO').format(ivaAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-300">
                            <span className="text-xl font-headline font-black uppercase tracking-tighter text-slate-900">TOTAL</span>
                            <span className="text-3xl font-headline font-black text-primary tracking-tighter">${new Intl.NumberFormat('es-CO').format(total)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-20 p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Garantía de Servicio MecanicaPro</p>
                    <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
                        Este documento es un comprobante válido del servicio técnico realizado. Todo trabajo cuenta con garantía de 30 días o 1,000 km bajo condiciones normales de uso.
                    </p>
                </div>
            </div>
        </div>
    );
}

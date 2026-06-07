'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { useUser } from '@/contexts/user-context';
import { UpgradeToPremium } from '@/components/upgrade-to-premium';
import { useMemo, useEffect, useState, useRef } from 'react';
import { format, subDays } from 'date-fns';
import { Loader2, TrendingUp, BarChart2, Calendar as CalendarIcon, FileDown, UserCheck, Building2, Wallet } from 'lucide-react';
import { getPerformanceReports, getSuperAdminReports, type ReportFilters } from '@/app/actions/reports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const chartConfig = {
  amount: {
    label: "Ingresos",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AnalyticsPage() {
    const { user, workshop } = useUser();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    const isSuperAdmin = user?.role === 'SuperAdmin';

    // Filter State
    const [filters, setFilters] = useState<ReportFilters>({
        startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        branchId: 'all'
    });

    const [reportData, setReportData] = useState<any>(null);

    const isPremium = useMemo(() => {
        if (!user) return false;
        if (isSuperAdmin) return true;
        return workshop?.subscription === 'Premium';
    }, [user, workshop, isSuperAdmin]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (isSuperAdmin) {
                const data = await getSuperAdminReports(filters);
                setReportData(data);
            } else if (user?.workshopId) {
                const cleanFilters = { ...filters, branchId: filters.branchId === 'all' ? undefined : filters.branchId };
                const data = await getPerformanceReports(user.workshopId, cleanFilters);
                setReportData(data);
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error de Nodo', description: 'No se pudieron sincronizar los reportes.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isPremium) loadData();
    }, [user?.workshopId, filters, isPremium]);

    const handleExportPdf = async () => {
        if (!reportRef.current) return;
        setIsGeneratingPdf(true);
        try {
            const canvas = await html2canvas(reportRef.current, { scale: 1.5, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Reporte-MecanicaPro-${format(new Date(), 'yyyyMMdd')}.pdf`);
            toast({ title: 'Reporte Exportado', description: 'El documento PDF ha sido generado exitosamente.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Fallo en la generación del PDF.' });
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (!isPremium) return <UpgradeToPremium featureName="Análisis Avanzado" />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title={isSuperAdmin ? "Reportes de Red Global" : "Inteligencia de Negocio"}
                description={isSuperAdmin ? "Monitoreo consolidado de ingresos de toda la red de talleres certificados." : "Generación de reportes de desempeño y análisis estratégico certificado."}
                icon={isSuperAdmin ? Wallet : BarChart2}
            >
                <Button 
                    onClick={handleExportPdf} 
                    disabled={isGeneratingPdf || isLoading}
                    className="h-12 px-6 rounded-2xl bg-slate-950 text-white hover:bg-primary shadow-xl font-black uppercase text-[10px] tracking-widest"
                >
                    {isGeneratingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                    Exportar Reporte PDF
                </Button>
            </PageHeader>

            {/* BARRA DE FILTROS */}
            <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-wrap items-end gap-6">
                        <div className="space-y-2 flex-1 min-w-[200px]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rango Inicial</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    type="date" 
                                    value={filters.startDate} 
                                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="h-12 pl-12 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 flex-1 min-w-[200px]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rango Final</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    type="date" 
                                    value={filters.endDate} 
                                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="h-12 pl-12 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold"
                                />
                            </div>
                        </div>
                        {!isSuperAdmin && (
                            <div className="space-y-2 flex-1 min-w-[200px]">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sucursal</label>
                                <Select value={filters.branchId} onValueChange={(v) => setFilters(prev => ({ ...prev, branchId: v }))}>
                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold">
                                        <SelectValue placeholder="Todas las sucursales" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas las Sedes</SelectItem>
                                        {workshop?.branches.map(b => (
                                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <Button onClick={loadData} disabled={isLoading} className="h-12 w-12 rounded-xl bg-primary text-white p-0">
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <TrendingUp className="h-5 w-5" />}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* CONTENIDO DEL REPORTE */}
            <div ref={reportRef} className="space-y-8 bg-slate-100/50 p-4 rounded-[2.5rem]">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    <Card className="hover-lift border-none shadow-lg rounded-[2rem]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isSuperAdmin ? "Recaudación Total Red" : "Ingresos Totales"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-headline font-black text-slate-950">
                                ${new Intl.NumberFormat('es-CO').format(reportData?.income.reduce((acc: number, cur: any) => acc + cur.amount, 0) || 0)}
                            </div>
                            <p className="text-[9px] text-emerald-600 font-black uppercase mt-1">Periodo Seleccionado</p>
                        </CardContent>
                    </Card>
                    <Card className="hover-lift border-none shadow-lg rounded-[2rem]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Volumen de Transacciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-headline font-black text-slate-950">
                                {reportData?.income.reduce((acc: number, cur: any) => acc + cur.count, 0) || 0}
                            </div>
                            <p className="text-[9px] text-primary font-black uppercase mt-1">Órdenes Facturadas</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                    {/* Gráfico de Ingresos */}
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white">
                        <CardHeader className="p-8">
                            <CardTitle className="text-xl font-headline font-black uppercase tracking-tighter">Curva de Ingresos Globales</CardTitle>
                            <CardDescription className="font-bold text-slate-500 uppercase text-[10px]">Evolución financiera diaria de la red.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                <BarChart data={reportData?.income}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="date" tickFormatter={(val) => format(new Date(val), 'dd/MM')} fontSize={10} fontStyle="bold" />
                                    <YAxis tickFormatter={(val) => `$${new Intl.NumberFormat('es-CO', { notation: 'compact' }).format(val)}`} fontSize={10} />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Reporte de Talleres (Solo SuperAdmin) o Servicios (TallerAdmin) */}
                    {isSuperAdmin ? (
                        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white">
                            <CardHeader className="p-8">
                                <CardTitle className="text-xl font-headline font-black uppercase tracking-tighter">Ingresos por Taller</CardTitle>
                                <CardDescription className="font-bold text-slate-500 uppercase text-[10px]">Rendimiento financiero por nodo certificado.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 px-8">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-none bg-slate-50">
                                            <TableHead className="font-black text-[9px] uppercase">Taller</TableHead>
                                            <TableHead className="text-center font-black text-[9px] uppercase">Ventas</TableHead>
                                            <TableHead className="text-right font-black text-[9px] uppercase">Total COLS</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData?.workshopIncome.map((w: any, i: number) => (
                                            <TableRow key={i} className="border-slate-50">
                                                <TableCell className="font-bold text-xs text-slate-900 uppercase">{w.name}</TableCell>
                                                <TableCell className="text-center font-black text-xs">{w.count}</TableCell>
                                                <TableCell className="text-right font-mono font-black text-xs text-primary">${new Intl.NumberFormat('es-CO').format(w.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white">
                            <CardHeader className="p-8">
                                <CardTitle className="text-xl font-headline font-black uppercase tracking-tighter">Servicios Más Rentables</CardTitle>
                                <CardDescription className="font-bold text-slate-500 uppercase text-[10px]">Top de intervenciones técnicas por volumen.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 px-8">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-none bg-slate-50">
                                            <TableHead className="font-black text-[9px] uppercase">Servicio</TableHead>
                                            <TableHead className="text-center font-black text-[9px] uppercase">Cant.</TableHead>
                                            <TableHead className="text-right font-black text-[9px] uppercase">Ingreso</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData?.services.map((s: any, i: number) => (
                                            <TableRow key={i} className="border-slate-50">
                                                <TableCell className="font-bold text-xs text-slate-900 uppercase">{s.name}</TableCell>
                                                <TableCell className="text-center font-black text-xs">{s.count}</TableCell>
                                                <TableCell className="text-right font-mono font-black text-xs text-primary">${new Intl.NumberFormat('es-CO').format(s.total)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Rendimiento de Mecánicos (Solo TallerAdmin) */}
                {!isSuperAdmin && (
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="p-8 bg-slate-50 border-b">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <UserCheck className="h-5 w-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Protocolo de Desempeño Humano</span>
                            </div>
                            <CardTitle className="text-2xl font-headline font-black uppercase tracking-tighter">Productividad de Operadores Técnicos</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50">
                                        <TableHead className="px-8 font-black text-[10px] uppercase">Mecánico Certificado</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase">Órdenes Finalizadas</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase">Ticket Promedio</TableHead>
                                        <TableHead className="text-right px-8 font-black text-[10px] uppercase">Facturación Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData?.mechanics.map((m: any) => (
                                        <TableRow key={m.id} className="hover:bg-slate-50 transition-colors">
                                            <TableCell className="px-8 py-5">
                                                <div className="font-black text-slate-950 uppercase text-sm">{m.name}</div>
                                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Operador de Línea</div>
                                            </TableCell>
                                            <TableCell className="font-black text-slate-900">{m.ordersCount}</TableCell>
                                            <TableCell className="font-bold text-slate-500 font-mono">
                                                ${new Intl.NumberFormat('es-CO').format(Math.round(m.revenue / m.ordersCount))}
                                            </TableCell>
                                            <TableCell className="text-right px-8">
                                                <div className="font-mono font-black text-lg text-primary">${new Intl.NumberFormat('es-CO').format(m.revenue)}</div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
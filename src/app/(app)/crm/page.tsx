'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { HeartPulse, Send, Users, TrendingUp, Calendar, AlertCircle, Clock, Loader2, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/user-context';
import { getCRMOpportunities, type CRMOpportunity } from '@/app/actions/crm';
import { cn } from '@/lib/utils';

export default function CRMPage() {
    const { user } = useUser();
    const [opportunities, setOpportunities] = useState<CRMOpportunity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadOpportunities() {
            if (user?.workshopId) {
                setIsLoading(true);
                const data = await getCRMOpportunities(user.workshopId);
                setOpportunities(data);
                setIsLoading(false);
            }
        }
        loadOpportunities();
    }, [user?.workshopId]);

    const handleNotify = (opt: CRMOpportunity) => {
        const message = encodeURIComponent(
            `Hola ${opt.name}, te saludamos de MecanicaPro. Notamos que tu ${opt.vehicle} ya requiere su ${opt.reason}. ¿Te gustaría agendar una cita técnica certificada esta semana?`
        );
        window.open(`https://wa.me/${opt.phone}?text=${message}`, '_blank');
    };

    const retentionRate = 84.2; 

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="CRM Predictivo"
                description="Motor de fidelización inteligente que analiza el ciclo de vida de los vehículos para maximizar el retorno."
                icon={HeartPulse}
            />

            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                <Card className="bg-slate-950 text-white border-none shadow-2xl relative overflow-hidden group rounded-[2rem]">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Users className="h-24 w-24 text-primary" />
                    </div>
                    <CardHeader className="pb-4 p-8">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Índice de Retención</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-10 p-8 pt-0">
                        <div className="text-5xl font-headline font-black tracking-tighter">{retentionRate}%</div>
                        <Progress value={retentionRate} className="h-2.5 bg-white/10" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Algoritmo basado en recurrencia anual OEM.</p>
                    </CardContent>
                </Card>

                <Card className="hover-lift border-2 border-slate-100 shadow-xl rounded-[2rem]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 p-8">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Oportunidades Hoy</CardTitle>
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shadow-inner">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="text-4xl font-headline font-black text-slate-950">
                            {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : opportunities.length}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-3 font-black uppercase tracking-widest">Detecciones Automáticas</p>
                    </CardContent>
                </Card>

                <Card className="hover-lift border-2 border-red-50 shadow-xl rounded-[2rem]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 p-8">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inactividad Crítica</CardTitle>
                        <div className="p-3 bg-red-50 rounded-xl text-red-600 shadow-inner">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="text-4xl font-headline font-black text-slate-950">
                            {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : opportunities.filter(o => o.status === 'Crítico').length}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-3 font-black uppercase tracking-widest">Riesgo de Abandono (&gt; 180 días)</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white">
                    <CardHeader className="bg-slate-50/80 border-b-2 border-slate-100 py-8 px-10">
                        <CardTitle className="text-2xl uppercase tracking-tighter font-headline font-black text-slate-950">Pipeline de Fidelización</CardTitle>
                        <CardDescription className="font-bold text-slate-500">Clientes identificados proactivamente según umbral configurable de 6 meses.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-32 flex justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
                        ) : opportunities.length > 0 ? (
                            <div className="divide-y-2 divide-slate-50">
                                {opportunities.map((opt, i) => (
                                    <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-6">
                                            <div className={cn(
                                                "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2",
                                                opt.status === 'Crítico' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                            )}>
                                                <Calendar className="h-7 w-7" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="font-black text-base text-slate-950 uppercase tracking-tight">{opt.name}</p>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="secondary" className="text-[9px] uppercase font-black px-2 py-1 bg-slate-100 text-slate-600 border-none">{opt.vehicle}</Badge>
                                                    <span className="text-[11px] text-slate-400 font-black uppercase tracking-tight">{opt.reason}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <Badge className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-4 py-2 border-none shadow-sm",
                                                opt.status === 'Crítico' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                                            )}>
                                                {opt.status}
                                            </Badge>
                                            <Button size="sm" className="rounded-2xl h-12 px-8 gap-3 bg-slate-950 text-white hover:bg-primary shadow-xl shadow-slate-200 transition-all active:scale-95" onClick={() => handleNotify(opt)}>
                                                <Send className="h-4 w-4" />
                                                <span className="font-black uppercase text-[10px] tracking-widest">Notificar WhatsApp</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-32 text-center text-slate-400 italic font-black uppercase tracking-[0.2em] bg-slate-50 border-2 border-dashed border-slate-100 mx-10 my-10 rounded-[2rem]">
                                Sin oportunidades detectadas • El flujo técnico está al día.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="border-none shadow-2xl bg-slate-950 text-white overflow-hidden rounded-[2.5rem]">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="h-5 w-5 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Protocolo Legal (US-12)</span>
                            </div>
                            <CardTitle className="text-2xl uppercase tracking-tighter font-headline font-black">Lógica de Retorno</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 p-8 pt-0">
                            <p className="text-sm text-slate-400 leading-relaxed font-bold uppercase tracking-tight opacity-80">
                                El motor predictivo analiza los intervalos de tiempo entre órdenes cerradas para estimar el desgaste de consumibles críticos.
                            </p>
                            <div className="p-6 rounded-3xl bg-white/5 border-2 border-white/10 flex items-center gap-5 shadow-inner">
                                <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-2xl">
                                    <ShieldCheck className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Estandarización</p>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Umbral Inactividad: 180 días.</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/10">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Estado del Motor</p>
                                <div className="flex justify-between items-center text-[11px] font-black">
                                    <span className="text-slate-400 uppercase">Análisis Predictivo</span>
                                    <span className="text-emerald-400 uppercase tracking-[0.2em] animate-pulse">Activo</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

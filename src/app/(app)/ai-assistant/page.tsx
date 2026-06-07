
'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Send, Loader2, AlertTriangle, Microscope, Cpu, Database, Network, Zap, ShieldCheck } from 'lucide-react';
import { askTechnicalAssistant, type TechnicalAssistantOutput } from '@/app/actions/ai';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ChatMessage = {
    role: 'user' | 'assistant';
    content: string | TechnicalAssistantOutput;
}

export default function AIAssistantPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [vehicleInfo, setVehicleInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await askTechnicalAssistant({ query: userMsg, vehicleInfo });
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: {
                    analysis: "ERROR DE CONEXIÓN CRÍTICO: El nodo de IA no responde.",
                    steps: ["Verificar variables de entorno (API KEY)", "Comprobar logs del servidor", "Reintentar operación"],
                    tools: ["Consola de Depuración"]
                } as TechnicalAssistantOutput
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            <PageHeader
                title="Vigilancia Tecnológica"
                description="Motor de protocolos automotrices para diagnósticos complejos y análisis de tendencias certificados."
                icon={Cpu}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
                <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2">
                    <Card className="border-primary/20 shadow-md rounded-[2rem] overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Configuración del Nodo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Ficha Técnica del Vehículo</label>
                                <Input 
                                    placeholder="Ej: BMW X5 2023 M-Sport" 
                                    value={vehicleInfo} 
                                    onChange={(e) => setVehicleInfo(e.target.value)}
                                    className="bg-slate-100 border-none rounded-xl h-12 font-bold text-xs"
                                />
                            </div>
                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-3">
                                <div className="flex items-center gap-2 text-primary">
                                    <Database className="h-3 w-3" />
                                    <p className="text-[9px] font-black uppercase tracking-widest">Fuentes de Datos</p>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
                                    Sincronizado con manuales OEM y boletines de ingeniería global.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden rounded-[2rem]">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-emerald-400">
                                <Network className="h-5 w-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Estado de Red</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                    <span className="text-slate-500">Sincronización OEM</span>
                                    <span className="text-emerald-400 animate-pulse">Activa</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                </div>
                            </div>
                            <div className="pt-4 flex items-center gap-3">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Protocolo Seguro v2.0</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="lg:col-span-3 flex flex-col overflow-hidden border-none shadow-2xl relative rounded-[2.5rem] bg-white">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Sparkles className="h-64 w-64 text-primary" />
                    </div>
                    
                    <ScrollArea className="flex-1 p-8 bg-[#f8fafc]" ref={scrollAreaRef}>
                        <div className="space-y-10">
                            {messages.length === 0 && (
                                <div className="text-center py-24 flex flex-col items-center gap-6">
                                    <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-2 border-slate-50 relative group transition-all hover:scale-105">
                                        <div className="absolute -inset-4 bg-primary/10 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Microscope className="h-16 w-16 text-primary relative z-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950">Terminal de Ingeniería IA</h3>
                                        <p className="text-slate-400 max-w-sm mx-auto font-bold uppercase text-[10px] tracking-[0.2em]">
                                            Ingrese síntomas técnicos o ruidos para iniciar vigilancia operativa.
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            {messages.map((msg, i) => (
                                <div key={i} className={cn(
                                    "flex flex-col gap-3 max-w-[90%]",
                                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                                )}>
                                    <div className={cn(
                                        "flex items-center gap-2 mb-1",
                                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                    )}>
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            msg.role === 'user' ? "bg-slate-300" : "bg-primary animate-pulse"
                                        )} />
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                                            {msg.role === 'user' ? 'Operador Técnico' : 'MecanicaPro Core IA'}
                                        </span>
                                    </div>
                                    
                                    <div className={cn(
                                        "p-6 rounded-[2rem] shadow-xl border-2 text-sm leading-relaxed transition-all",
                                        msg.role === 'user' 
                                            ? "bg-slate-900 text-white rounded-tr-none border-slate-800" 
                                            : "bg-white text-slate-900 border-slate-100 rounded-tl-none"
                                    )}>
                                        {typeof msg.content === 'string' ? (
                                            <p className="font-bold tracking-tight">{msg.content}</p>
                                        ) : (
                                            <div className="space-y-8">
                                                <div className="flex items-start gap-4">
                                                    <div className={cn(
                                                        "p-3 rounded-2xl shrink-0 border shadow-inner",
                                                        msg.content.analysis.includes("ERROR") || msg.content.analysis.includes("FALLO") 
                                                            ? "bg-red-50 border-red-100" 
                                                            : "bg-orange-50 border-orange-100"
                                                    )}>
                                                        <AlertTriangle className={cn(
                                                            "h-6 w-6",
                                                            msg.content.analysis.includes("ERROR") || msg.content.analysis.includes("FALLO") 
                                                                ? "text-red-600" 
                                                                : "text-orange-600"
                                                        )} />
                                                    </div>
                                                    <p className="font-black text-lg leading-tight text-slate-950 uppercase tracking-tighter">
                                                        {msg.content.analysis}
                                                    </p>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 text-primary">
                                                        <Zap className="h-4 w-4 fill-current" />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Protocolo de Ejecución Sugerido:</p>
                                                    </div>
                                                    <div className="grid gap-3">
                                                        {msg.content.steps.map((step, idx) => (
                                                            <div key={idx} className="flex gap-4 items-start group p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                                                <div className="h-7 w-7 rounded-xl bg-slate-950 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-lg">
                                                                    {idx + 1}
                                                                </div>
                                                                <span className="font-bold text-slate-700 leading-snug uppercase text-xs tracking-tight group-hover:text-slate-950">{step}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="pt-6 flex flex-wrap gap-2 border-t-2 border-dashed border-slate-100">
                                                    {msg.content.tools.map(tool => (
                                                        <Badge key={tool} variant="secondary" className="bg-slate-100 text-slate-500 text-[9px] uppercase font-black px-4 py-1.5 border-none shadow-sm">
                                                            {tool}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-4 items-center ml-4 animate-in fade-in">
                                    <div className="bg-primary/10 p-3 rounded-2xl">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">Procesando Nodo de Conocimiento...</span>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <CardFooter className="p-8 border-t bg-white z-10">
                        <div className="flex w-full gap-4 items-center">
                            <div className="flex-1 relative group">
                                <Input 
                                    placeholder="Describa el síntoma técnico para análisis de protocolo..." 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    disabled={isLoading}
                                    className="h-16 bg-slate-50 border-2 border-transparent group-focus-within:border-primary/20 group-focus-within:bg-white rounded-[1.5rem] px-8 text-sm font-bold text-slate-950 placeholder:text-slate-400 shadow-inner transition-all"
                                />
                            </div>
                            <Button 
                                onClick={handleSend} 
                                disabled={isLoading || !input.trim()} 
                                className="h-16 px-10 shadow-2xl rounded-[1.5rem] bg-slate-950 text-white hover:bg-primary transition-all active:scale-95 flex items-center gap-3 font-black uppercase text-[10px] tracking-widest"
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
                                Ejecutar Diagnóstico
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

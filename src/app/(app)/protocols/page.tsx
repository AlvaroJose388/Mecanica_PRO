'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Search, ChevronRight, ShieldCheck, Zap, AlertTriangle, Info, Loader2, FileDown, PlusCircle, Trash2, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { getTechnicalProtocols, createTechnicalProtocol } from '@/app/actions/protocols';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/user-context';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from '@/lib/utils';

type Protocol = {
    id: string;
    title: string;
    category: string;
    level: string;
    description: string;
    steps: string[];
    warning: string | null;
    tip: string | null;
}

export default function ProtocolsPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [protocols, setProtocols] = useState<Protocol[]>([]);
    const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [isProcedureActive, setIsProcedureActive] = useState(false);
    
    const protocolRef = useRef<HTMLDivElement>(null);

    // Roles check
    const isAdmin = user?.role === 'TallerAdmin' || user?.role === 'SuperAdmin';

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('Motor');
    const [newLevel, setNewLevel] = useState('Intermedio');
    const [newDesc, setNewDesc] = useState('');
    const [newSteps, setNewSteps] = useState<string[]>(['']);
    const [newWarning, setNewWarning] = useState('');
    const [newTip, setNewTip] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const loadProtocols = async () => {
        setIsLoading(true);
        const data = await getTechnicalProtocols();
        setProtocols(data as Protocol[]);
        if (data.length > 0 && !selectedProtocol) setSelectedProtocol(data[0] as Protocol);
        setIsLoading(false);
    }

    useEffect(() => {
        loadProtocols();
    }, []);

    const filtered = useMemo(() => 
        protocols.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [protocols, searchTerm]);

    const handleAddStep = () => setNewSteps([...newSteps, '']);
    const handleRemoveStep = (index: number) => setNewSteps(newSteps.filter((_, i) => i !== index));
    const handleStepChange = (index: number, val: string) => {
        const updated = [...newSteps];
        updated[index] = val;
        setNewSteps(updated);
    };

    const handleSaveProtocol = async () => {
        if (!newTitle || !newDesc || newSteps.some(s => !s.trim())) {
            toast({ variant: 'destructive', title: 'Datos incompletos', description: 'Por favor complete todos los campos obligatorios.' });
            return;
        }

        setIsSaving(true);
        try {
            await createTechnicalProtocol({
                title: newTitle,
                category: newCategory,
                level: newLevel,
                description: newDesc,
                steps: newSteps,
                warning: newWarning,
                tip: newTip
            });
            toast({ title: 'Protocolo Registrado', description: 'El nuevo estándar técnico ha sido guardado exitosamente.' });
            setIsAddDialogOpen(false);
            resetForm();
            await loadProtocols();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el protocolo técnico.' });
        } finally {
            setIsSaving(false);
        }
    };

    const resetForm = () => {
        setNewTitle('');
        setNewCategory('Motor');
        setNewLevel('Intermedio');
        setNewDesc('');
        setNewSteps(['']);
        setNewWarning('');
        setNewTip('');
    };

    const handleDownloadPdf = async () => {
        if (!protocolRef.current || !selectedProtocol) return;
        setIsGeneratingPdf(true);
        try {
            const canvas = await html2canvas(protocolRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Protocolo-${selectedProtocol.title.replace(/\s+/g, '-')}.pdf`);
            toast({ title: 'PDF Generado', description: 'La ficha técnica oficial se ha descargado correctamente.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo generar el documento PDF.' });
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const handleStartProcedure = () => {
        setIsProcedureActive(true);
        toast({
            title: 'Protocolo en Ejecución',
            description: `Ejecutando "${selectedProtocol?.title}". El sistema de trazabilidad está activo para ${user?.name}.`,
        });
    };

    const handleFinishProcedure = () => {
        setIsProcedureActive(false);
        toast({
            title: 'Procedimiento Finalizado',
            description: 'Se ha registrado la culminación exitosa del protocolo técnico certificado.',
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-10 animate-spin text-primary" />
                    <p className="font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Sincronizando Biblioteca...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="Biblioteca Técnica"
                description="Protocolos certificados y manuales de procedimiento OEM para ingeniería automotriz."
                icon={BookOpen}
            >
                {isAdmin && (
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="shadow-2xl rounded-2xl h-12 bg-slate-950 text-white hover:bg-primary px-8 font-black uppercase text-[10px] tracking-widest transition-all">
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Añadir Estándar Técnico
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-10 bg-slate-50 border-2 border-slate-200">
                            <DialogHeader className="mb-8">
                                <DialogTitle className="text-3xl font-headline font-black uppercase tracking-tighter text-slate-950">Nuevo Estándar</DialogTitle>
                                <DialogDescription className="font-bold text-slate-500 text-base">Defina un nuevo procedimiento certificado para la excelencia del taller.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-8 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-slate-900">Título del Protocolo</Label>
                                    <Input id="title" placeholder="Ej: Ajuste de Válvulas Motor Boxer" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="rounded-xl h-14 text-slate-950 bg-white border-2 border-slate-200 font-bold focus-visible:ring-primary/20 shadow-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900">Categoría</Label>
                                        <Select value={newCategory} onValueChange={setNewCategory}>
                                            <SelectTrigger className="h-14 rounded-xl text-slate-950 bg-white border-2 border-slate-200 font-bold shadow-sm"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Motor">Motor</SelectItem>
                                                <SelectItem value="Transmisión">Transmisión</SelectItem>
                                                <SelectItem value="Electrónica">Electrónica</SelectItem>
                                                <SelectItem value="Frenos">Frenos</SelectItem>
                                                <SelectItem value="Suspensión">Suspensión</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900">Nivel de Dificultad</Label>
                                        <Select value={newLevel} onValueChange={setNewLevel}>
                                            <SelectTrigger className="h-14 rounded-xl text-slate-950 bg-white border-2 border-slate-200 font-bold shadow-sm"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Básico">Básico</SelectItem>
                                                <SelectItem value="Intermedio">Intermedio</SelectItem>
                                                <SelectItem value="Avanzado">Avanzado</SelectItem>
                                                <SelectItem value="Complejo">Complejo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900">Descripción General</Label>
                                    <Textarea placeholder="Describa el objetivo técnico del protocolo..." value={newDesc} onChange={e => setNewDesc(e.target.value)} className="rounded-xl min-h-[120px] text-slate-950 bg-white border-2 border-slate-200 font-bold focus-visible:ring-primary/20 shadow-sm" />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex justify-between items-center">
                                        Pasos de Ejecución Certificados
                                        <Button variant="outline" size="sm" onClick={handleAddStep} className="text-primary hover:bg-primary/5 h-8 border-2 border-primary/20 font-black text-[9px] uppercase px-4 rounded-lg">+ Añadir Paso</Button>
                                    </Label>
                                    <div className="space-y-3">
                                        {newSteps.map((step, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="h-12 w-12 shrink-0 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">{i+1}</div>
                                                <Input placeholder={`Describa el paso técnico ${i+1}`} value={step} onChange={e => handleStepChange(i, e.target.value)} className="rounded-xl text-slate-950 bg-white border-2 border-slate-200 font-bold shadow-sm" />
                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveStep(i)} className="text-destructive hover:bg-destructive/10 shrink-0"><Trash2 className="h-5 w-5" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-orange-600">Advertencia Crítica</Label>
                                        <Input placeholder="Riesgos potenciales de seguridad..." value={newWarning} onChange={e => setNewWarning(e.target.value)} className="rounded-xl h-14 border-2 border-orange-200 text-slate-950 bg-white font-bold shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Tip de Ingeniería</Label>
                                        <Input placeholder="Consejo técnico avanzado..." value={newTip} onChange={e => setNewTip(e.target.value)} className="rounded-xl h-14 border-2 border-emerald-200 text-slate-950 bg-white font-bold shadow-sm" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="mt-8 gap-4">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-2xl h-14 px-8 border-2 border-slate-200 text-slate-900 font-black uppercase text-xs tracking-widest hover:bg-slate-100">Cancelar</Button>
                                <Button onClick={handleSaveProtocol} disabled={isSaving} className="rounded-2xl h-14 bg-slate-950 text-white hover:bg-primary px-10 font-black uppercase text-xs tracking-widest shadow-2xl transition-all">
                                    {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                                    Publicar Estándar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-primary" />
                        <Input 
                            placeholder="Buscar estándar técnico..." 
                            className="pl-12 h-14 rounded-2xl bg-white shadow-xl border-2 border-slate-100 text-slate-950 font-bold placeholder:font-medium transition-all focus-visible:ring-primary/20" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="h-[650px] pr-4">
                        <div className="space-y-3">
                            {filtered.length > 0 ? filtered.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => { if(!isProcedureActive) setSelectedProtocol(p) }}
                                    disabled={isProcedureActive}
                                    className={cn(
                                        "w-full text-left p-5 rounded-2xl border-2 transition-all group relative overflow-hidden",
                                        selectedProtocol?.id === p.id 
                                            ? "bg-slate-950 text-white border-slate-950 shadow-2xl scale-105 z-10" 
                                            : "bg-white text-slate-900 border-slate-100 hover:border-primary/30 shadow-lg hover:shadow-primary/5"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge variant={selectedProtocol?.id === p.id ? 'outline' : 'secondary'} className={cn(
                                            "text-[9px] uppercase font-black px-2.5 py-1",
                                            selectedProtocol?.id === p.id ? "border-white/30 text-white" : "bg-slate-100 text-slate-500"
                                        )}>
                                            {p.category}
                                        </Badge>
                                        <ChevronRight className={cn("h-5 w-5 transition-transform group-hover:translate-x-1", selectedProtocol?.id === p.id ? "text-primary" : "text-slate-300")} />
                                    </div>
                                    <p className="font-black text-sm leading-snug tracking-tight uppercase">{p.title}</p>
                                    <div className={cn(
                                        "mt-3 text-[10px] font-bold uppercase tracking-widest",
                                        selectedProtocol?.id === p.id ? "text-slate-400" : "text-slate-400"
                                    )}>
                                        Nivel: {p.level}
                                    </div>
                                </button>
                            )) : (
                                <div className="text-center py-20 text-slate-400 text-xs italic font-bold uppercase tracking-widest bg-slate-50 rounded-2xl border-2 border-dashed">No se encontraron protocolos operativos.</div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <div className="lg:col-span-2">
                    {selectedProtocol ? (
                        <div className="space-y-8">
                            <Card className="border-none shadow-2xl overflow-hidden rounded-[3rem] bg-white relative">
                                {isProcedureActive && (
                                    <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-500">
                                        <div className="bg-primary text-white px-10 py-5 rounded-full flex items-center gap-4 animate-pulse shadow-2xl font-black text-sm uppercase tracking-widest mb-8">
                                            <Zap className="h-6 w-6" /> Protocolo en Ejecución • {user?.name}
                                        </div>
                                        <p className="text-slate-900 font-black text-lg mb-10 max-w-sm leading-tight uppercase tracking-tighter">
                                            Mantenga enfoque absoluto en la tarea técnica. El sistema registra trazabilidad OEM.
                                        </p>
                                        <Button 
                                            onClick={handleFinishProcedure}
                                            className="rounded-full h-20 px-12 bg-emerald-600 hover:bg-emerald-700 shadow-2xl shadow-emerald-200 text-xl font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 text-white"
                                        >
                                            <ClipboardCheck className="mr-3 h-8 w-8" /> Finalizar Tarea
                                        </Button>
                                    </div>
                                )}
                                <div ref={protocolRef}>
                                    <CardHeader className="bg-slate-50/80 border-b-2 border-slate-100 p-10 pb-12">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3 text-primary">
                                                <ShieldCheck className="h-6 w-6" />
                                                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Protocolo Certificado MecanicaPro</span>
                                            </div>
                                            <Badge className="bg-orange-500 text-white font-black px-4 py-1.5 rounded-xl uppercase text-[10px] shadow-lg shadow-orange-100">{selectedProtocol.level}</Badge>
                                        </div>
                                        <CardTitle className="text-5xl font-headline font-black uppercase tracking-tighter text-slate-950 mb-6 leading-[0.9]">{selectedProtocol.title}</CardTitle>
                                        <CardDescription className="text-lg font-bold text-slate-500 leading-relaxed max-w-2xl">
                                            {selectedProtocol.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-10 space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-8">
                                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2 border-b-2 border-primary/10 pb-3">
                                                    <Zap className="h-5 w-5" /> Pasos de Ejecución
                                                </h4>
                                                <ul className="space-y-6">
                                                    {selectedProtocol.steps.map((step, i) => (
                                                        <li key={i} className="flex gap-5 items-start group">
                                                            <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-sm font-black shadow-xl border-2 border-white">{i + 1}</div>
                                                            <span className="text-base font-black text-slate-800 leading-snug uppercase tracking-tight">{step}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="space-y-8">
                                                {selectedProtocol.warning && (
                                                    <div className="p-8 rounded-[2.5rem] bg-orange-50 border-2 border-orange-100 space-y-4 shadow-inner relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 p-4 opacity-5">
                                                            <AlertTriangle className="h-20 w-20" />
                                                        </div>
                                                        <div className="flex items-center gap-2 text-orange-600">
                                                            <AlertTriangle className="h-6 w-6" />
                                                            <h5 className="font-black text-[11px] uppercase tracking-widest">Advertencia de Seguridad</h5>
                                                        </div>
                                                        <p className="text-sm text-orange-900 leading-relaxed font-bold italic">
                                                            {selectedProtocol.warning}
                                                        </p>
                                                    </div>
                                                )}
                                                {selectedProtocol.tip && (
                                                    <div className="p-8 rounded-[2.5rem] bg-slate-950 text-white space-y-4 shadow-2xl relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                                            <Zap className="h-20 w-20 text-primary" />
                                                        </div>
                                                        <div className="flex items-center gap-2 text-emerald-400">
                                                            <Info className="h-6 w-6" />
                                                            <h5 className="font-black text-[11px] uppercase tracking-widest">Tip de Ingeniería</h5>
                                                        </div>
                                                        <p className="text-sm text-slate-300 leading-relaxed font-bold">
                                                            {selectedProtocol.tip}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                                <div className="p-10 pt-0 flex justify-end gap-4">
                                    <Button 
                                        variant="outline" 
                                        onClick={handleDownloadPdf} 
                                        disabled={isGeneratingPdf || isProcedureActive}
                                        className="rounded-2xl h-14 px-8 border-2 border-slate-200 text-slate-950 hover:bg-slate-50 font-black uppercase text-[10px] tracking-widest shadow-sm"
                                    >
                                        {isGeneratingPdf ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <FileDown className="mr-3 h-5 w-5" />}
                                        Descargar PDF
                                    </Button>
                                    <Button 
                                        onClick={handleStartProcedure} 
                                        disabled={isProcedureActive}
                                        className="rounded-2xl h-14 px-10 shadow-2xl shadow-primary/20 bg-slate-950 text-white hover:bg-primary transition-all active:scale-95 font-black uppercase text-xs tracking-[0.2em]"
                                    >
                                        {isProcedureActive ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <CheckCircle2 className="mr-3 h-5 w-5" />}
                                        Iniciar Procedimiento
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40 text-slate-300 gap-6 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 shadow-inner">
                            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                                <BookOpen className="h-12 w-12 opacity-20 text-slate-950" />
                            </div>
                            <p className="font-black text-sm uppercase tracking-[0.4em] italic">Seleccione un protocolo de la biblioteca</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

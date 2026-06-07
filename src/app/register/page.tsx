
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, CheckCircle2, ChevronLeft, Building2, UserCircle, Target, ShieldCheck, FileText, ScrollText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registerWorkshopOwner } from '@/app/actions/auth';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function RegisterPage() {
    const router = useRouter();
    const { login, user: currentUser } = useUser();
    const { toast } = useToast();
    
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Form State
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [workshopName, setWorkshopName] = useState('');
    const [employeeCount, setEmployeeCount] = useState('1-2');
    const [country, setCountry] = useState('Colombia');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (currentUser) {
            router.replace('/dashboard');
        }
    }, [currentUser, router]);

    const totalSteps = 3;

    const handleNext = () => {
        if (step === 1 && (!userName || !email || !password)) {
            toast({ variant: 'destructive', title: 'Campos requeridos', description: 'Por favor completa tus datos personales.' });
            return;
        }
        if (step === 2 && (!workshopName || !city || !phone)) {
            toast({ variant: 'destructive', title: 'Campos requeridos', description: 'Por favor completa los datos de tu empresa.' });
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const handleRegister = async () => {
        if (!acceptedTerms) {
            toast({ variant: 'destructive', title: 'Acción Requerida', description: 'Debe aceptar los términos y condiciones de ingeniería.' });
            return;
        }

        setIsLoading(true);
        try {
            await registerWorkshopOwner({
                userName,
                email,
                pass: password,
                workshopName,
                employeeCount,
                city,
                phone
            });

            toast({ 
                title: '¡Registro Exitoso!', 
                description: 'Configurando su Centro de Mando Certificado... (Simulación de correo activa)' 
            });
            
            const loggedIn = await login(email, password);
            if (loggedIn) {
                window.location.href = '/dashboard';
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error de Registro', description: (error as Error).message });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-primary selection:text-white">
            <div className="w-full max-w-4xl space-y-12">
                
                {/* Progress Header */}
                <div className="flex flex-col items-center space-y-8">
                    <Logo className="scale-125 mb-4" />
                    
                    <div className="flex items-center gap-4 w-full max-w-md">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex-1 flex items-center gap-2">
                                <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-black transition-all border-2",
                                    step >= s ? "bg-primary border-primary text-white shadow-lg" : "bg-white border-slate-300 text-slate-400"
                                )}>
                                    {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                                </div>
                                {s < 3 && <div className={cn("h-1.5 flex-1 rounded-full", step > s ? "bg-primary" : "bg-slate-300")} />}
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex justify-between w-full max-w-md px-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>Cuenta</span>
                        <span>Empresa</span>
                        <span>Finalizar</span>
                    </div>
                </div>

                {/* Wizard Cards */}
                <div className="bg-white rounded-[3rem] shadow-[0_48px_96px_-12px_rgba(0,0,0,0.15)] border-2 border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
                    <div className="p-10 sm:p-16 flex-1">
                        
                        {step === 1 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center space-y-3">
                                    <h1 className="text-4xl font-headline font-black tracking-tighter uppercase text-slate-950">Crear Cuenta</h1>
                                    <p className="text-slate-500 font-bold uppercase text-xs tracking-tight">Inicia tu viaje en el ecosistema de ingeniería.</p>
                                </div>
                                <div className="grid gap-8 max-w-md mx-auto">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nombre Completo</Label>
                                        <Input 
                                            placeholder="Ej: Luis Daniel Pro" 
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            className="h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 font-bold focus-visible:ring-primary/20 text-slate-950" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Email Corporativo</Label>
                                        <Input 
                                            type="email"
                                            placeholder="correo@taller.com" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 font-bold focus-visible:ring-primary/20 text-slate-950" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Contraseña de Seguridad</Label>
                                        <Input 
                                            type="password"
                                            placeholder="••••••••" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 font-bold focus-visible:ring-primary/20 text-slate-950" 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="text-center space-y-3">
                                    <h1 className="text-4xl font-headline font-black tracking-tighter uppercase text-slate-950">Datos del Taller</h1>
                                    <p className="text-slate-500 font-bold uppercase text-xs tracking-tight">Cuéntanos sobre tu centro de servicio.</p>
                                </div>
                                <div className="grid gap-8 max-w-2xl mx-auto">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nombre de la Empresa</Label>
                                            <Input 
                                                placeholder="Taller de Mecánica Pro" 
                                                value={workshopName}
                                                onChange={(e) => setWorkshopName(e.target.value)}
                                                className="h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 font-bold text-slate-950" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Número de Empleados</Label>
                                            <div className="flex gap-2">
                                                {['1-2', '3-15', '16-150', '150+'].map(count => (
                                                    <Button 
                                                        key={count}
                                                        variant="outline"
                                                        type="button"
                                                        onClick={() => setEmployeeCount(count)}
                                                        className={cn(
                                                            "flex-1 h-14 rounded-xl font-black text-xs border-2 transition-all shadow-sm",
                                                            employeeCount === count 
                                                                ? "border-primary bg-primary text-white" 
                                                                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400"
                                                        )}
                                                    >
                                                        {count}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">País</Label>
                                            <Select value={country} onValueChange={setCountry}>
                                                <SelectTrigger className="h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 font-bold text-slate-950">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Colombia">Colombia</SelectItem>
                                                    <SelectItem value="México">México</SelectItem>
                                                    <SelectItem value="Chile">Chile</SelectItem>
                                                    <SelectItem value="Perú">Perú</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Ciudad</Label>
                                            <Input 
                                                placeholder="Ej: Sincelejo" 
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 font-bold text-slate-950" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Teléfono de Contacto</Label>
                                        <Input 
                                            placeholder="+57 310 4545224" 
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 font-bold text-slate-950" 
                                        />
                                        <p className="text-[10px] text-slate-400 font-medium italic mt-2">MecanicaPro enviará mensajes de auditoría técnica por este medio.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-10 animate-in zoom-in duration-500 text-center py-10">
                                <div className="mx-auto bg-emerald-50 text-emerald-600 rounded-[2rem] h-24 w-24 flex items-center justify-center mb-8 shadow-inner border-2 border-emerald-100">
                                    <Target className="h-12 w-12" />
                                </div>
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-headline font-black tracking-tighter uppercase text-slate-950">¡Todo Listo!</h1>
                                    <p className="text-slate-600 font-bold max-w-md mx-auto leading-relaxed">
                                        Estás a un clic de activar el ecosistema digital de <span className="text-primary">{workshopName || 'tu taller'}</span>.
                                    </p>
                                </div>
                                
                                <div className="max-w-sm mx-auto space-y-6">
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-200 flex items-center gap-4 text-left">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Plan Inicial</p>
                                            <p className="font-black text-slate-950 uppercase text-xs tracking-tight">Versión Basic Certificada</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-slate-300 rounded-3xl">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox 
                                                id="terms" 
                                                checked={acceptedTerms} 
                                                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                                                className="h-6 w-6 rounded-lg border-2 border-slate-400 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                            <label htmlFor="terms" className="text-xs font-black text-slate-700 cursor-pointer select-none">
                                                Acepto los <TermsDialog />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Navigation Footer */}
                    <div className="p-10 bg-slate-50 border-t-2 border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="flex gap-4">
                            {step > 1 && (
                                <Button 
                                    variant="ghost" 
                                    onClick={handleBack}
                                    disabled={isLoading}
                                    className="h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-600 hover:bg-slate-200"
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" /> Volver
                                </Button>
                            )}
                            <Button 
                                asChild
                                variant="link"
                                className="h-14 px-4 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-primary"
                            >
                                <Link href="/login">Ya tengo cuenta</Link>
                            </Button>
                        </div>
                        
                        {step < totalSteps ? (
                            <Button 
                                onClick={handleNext}
                                className="h-16 px-12 rounded-[1.5rem] bg-slate-950 text-white hover:bg-primary shadow-2xl transition-all active:scale-95 font-black uppercase tracking-[0.2em] text-xs w-full sm:w-auto"
                            >
                                Continuar <ArrowRight className="ml-3 h-5 w-5" />
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleRegister}
                                disabled={isLoading || !acceptedTerms}
                                className={cn(
                                    "h-16 px-16 rounded-[1.5rem] shadow-2xl transition-all active:scale-95 font-black uppercase tracking-[0.2em] text-xs w-full sm:w-auto",
                                    acceptedTerms ? "bg-slate-950 text-white hover:bg-primary shadow-primary/30" : "bg-slate-300 text-slate-500 cursor-not-allowed border-2 border-slate-400"
                                )}
                            >
                                {isLoading ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Target className="mr-3 h-5 w-5" />}
                                ACTIVAR SISTEMA PRO
                            </Button>
                        )}
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                        Certificación MecanicaPro Global Systems
                    </p>
                </div>
            </div>
        </div>
    );
}

function TermsDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <span className="text-primary underline hover:text-primary/80 transition-colors">Términos y Condiciones</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 border-none overflow-hidden shadow-2xl">
                <DialogHeader className="p-8 bg-slate-950 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <ScrollText className="h-6 w-6 text-primary" />
                        <DialogTitle className="text-2xl font-headline font-black uppercase tracking-tighter">Protocolo Legal de Uso</DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">MecanicaPro Global Systems • Versión 2024.1</DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="max-h-[60vh] p-8 bg-white">
                    <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
                        <section className="space-y-3">
                            <h4 className="font-black text-slate-950 uppercase tracking-tight text-base flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                1. Aceptación del Servicio
                            </h4>
                            <p className="font-medium">
                                Al registrar su taller en MecanicaPro, usted acepta convertirse en un operador certificado de nuestra plataforma SaaS. Este acuerdo rige el uso de todos nuestros módulos técnicos, financieros y de inteligencia artificial.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h4 className="font-black text-slate-950 uppercase tracking-tight text-base flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                2. Política de Verificación y Purga
                            </h4>
                            <p className="font-medium">
                                Para mantener la integridad de nuestra infraestructura de ingeniería, **todo usuario nuevo debe verificar su dirección de correo electrónico en un plazo máximo de 3 días calendario (72 horas)**. Las cuentas que no completen este protocolo de seguridad serán eliminadas automáticamente de nuestros servidores certificados sin previo aviso.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h4 className="font-black text-slate-950 uppercase tracking-tight text-base flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                3. Responsabilidad Técnica
                            </h4>
                            <p className="font-medium">
                                MecanicaPro es una herramienta de asistencia. El taller y sus mecánicos son los únicos responsables de la veracidad de los datos ingresados, el cumplimiento de las órdenes de servicio y la correcta ejecución de los protocolos técnicos OEM. La IA de Vigilancia Tecnológica es una referencia consultiva y no reemplaza el juicio del ingeniero humano.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h4 className="font-black text-slate-950 uppercase tracking-tight text-base flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                4. Propiedad de los Datos
                            </h4>
                            <p className="font-medium">
                                Sus datos operativos son suyos. MecanicaPro garantiza la trazabilidad y seguridad de la información en nuestra base de datos encriptada. Sin embargo, nos reservamos el derecho de utilizar datos anonimizados para mejorar nuestros algoritmos de predicción CRM y modelos de diagnóstico de IA.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h4 className="font-black text-slate-950 uppercase tracking-tight text-base flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                5. Suscripción y Terminación
                            </h4>
                            <p className="font-medium">
                                El incumplimiento de cualquier protocolo de seguridad o el uso indebido de la plataforma (como spam vía WhatsApp VIP) resultará en la desactivación inmediata del nodo de su taller.
                            </p>
                        </section>
                    </div>
                </ScrollArea>

                <DialogFooter className="p-6 bg-slate-50 border-t flex justify-end">
                    <DialogClose asChild>
                        <Button className="rounded-2xl h-12 px-8 bg-slate-950 text-white hover:bg-primary font-black uppercase text-[10px] tracking-widest shadow-xl">
                            Entendido y Conforme
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

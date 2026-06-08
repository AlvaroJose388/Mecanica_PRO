'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, ArrowRight, Home, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginBg = PlaceHolderImages.find(img => img.id === 'login-bg')?.imageUrl || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1080';

  const handleLogin = async () => {
    const cleanEmail = email.trim();
    
    if (!cleanEmail || !password) {
        toast({
            variant: 'destructive',
            title: 'Campos incompletos',
            description: 'Por favor, ingresa tu correo corporativo y contraseña.',
        });
        return;
    }

    setIsLoading(true);
    try {
        const loggedInUser = await login(cleanEmail, password);
        if (loggedInUser) {
          toast({ title: 'Acceso Autorizado', description: `Bienvenido al nodo central, ${loggedInUser.name}.` });
          router.push(loggedInUser.role === 'Mechanic' ? '/orders' : '/dashboard');
        } else {
          toast({
            variant: 'destructive',
            title: 'Error de Credenciales',
            description: 'El correo o la clave no coinciden con nuestros registros.',
          });
          setIsLoading(false);
        }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Fallo Crítico de Nodo',
            description: 'No se pudo establecer conexión con el servidor de seguridad.',
        });
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background selection:bg-primary selection:text-primary-foreground">
      <Link 
        href="/" 
        className="absolute top-6 right-6 z-50 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white bg-slate-950 hover:bg-primary backdrop-blur-xl px-6 py-3.5 rounded-full transition-all border-2 border-white/10 shadow-2xl"
      >
        <Home className="h-3.5 w-3.5" />
        Volver a la Web
      </Link>

      <div className="relative hidden w-1/2 flex-col bg-slate-950 p-12 text-white lg:flex border-r-4 border-primary">
        <div className="absolute inset-0 bg-primary/10 z-10" />
        <Image
          src={loginBg}
          alt="MecanicaPro Certified Center"
          fill
          priority
          className="object-cover grayscale opacity-30 transition-opacity duration-1000"
          data-ai-hint="modern automotive workshop"
        />
        <div className="relative z-20 flex items-center gap-2">
          <Logo className="invert brightness-0 scale-110" />
        </div>
        <div className="relative z-20 mt-auto">
          <div className="space-y-10">
            <h2 className="text-6xl font-headline font-black leading-[0.85] tracking-tighter max-w-lg uppercase italic">
              ESTÁNDAR DE <br/><span className="text-primary not-italic">INGENIERÍA</span> PARA EL TALLER.
            </h2>
            <div className="grid grid-cols-1 gap-5">
                {[
                    "Órdenes de Servicio Digitales",
                    "Inventario de Precisión OEM",
                    "Business Intelligence Real",
                    "Protocolo de Seguridad Anti-Hackeo"
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                        <CheckCircle2 className="h-5 w-5 text-primary" strokeWidth={3} />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
            <footer className="pt-10 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 flex items-center gap-4">
                <span className="h-px w-12 bg-primary"></span>
                Protocolo de Acceso Seguro v2.5
            </footer>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto flex w-full flex-col justify-center space-y-10 sm:w-[520px] bg-white dark:bg-slate-900 p-12 sm:p-16 rounded-[4rem] shadow-[0_48px_96px_-12px_rgba(0,0,0,0.18)] border-2 border-slate-100">
          <div className="flex flex-col space-y-4 text-center">
            <div className="lg:hidden flex justify-center mb-10">
                <Logo className="scale-125" />
            </div>
            <h1 className="text-5xl font-headline font-black tracking-tighter uppercase text-slate-950 dark:text-white leading-none">Panel Central</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-tight opacity-70">
              Ingrese sus credenciales de operador técnico.
            </p>
          </div>

          <div className="grid gap-8">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Email Corporativo</Label>
                <Input
                  id="email"
                  placeholder="usuario@mecanicapro.com"
                  type="email"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-16 bg-white border-2 border-slate-100 focus-visible:ring-primary/20 rounded-3xl px-6 text-base text-slate-950 font-black placeholder:text-slate-300 placeholder:font-bold shadow-sm transition-all focus:border-primary/30"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Contraseña Certificada</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="h-16 bg-white border-2 border-slate-100 focus-visible:ring-primary/20 rounded-3xl px-6 text-base text-slate-950 font-black placeholder:text-slate-300 placeholder:font-bold shadow-sm transition-all focus:border-primary/30"
                />
              </div>
              <Button 
                onClick={handleLogin} 
                disabled={isLoading}
                className="h-20 text-lg font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all rounded-[2rem] mt-4 uppercase tracking-[0.3em] bg-slate-950 text-white hover:bg-primary border-none active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                ) : (
                  <>
                    INICIAR SISTEMAS
                    <ArrowRight className="ml-3 h-6 w-6" strokeWidth={3} />
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-center space-y-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">¿Eres un taller nuevo?</p>
                <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-2 border-slate-100 text-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
                    <Link href="/register">Registrar mi taller certificado</Link>
                </Button>
            </div>
          </div>

          <div className="pt-8 border-t-2 border-slate-50 flex flex-col gap-4">
            <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                <ShieldCheck className="h-5 w-5 text-primary opacity-50" /> 
                Certificación MecanicaPro Global
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, ArrowRight, Home, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginBg = PlaceHolderImages.find(img => img.id === 'login-bg')?.imageUrl || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1080';

  const handleLogin = async () => {
    const cleanEmail = email.trim();
    
    if (!cleanEmail || !password) {
        toast({
            variant: 'destructive',
            title: 'Campos incompletos',
            description: 'Por favor, ingresa tu correo corporativo y contraseña.',
        });
        return;
    }

    setIsLoading(true);
    try {
        const loggedInUser = await login(cleanEmail, password);
        if (loggedInUser) {
          toast({ title: 'Acceso Autorizado', description: `Bienvenido al nodo central, ${loggedInUser.name}.` });
          router.push(loggedInUser.role === 'Mechanic' ? '/orders' : '/dashboard');
        } else {
          toast({
            variant: 'destructive',
            title: 'Error de Credenciales',
            description: 'El correo o la clave no coinciden con nuestros registros.',
          });
          setIsLoading(false);
        }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Fallo Crítico de Nodo',
            description: 'No se pudo establecer conexión con el servidor de seguridad.',
        });
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background selection:bg-primary selection:text-primary-foreground">
      <Link 
        href="/" 
        className="absolute top-6 right-6 z-50 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white bg-slate-950 hover:bg-primary backdrop-blur-xl px-6 py-3.5 rounded-full transition-all border-2 border-white/10 shadow-2xl"
      >
        <Home className="h-3.5 w-3.5" />
        Volver a la Web
      </Link>

      <div className="relative hidden w-1/2 flex-col bg-slate-950 p-12 text-white lg:flex border-r-4 border-primary">
        <div className="absolute inset-0 bg-primary/10 z-10" />
        <Image
          src={loginBg}
          alt="MecanicaPro Certified Center"
          fill
          priority
          className="object-cover grayscale opacity-30 transition-opacity duration-1000"
          data-ai-hint="modern automotive workshop"
        />
        <div className="relative z-20 flex items-center gap-2">
          <Logo className="invert brightness-0 scale-110" />
        </div>
        <div className="relative z-20 mt-auto">
          <div className="space-y-10">
            <h2 className="text-6xl font-headline font-black leading-[0.85] tracking-tighter max-w-lg uppercase italic">
              ESTÁNDAR DE <br/><span className="text-primary not-italic">INGENIERÍA</span> PARA EL TALLER.
            </h2>
            <div className="grid grid-cols-1 gap-5">
                {[
                    "Órdenes de Servicio Digitales",
                    "Inventario de Precisión OEM",
                    "Business Intelligence Real",
                    "Protocolo de Seguridad Anti-Hackeo"
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                        <CheckCircle2 className="h-5 w-5 text-primary" strokeWidth={3} />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
            <footer className="pt-10 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 flex items-center gap-4">
                <span className="h-px w-12 bg-primary"></span>
                Protocolo de Acceso Seguro v2.5
            </footer>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto flex w-full flex-col justify-center space-y-10 sm:w-[520px] bg-white dark:bg-slate-900 p-12 sm:p-16 rounded-[4rem] shadow-[0_48px_96px_-12px_rgba(0,0,0,0.18)] border-2 border-slate-100">
          <div className="flex flex-col space-y-4 text-center">
            <div className="lg:hidden flex justify-center mb-10">
                <Logo className="scale-125" />
            </div>
            <h1 className="text-5xl font-headline font-black tracking-tighter uppercase text-slate-950 dark:text-white leading-none">Panel Central</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-tight opacity-70">
              Ingrese sus credenciales de operador técnico.
            </p>
          </div>

          <div className="grid gap-8">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Email Corporativo</Label>
                <Input
                  id="email"
                  placeholder="usuario@mecanicapro.com"
                  type="email"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-16 bg-white border-2 border-slate-100 focus-visible:ring-primary/20 rounded-3xl px-6 text-base text-slate-950 font-black placeholder:text-slate-300 placeholder:font-bold shadow-sm transition-all focus:border-primary/30"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Contraseña Certificada</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="h-16 bg-white border-2 border-slate-100 focus-visible:ring-primary/20 rounded-3xl px-6 text-base text-slate-950 font-black placeholder:text-slate-300 placeholder:font-bold shadow-sm transition-all focus:border-primary/30"
                />
              </div>
              <Button 
                onClick={handleLogin} 
                disabled={isLoading}
                className="h-20 text-lg font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all rounded-[2rem] mt-4 uppercase tracking-[0.3em] bg-slate-950 text-white hover:bg-primary border-none active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                ) : (
                  <>
                    INICIAR SISTEMAS
                    <ArrowRight className="ml-3 h-6 w-6" strokeWidth={3} />
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-center space-y-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">¿Eres un taller nuevo?</p>
                <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-2 border-slate-100 text-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
                    <Link href="/register">Registrar mi taller certificado</Link>
                </Button>
            </div>
          </div>

          <div className="pt-8 border-t-2 border-slate-50 flex flex-col gap-4">
            <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                <ShieldCheck className="h-5 w-5 text-primary opacity-50" /> 
                Certificación MecanicaPro Global
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

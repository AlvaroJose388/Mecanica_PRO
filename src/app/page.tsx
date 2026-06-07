'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { 
  ArrowRight,
  ShieldCheck,
  Zap,
  PlayCircle,
  ClipboardList,
  Warehouse,
  Network,
  Database,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg')?.imageUrl;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: "Órdenes de Trabajo Pro",
      description: "Trazabilidad absoluta desde la recepción hasta la entrega. Protocolos digitales certificados.",
      icon: ClipboardList,
      color: "bg-blue-600"
    },
    {
      title: "CRM Predictivo",
      description: "No pierdas clientes. Nuestro motor avisa cuándo toca el próximo mantenimiento automáticamente.",
      icon: Zap,
      color: "bg-emerald-600"
    },
    {
      title: "Almacenes de Precisión",
      description: "Control de stock en tiempo real con alertas de reposición basadas en el flujo de órdenes.",
      icon: Warehouse,
      color: "bg-orange-600"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 selection:bg-primary selection:text-white overflow-hidden scroll-smooth">
      {/* Header Glassmorphism */}
      <header className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 border-b",
        scrolled ? "bg-slate-950/90 backdrop-blur-xl border-white/10 py-4" : "bg-transparent border-transparent py-6"
      )}>
        <div className="container flex items-center justify-between mx-auto px-6">
          <Logo className="text-white" />
          <nav className="hidden lg:flex items-center gap-10">
            <Link href="#features" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">Tecnología</Link>
            <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">Acceso Operador</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild className="bg-primary text-white hover:bg-white hover:text-slate-950 rounded-full px-8 font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all">
              <Link href="/register">Empezar Ahora</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center pt-20">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImg!}
              alt="MecanicaPro Engineering"
              fill
              className="object-cover opacity-25 grayscale brightness-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse" />
          </div>
          
          <div className="container relative z-10 mx-auto px-6">
            <div className="max-w-5xl space-y-12">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-6 py-2.5 text-[10px] font-black text-primary border border-white/10 uppercase tracking-[0.4em] backdrop-blur-sm">
                <Zap className="h-4 w-4 animate-pulse" />
                <span>Ecosistema de Ingeniería Automotriz v2.4</span>
              </div>
              
              <h1 className="text-6xl sm:text-8xl lg:text-[120px] font-headline font-black tracking-tighter leading-[0.85] text-white uppercase italic">
                LA ÉLITE DEL <br/><span className="text-primary not-italic">SERVICIO TÉCNICO.</span>
              </h1>
              
              <p className="text-slate-400 text-xl sm:text-2xl max-w-2xl font-medium leading-relaxed">
                Transformamos talleres convencionales en centros de alto rendimiento mediante trazabilidad operativa y CRM predictivo.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
                <Button asChild size="lg" className="h-20 px-16 text-xl font-black bg-primary text-white hover:bg-white hover:text-slate-950 shadow-[0_20px_80px_rgba(229,62,62,0.4)] rounded-[2rem] w-full sm:w-auto transition-all hover:-translate-y-2 uppercase tracking-[0.2em] group border-none">
                  <Link href="/register" className="flex items-center gap-4">
                    Activar mi Taller
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="h-20 px-12 bg-white/5 border-2 border-white/10 text-white hover:bg-white/10 rounded-[2rem] w-full sm:w-auto font-black uppercase text-sm tracking-widest transition-all backdrop-blur-md">
                  <Link href="/login" className="flex items-center gap-3">
                    <PlayCircle className="h-5 w-5 text-primary" /> Ver Demo Pro
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col text-center mb-24 space-y-4">
              <h2 className="text-[11px] font-black text-primary uppercase tracking-[0.5em]">Arquitectura SaaS</h2>
              <h3 className="text-5xl sm:text-7xl font-headline font-black tracking-tighter uppercase text-slate-950 leading-none">Control Total del <br/> Centro de Servicio.</h3>
            </div>
            
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <div key={i} className="group relative bg-slate-50 p-12 rounded-[4rem] border-2 border-slate-100 transition-all hover:bg-white hover:shadow-[0_60px_100px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-3 overflow-hidden">
                  <div className={cn("mb-10 inline-block p-8 rounded-[2rem] text-white shadow-xl transition-all duration-500", feature.color)}>
                    <feature.icon className="h-10 w-10" />
                  </div>
                  <h4 className="text-3xl font-black mb-4 tracking-tight uppercase text-slate-950 italic">{feature.title}</h4>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 py-32 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-24">
            <div className="lg:col-span-2 space-y-10">
              <Logo className="text-white scale-125 origin-left" />
              <p className="text-slate-500 max-w-sm font-medium text-xl leading-relaxed">
                MecanicaPro Global Systems. <br/>Ingeniería de software para la excelencia operativa automotriz.
              </p>
            </div>
            <div className="space-y-10">
              <h5 className="font-black uppercase text-[10px] tracking-[0.4em] text-primary">Plataforma</h5>
              <ul className="space-y-6 font-black text-sm text-slate-400">
                <li><Link href="/register" className="hover:text-white transition-colors">Registrar Taller</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Panel Técnico</Link></li>
              </ul>
            </div>
            <div className="space-y-10">
              <h5 className="font-black uppercase text-[10px] tracking-[0.4em] text-primary">Seguridad</h5>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Certificación Global MecanicaPro</span>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
            <p>© {new Date().getFullYear()} MecanicaPro Inc. Ingeniería Aplicada.</p>
            <div className="flex gap-10">
                <Link href="#" className="hover:text-primary">Privacidad</Link>
                <Link href="#" className="hover:text-primary">Términos</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

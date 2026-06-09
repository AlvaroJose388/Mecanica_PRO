'use client';

import { Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-lg font-bold font-headline select-none", className)}>
      <div className="bg-slate-950 text-primary p-2.5 rounded-3xl shadow-2xl border-2 border-primary/20 flex items-center justify-center transition-all hover:scale-105 group shrink-0">
          <Sparkles className="h-6 w-6 stroke-[3px] group-hover:scale-110 transition-transform" />
      </div>
      
      <div className="flex flex-col -space-y-1.5">
        <span className="truncate max-w-[180px] uppercase tracking-tighter text-inherit text-2xl font-black italic">
          Mecanica<span className="text-primary not-italic">Pro</span>
        </span>
        <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-primary" />
            <span className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.25em] opacity-70">Ingeniería Certificada</span>
        </div>
      </div>
    </div>
  );
}

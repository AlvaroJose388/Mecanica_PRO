import type { ReactNode } from 'react';
import { Wrench, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  icon?: LucideIcon;
};

export function PageHeader({ title, description, icon: Icon, children }: PageHeaderProps) {
  const DisplayIcon = Icon || Wrench;

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-12">
        <div className="flex-1 flex items-center gap-6">
          <div className="h-16 w-16 flex-shrink-0 rounded-[1.25rem] bg-slate-950 text-primary flex items-center justify-center shadow-2xl shadow-slate-200 rotate-3 transition-all hover:rotate-0 hover:scale-110 group border-b-4 border-primary">
              <DisplayIcon className="h-8 w-8 transition-colors" strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-headline font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none">{title}</h1>
            {description && (
              <p className="text-slate-500 text-sm font-bold tracking-tight uppercase opacity-70 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
}

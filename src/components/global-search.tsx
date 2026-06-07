'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Search, User, Wrench, ListTodo, Loader2, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { getClientsForWorkshop } from '@/app/actions/clients';
import { getFullOrdersForWorkshop } from '@/app/actions/orders';
import { getTasksForWorkshop } from '@/app/actions/tasks';
import type { Client, Order, Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

type SearchResult = {
    id: string;
    type: 'order' | 'client' | 'task';
    title: string;
    subtitle: string;
    url: string;
};

export function GlobalSearch() {
    const router = useRouter();
    const { user } = useUser();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const performSearch = async () => {
            if (query.trim().length < 2 || !user?.workshopId) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            setIsSearching(true);
            setIsOpen(true);
            try {
                const [clients, orders, tasks] = await Promise.all([
                    getClientsForWorkshop(user.workshopId),
                    getFullOrdersForWorkshop(user.workshopId),
                    getTasksForWorkshop(user.workshopId)
                ]);

                const term = query.toLowerCase().trim();
                
                const filteredClients: SearchResult[] = clients
                    .filter(c => c.name.toLowerCase().includes(term) || c.email?.toLowerCase().includes(term))
                    .map(c => ({
                        id: c.id,
                        type: 'client',
                        title: c.name,
                        subtitle: `Contacto • ${c.phone}`,
                        url: '/clients'
                    }));

                const filteredOrders: SearchResult[] = orders
                    .filter(o => 
                        o.orderNumber.toLowerCase().includes(term) || 
                        o.client.name.toLowerCase().includes(term) || 
                        (o.vehicle?.plate && o.vehicle.plate.toLowerCase().includes(term))
                    )
                    .map(o => ({
                        id: o.id,
                        type: 'order',
                        title: o.orderNumber,
                        subtitle: `Orden • ${o.client.name} (${o.vehicle?.plate || 'S/P'})`,
                        url: '/orders'
                    }));

                const filteredTasks: SearchResult[] = tasks
                    .filter(t => t.title.toLowerCase().includes(term))
                    .map(t => ({
                        id: t.id,
                        type: 'task',
                        title: t.title,
                        subtitle: `Tarea • ${t.status === 'Completed' ? 'Finalizada' : 'Pendiente'}`,
                        url: '/tasks'
                    }));

                setResults([...filteredOrders, ...filteredClients, ...filteredTasks].slice(0, 8));
            } catch (error) {
                console.error("Search error", error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounce = setTimeout(performSearch, 300);
        return () => clearTimeout(debounce);
    }, [query, user?.workshopId]);

    const handleSelect = (url: string) => {
        router.push(url);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div className="relative w-full max-w-sm" ref={containerRef}>
            <div className="relative group">
                <Search className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                    isOpen ? "text-primary" : "text-muted-foreground"
                )} />
                <Input
                    placeholder="Rastrear sistema... (Orden, Placa, Cliente)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    className="w-full h-10 pl-10 pr-10 rounded-xl bg-slate-100 border-none shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 text-xs font-bold uppercase tracking-tight"
                />
                {query && (
                    <button 
                        onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-900"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            {isOpen && (results.length > 0 || isSearching) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b bg-slate-50">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Resultados del Nodo</p>
                    </div>
                    <ScrollArea className="max-h-[350px]">
                        <div className="p-2 space-y-1">
                            {isSearching && (
                                <div className="p-4 flex items-center justify-center gap-3 text-primary">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Escaneando Base de Datos...</span>
                                </div>
                            )}
                            {!isSearching && results.length > 0 ? results.map((res) => (
                                <button
                                    key={`${res.type}-${res.id}`}
                                    onClick={() => handleSelect(res.url)}
                                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all group text-left"
                                >
                                    <div className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                        res.type === 'order' ? "bg-indigo-50 text-indigo-600" :
                                        res.type === 'client' ? "bg-emerald-50 text-emerald-600" :
                                        "bg-orange-50 text-orange-600"
                                    )}>
                                        {res.type === 'order' ? <Wrench className="h-5 w-5" /> :
                                         res.type === 'client' ? <User className="h-5 w-5" /> :
                                         <ListTodo className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-black text-[11px] text-slate-900 uppercase truncate tracking-tight">{res.title}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{res.subtitle}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-200 group-hover:text-primary transition-colors shrink-0" />
                                </button>
                            )) : !isSearching && (
                                <div className="p-8 text-center text-slate-400 italic font-bold text-xs">
                                    No se encontraron coincidencias técnicas.
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}

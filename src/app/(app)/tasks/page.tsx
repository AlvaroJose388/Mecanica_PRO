'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser } from '@/contexts/user-context';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, ListTodo, Plus, Trash2, Loader2, Calendar } from 'lucide-react';
import { getTasksForWorkshop, createTask, updateTaskStatus, deleteTask } from '@/app/actions/tasks';
import type { Task } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function TasksPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Form state
    const [newTitle, setNewTitle] = useState('');

    const loadTasks = useCallback(async () => {
        if (!user?.workshopId) return;
        setIsLoading(true);
        try {
            const data = await getTasksForWorkshop(user.workshopId);
            setTasks(data);
        } finally {
            setIsLoading(false);
        }
    }, [user?.workshopId]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !user?.workshopId) return;

        setIsSaving(true);
        try {
            await createTask({
                workshopId: user.workshopId,
                title: newTitle,
            });
            setNewTitle('');
            toast({ title: "Tarea creada" });
            await loadTasks();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo crear la tarea.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleStatus = async (task: Task) => {
        const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
        try {
            await updateTaskStatus(task.id, newStatus);
            await loadTasks();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error' });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTask(id);
            await loadTasks();
            toast({ title: "Tarea eliminada" });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <PageHeader 
                title="Tareas Operativas" 
                description="Gestione los recordatorios técnicos y administrativos del taller."
                icon={ListTodo}
            />

            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="p-8 bg-slate-50 border-b">
                    <CardTitle className="text-xl font-headline font-black uppercase tracking-tighter">Nueva Tarea</CardTitle>
                    <CardDescription className="font-bold text-slate-500">Asigne una acción inmediata para el equipo.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={handleAddTask} className="flex gap-4">
                        <Input 
                            placeholder="Ej: Llamar a proveedor de filtros de aceite..."
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            disabled={isSaving}
                            className="h-14 bg-white border-2 border-slate-100 rounded-2xl px-6 text-base text-slate-950 font-bold focus-visible:ring-primary/20 shadow-sm"
                        />
                        <Button disabled={isSaving || !newTitle.trim()} className="h-14 px-8 rounded-2xl bg-slate-950 text-white hover:bg-primary transition-all shadow-xl font-black uppercase text-[10px] tracking-widest">
                            {isSaving ? <Loader2 className="animate-spin" /> : <Plus className="mr-2" />}
                            Añadir
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
                ) : tasks.length > 0 ? (
                    tasks.map(task => (
                        <div key={task.id} className={cn(
                            "group p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between",
                            task.status === 'Completed' ? "bg-slate-50/50 border-slate-100 opacity-60" : "bg-white border-slate-100 shadow-xl hover:border-primary/20"
                        )}>
                            <div className="flex items-center gap-6 flex-1">
                                <Checkbox 
                                    checked={task.status === 'Completed'} 
                                    onCheckedChange={() => handleToggleStatus(task)}
                                    className="h-7 w-7 rounded-full border-2 border-slate-200 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-all"
                                />
                                <div className="space-y-1">
                                    <p className={cn(
                                        "text-base font-black uppercase tracking-tight",
                                        task.status === 'Completed' ? "line-through text-slate-400" : "text-slate-950"
                                    )}>
                                        {task.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <Calendar className="h-3 w-3" />
                                        {format(new Date(task.createdAt), "d 'de' MMMM", { locale: es })}
                                    </div>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDelete(task.id)}
                                className="h-12 w-12 rounded-2xl text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                    ))
                ) : (
                    <div className="py-32 text-center bg-slate-50 border-4 border-dashed border-slate-100 rounded-[3rem]">
                        <ListTodo className="h-16 w-16 mx-auto text-slate-200 mb-6" />
                        <p className="font-black text-slate-300 uppercase tracking-[0.3em] italic">Sin tareas pendientes • Sistema al día</p>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/user-context';
import type { SupportTicket, SupportTicketStatus } from '@/lib/types';
import { createSupportTicket, getTicketsForUser, getAllTickets, updateTicketStatus } from '@/app/actions/support';
import { Loader2, MoreHorizontal, HelpCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function SuperAdminSupportView() {
    const { toast } = useToast();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        try {
            const allTickets = await getAllTickets();
            setTickets(allTickets);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los tickets." });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleStatusChange = async (ticketId: string, status: SupportTicketStatus) => {
        try {
            await updateTicketStatus(ticketId, status);
            toast({ title: "Estado actualizado", description: `El ticket ha sido marcado como ${status === 'Open' ? 'Abierto' : 'Cerrado'}.`});
            await fetchTickets();
        } catch(error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el estado del ticket." });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bandeja de Entrada de Soporte</CardTitle>
                <CardDescription>Todos los tickets enviados por los usuarios del sistema.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8" /></div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Taller</TableHead>
                                <TableHead>Asunto</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.map(ticket => (
                                <TableRow key={ticket.id}>
                                    <TableCell>
                                        <div className="font-medium">{ticket.user?.name}</div>
                                        <div className="text-sm text-muted-foreground">{ticket.user?.email}</div>
                                    </TableCell>
                                    <TableCell>{ticket.workshop?.name || 'N/A'}</TableCell>
                                    <TableCell>{ticket.subject}</TableCell>
                                    <TableCell>
                                        <Badge variant={ticket.status === 'Open' ? 'destructive' : 'secondary'}>
                                            {ticket.status === 'Open' ? 'Abierto' : 'Cerrado'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div title={format(new Date(ticket.createdAt), "PPPpp", { locale: es })}>
                                            {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: es })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'Open')} disabled={ticket.status === 'Open'}>
                                                    Marcar como Abierto
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'Closed')} disabled={ticket.status === 'Closed'}>
                                                    Marcar como Cerrado
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}

function UserSupportView() {
    const { user } = useUser();
    const { toast } = useToast();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const fetchUserTickets = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const userTickets = await getTicketsForUser(user.id);
            setTickets(userTickets);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar tus tickets.' });
        } finally {
            setIsLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        fetchUserTickets();
    }, [fetchUserTickets]);

    const handleSendTicket = async () => {
        if (!subject || !description || !user) {
            toast({ variant: 'destructive', title: 'Campos incompletos', description: 'Por favor, rellena el asunto y la descripción.' });
            return;
        }
        setIsSending(true);
        try {
            await createSupportTicket({ subject, description, userId: user.id, workshopId: user.workshopId });
            setSubject('');
            setDescription('');
            toast({ title: 'Ticket enviado', description: 'Tu solicitud de soporte ha sido enviada.' });
            await fetchUserTickets();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo enviar tu ticket.' });
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Enviar un Ticket de Soporte</CardTitle>
                        <CardDescription>Nuestro equipo te responderá lo antes posible.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Asunto</Label>
                            <Input id="subject" placeholder="Ej: Problema al crear una orden" value={subject} onChange={e => setSubject(e.target.value)} disabled={isSending} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea id="description" placeholder="Por favor, describe el problema en detalle..." className="min-h-[150px]" value={description} onChange={e => setDescription(e.target.value)} disabled={isSending} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSendTicket} disabled={isSending}>
                            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enviar Ticket
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Tus Tickets Recientes</CardTitle>
                        <CardDescription>Revisa el estado de tus solicitudes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin h-6 w-6" /></div> : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Asunto</TableHead>
                                        <TableHead className="text-right">Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tickets.map(ticket => (
                                        <TableRow key={ticket.id}>
                                            <TableCell className="font-medium">{ticket.subject}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={ticket.status === 'Open' ? 'destructive' : 'secondary'}>
                                                    {ticket.status === 'Open' ? 'Abierto' : 'Cerrado'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {!isLoading && tickets.length === 0 && (
                            <p className="text-center text-sm text-muted-foreground py-10">No tienes tickets abiertos.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function SupportPage() {
    const { user, workshop } = useUser();

    if (!user) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div>
            <PageHeader
                title="Soporte"
                description={user.role === 'SuperAdmin' ? 'Supervisa todos los tickets de soporte del sistema.' : 'Obtén ayuda y reporta problemas.'}
                logoUrl={workshop?.logoUrl}
                icon={HelpCircle}
            />
            {user.role === 'SuperAdmin' ? <SuperAdminSupportView /> : <UserSupportView />}
        </div>
    );
}

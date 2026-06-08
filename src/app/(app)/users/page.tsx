
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUser } from '@/contexts/user-context';
import type { User, Role, Workshop } from '@/lib/types';
import { PlusCircle, Trash2, Loader2, Edit, UserCog } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils/get-initials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createUser, updateUser, deleteUser as deleteUserAction } from '@/app/actions/users';
import { getWorkshops, getWorkshopById } from '@/app/actions/workshops';

function UserForm({
    user,
    workshops,
    onSave,
    onCancel,
    isSaving,
    currentUser,
}: {
    user: Partial<User> | null;
    workshops: Workshop[];
    onSave: (data: Partial<User>) => void;
    onCancel: () => void;
    isSaving: boolean;
    currentUser: User;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<User>>({});
  const isSuperAdmin = currentUser.role === 'SuperAdmin';
  
  useEffect(() => {
    if (user) {
        setFormData(user);
        return;
    }

    const initialData: Partial<User> = {
        name: '',
        email: '',
        password: '',
        avatarUrl: '',
    };
    
    if (isSuperAdmin) {
        initialData.role = 'TallerAdmin';
    } else {
        initialData.role = 'Mechanic';
        initialData.workshopId = currentUser.workshopId;
    }
    setFormData(initialData);

  }, [user, isSuperAdmin, currentUser.workshopId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: 'role' | 'workshopId', value: string) => {
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.role || (formData.id === undefined && !formData.password)) {
      toast({ variant: 'destructive', title: 'Error', description: 'Nombre, Email, Rol y Contraseña son obligatorios para usuarios nuevos.' });
      return;
    }

    const dataToSave = { ...formData };

    if (!isSuperAdmin && !dataToSave.id) {
        if (!currentUser.workshopId) {
            toast({ variant: 'destructive', title: 'Error', description: 'No estás asignado a un taller. No puedes crear miembros.' });
            return;
        }
        dataToSave.workshopId = currentUser.workshopId;
    }
    
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" value={formData.name || ''} onChange={handleChange} required disabled={isSaving} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email || ''} onChange={handleChange} required disabled={isSaving} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" placeholder={!!user ? "Dejar en blanco para no cambiar" : ""} onChange={handleChange} required={!user} disabled={isSaving} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Rol</Label>
          <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value as Role)} disabled={isSaving}>
            <SelectTrigger id="role">
                <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
                {isSuperAdmin && <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>}
                {isSuperAdmin && <SelectItem value="TallerAdmin">Admin de Taller</SelectItem>}
                <SelectItem value="Mechanic">Mecánico</SelectItem>
                <SelectItem value="Recepcionista">Recepcionista</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isSuperAdmin && formData.role !== 'SuperAdmin' && (
            <div className="space-y-2">
                <Label htmlFor="workshopId">Taller Asignado</Label>
                <Select value={formData.workshopId || ''} onValueChange={(value) => handleSelectChange('workshopId', value)} disabled={isSaving}>
                    <SelectTrigger id="workshopId">
                        <SelectValue placeholder="Seleccionar taller" />
                    </SelectTrigger>
                    <SelectContent>
                        {workshops.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        )}
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Usuario
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function UsersPage() {
  const { allUsers, user: currentUser, workshop, refreshUsers } = useUser();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const canManageUsers = useMemo(() => {
    if (!currentUser) return false;
    return ['SuperAdmin', 'TallerAdmin'].includes(currentUser.role);
  }, [currentUser]);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
        await refreshUsers();
        if (currentUser?.role === 'SuperAdmin') {
            const fetchedWorkshops = await getWorkshops();
            setWorkshops(fetchedWorkshops);
        } else if (currentUser?.workshopId) {
            const myWorkshop = await getWorkshopById(currentUser.workshopId);
            if (myWorkshop) setWorkshops([myWorkshop]);
        }
    } catch (error) {
      console.error("Failed to load initial data", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los datos."});
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, refreshUsers, toast]);

  useEffect(() => {
    if (canManageUsers) {
      loadInitialData();
    } else {
        setIsLoading(false);
    }
  }, [canManageUsers, loadInitialData]);

  const usersToDisplay = useMemo(() => {
    if (currentUser?.role === 'SuperAdmin') {
        return allUsers;
    }
    if (currentUser?.role === 'TallerAdmin') {
        return allUsers.filter(u => u.workshopId === currentUser.workshopId);
    }
    return [];
  }, [allUsers, currentUser]);

  const handleSaveUser = async (data: Partial<User>) => {
    setIsSaving(true);
    try {
      if (data.id) {
        await updateUser(data.id, data);
        toast({ title: "Usuario actualizado", description: `El usuario "${data.name}" ha sido actualizado.` });
      } else {
        await createUser(data as User);
        toast({ title: "Usuario creado", description: `El usuario "${data.name}" ha sido creado.` });
      }
      await refreshUsers();
      closeForm();
    } catch (error) {
      console.error("Failed to save user", error);
      toast({ variant: "destructive", title: "Error al guardar", description: (error as Error).message });
    } finally {
        setIsSaving(false);
    }
  };

  const openFormForNew = () => {
    setEditingUser(null);
    setFormOpen(true);
  }

  const openFormForEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  }
  
  const closeForm = () => {
    setEditingUser(null);
    setFormOpen(false);
  }

  const handleDeleteUser = async (userToDelete: User) => {
      if (!currentUser) return;
      if (currentUser.role === 'TallerAdmin') {
          if (userToDelete.role !== 'Mechanic' && userToDelete.role !== 'Recepcionista') {
            toast({ variant: 'destructive', title: 'Acción denegada', description: 'No puedes eliminar otros administradores.' });
            return;
          }
      }
      try {
        await deleteUserAction(userToDelete.id);
        await refreshUsers();
        toast({ title: 'Usuario eliminado', description: 'El usuario ha sido eliminado del sistema.' });
      } catch(error) {
        console.error("Failed to delete user", error);
        toast({ variant: "destructive", title: "Error al eliminar", description: (error as Error).message });
      }
  }

  const getRoleBadgeVariant = (role: Role) => {
    const variants: Record<Role, 'default' | 'secondary' | 'outline'> = {
        SuperAdmin: 'default',
        TallerAdmin: 'secondary',
        Mechanic: 'outline',
        Recepcionista: 'outline',
    };
    return variants[role] || 'outline';
  }

  if (!currentUser || isLoading) {
    return (
        <div>
            <PageHeader title="Usuarios" description="Gestiona los usuarios del sistema." icon={UserCog} />
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        </div>
    );
  }

  if (!canManageUsers) {
    return (
        <div>
            <PageHeader title="Acceso Denegado" description="No tienes permisos para ver esta página." icon={UserCog} />
        </div>
    )
  }
  
  const buttonText = currentUser.role === 'SuperAdmin' ? 'Añadir Usuario' : 'Añadir Miembro';
  const dialogTitle = editingUser ? 'Editar Usuario' : (currentUser.role === 'SuperAdmin' ? 'Añadir Nuevo Usuario' : 'Añadir Nuevo Miembro');
  const dialogDescription = editingUser ? 'Actualiza los detalles del usuario.' : (currentUser.role === 'SuperAdmin' ? 'Rellena los detalles para crear una nueva cuenta.' : 'Rellena los detalles del nuevo miembro de tu equipo.');
  
  return (
    <div>
      <PageHeader
        title="Gestión de Usuarios"
        description={currentUser.role === 'SuperAdmin' ? 'Gestiona todos los usuarios del sistema.' : 'Gestiona los usuarios de tu taller.'}
        icon={UserCog}
      >
        <Button onClick={openFormForNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {buttonText}
        </Button>
      </PageHeader>
      <Dialog open={isFormOpen} onOpenChange={closeForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>
            <UserForm
                user={editingUser}
                onSave={handleSaveUser}
                onCancel={closeForm}
                workshops={workshops}
                isSaving={isSaving}
                currentUser={currentUser}
             />
          </DialogContent>
        </Dialog>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {currentUser.role === 'SuperAdmin' ? 'Una lista de todos los usuarios registrados en el sistema.' : 'Una lista de los usuarios de tu taller.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                {currentUser.role === 'SuperAdmin' && <TableHead>Taller</TableHead>}
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersToDisplay.map((user) => {
                const workshopInfo = workshops.find(w => w.id === user.workshopId);
                
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border shadow-sm">
                                <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                    </TableCell>
                    {currentUser.role === 'SuperAdmin' && <TableCell>{workshopInfo?.name || 'N/A'}</TableCell>}
                    <TableCell className="text-right space-x-2">
                       <Button variant="ghost" size="icon" onClick={() => openFormForEdit(user)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                       </Button>
                       <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={user.id === currentUser.id}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Eliminar</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(user)}>Eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/get-initials';
import type { Conversation, User } from '@/lib/types';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { MessageSquarePlus, Search, Trash2, Loader2, Sparkles } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type ExtendedConversation = Conversation & { otherParticipant?: User };

interface ChatListProps {
  conversations: ExtendedConversation[];
  selectedConversation: ExtendedConversation | null;
  onConversationSelect: (conversation: Conversation) => void;
  onConversationDelete: (id: string) => Promise<void>;
  currentUser: User;
  allUsers: User[];
  onStartConversation: (participantId: string) => void;
}

export function ChatList({
  conversations,
  selectedConversation,
  onConversationSelect,
  onConversationDelete,
  allUsers,
  onStartConversation,
}: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [newUserSearchTerm, setNewUserSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredConversations = useMemo(() => {
    if (!searchTerm) {
      return conversations;
    }
    return conversations.filter(conversation =>
      conversation.otherParticipant?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  const filteredUsers = useMemo(() => {
      if (!newUserSearchTerm) {
          return allUsers;
      }
      return allUsers.filter(user => user.name.toLowerCase().includes(newUserSearchTerm.toLowerCase()));
  }, [allUsers, newUserSearchTerm]);

  const handleSelectUser = (userId: string) => {
    onStartConversation(userId);
    setIsNewChatOpen(false);
    setNewUserSearchTerm('');
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setDeletingId(id);
      try {
          await onConversationDelete(id);
      } finally {
          setDeletingId(null);
      }
  }

  const getPreviewText = (text: string) => {
      if (!text) return "Sin registros técnicos...";
      if (text.startsWith('data:image')) return "📷 Evidencia Fotográfica";
      if (text.startsWith('data:video')) return "🎥 Evidencia en Video";
      if (text.startsWith('data:audio')) return "🎤 Reporte de Voz";
      if (text.startsWith('sticker:')) return "✨ Protocolo Rápido";
      if (text.startsWith('[PDF]')) return "📄 Ficha Técnica (PDF)";
      if (text.startsWith('[DOC]')) return "📄 Documento Técnico";
      return text;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b-2 border-slate-50 space-y-5">
        <div className='flex items-center justify-between'>
            <h2 className="font-black text-xl uppercase tracking-tighter text-slate-950 flex items-center gap-2">
                Nodos <Sparkles className="h-4 w-4 text-primary" />
            </h2>
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                <DialogTrigger asChild>
                    <Button className="h-10 w-10 rounded-2xl bg-slate-950 text-white hover:bg-primary shadow-xl transition-all active:scale-95 p-0">
                        <MessageSquarePlus className="h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] sm:max-w-md p-8 border-none shadow-2xl">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-headline font-black uppercase tracking-tighter text-slate-950">Vincular Colega</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Buscar operador técnico..."
                                value={newUserSearchTerm}
                                onChange={e => setNewUserSearchTerm(e.target.value)}
                                className="pl-11 h-12 text-sm rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold"
                            />
                        </div>
                        <ScrollArea className="h-72">
                            <div className="space-y-2 pr-4">
                                {filteredUsers.map(user => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleSelectUser(user.id)}
                                        className="w-full flex items-center gap-4 p-3 rounded-[1.5rem] text-left hover:bg-slate-50 transition-all group"
                                    >
                                        <Avatar className="h-11 w-11 border-2 border-white shadow-md shrink-0">
                                            <AvatarImage src={user.avatarUrl} alt={user.name}/>
                                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="overflow-hidden">
                                            <p className="font-black text-sm truncate text-slate-950 uppercase tracking-tight">{user.name}</p>
                                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{user.role}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
                placeholder="Rastrear conversación..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-11 h-12 bg-slate-50 border-none text-xs font-bold uppercase tracking-tight rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-primary/10"
            />
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <div className="flex flex-col gap-2 py-4">
          {filteredConversations.map(conversation => {
            const lastMsg = conversation.messages[conversation.messages.length - 1];
            const isSelected = selectedConversation?.id === conversation.id;
            
            return (
                <div key={conversation.id} className="relative group">
                    <button
                        className={cn(
                            'flex w-full items-center gap-4 rounded-[2rem] p-4 text-left transition-all pr-12 relative overflow-hidden',
                            isSelected 
                                ? 'bg-slate-950 text-white shadow-2xl scale-[1.02] z-10' 
                                : 'hover:bg-slate-50 border-2 border-transparent'
                        )}
                        onClick={() => onConversationSelect(conversation)}
                    >
                        {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary shadow-[4px_0_15px_rgba(var(--primary),0.5)]"></div>}
                        
                        <div className="relative shrink-0">
                            <Avatar className={cn("h-12 w-12 border-2 shadow-md transition-transform", isSelected ? "border-primary/30" : "border-white")}>
                                <AvatarImage
                                    src={conversation.otherParticipant?.avatarUrl}
                                    alt={conversation.otherParticipant?.name}
                                />
                                <AvatarFallback className="bg-slate-100 text-slate-400 text-xs font-black">
                                    {getInitials(conversation.otherParticipant?.name || 'U')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-black text-[13px] truncate uppercase tracking-tight">
                                    {conversation.otherParticipant?.name}
                                </p>
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest opacity-60",
                                    isSelected ? "text-primary" : "text-slate-400"
                                )}>
                                    {lastMsg && format(new Date(lastMsg.timestamp), "HH:mm")}
                                </span>
                            </div>
                            <p className={cn(
                                "text-[11px] truncate italic font-medium leading-tight",
                                isSelected ? "text-slate-400" : "text-slate-500"
                            )}>
                                {getPreviewText(lastMsg?.text)}
                            </p>
                        </div>
                    </button>
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className={cn(
                                    "absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all h-8 w-8 rounded-xl",
                                    isSelected ? "text-slate-400 hover:text-red-400 hover:bg-white/5" : "text-slate-300 hover:text-destructive hover:bg-red-50"
                                )}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {deletingId === conversation.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent onClick={(e) => e.stopPropagation()} className="rounded-[2.5rem] p-10 border-none shadow-2xl">
                            <AlertDialogHeader className="mb-6">
                                <AlertDialogTitle className="text-2xl font-headline font-black uppercase tracking-tighter text-slate-950">¿Purgar Canal Técnico?</AlertDialogTitle>
                                <AlertDialogDescription className="font-bold text-slate-500">
                                    Se eliminará permanentemente todo el historial de reportes y mensajes de este nodo.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-3">
                                <AlertDialogCancel className="h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2">Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={(e) => handleDelete(e as any, conversation.id)}
                                    className="bg-destructive text-white hover:bg-destructive/90 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl"
                                >
                                    Eliminar Nodo
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )
          })}
           {filteredConversations.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-4 opacity-30">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8" />
                </div>
                <p className="text-[10px] text-slate-900 font-black uppercase tracking-[0.3em] italic">Sin nodos de comunicación activos</p>
            </div>
           )}
        </div>
      </ScrollArea>
    </div>
  );
}

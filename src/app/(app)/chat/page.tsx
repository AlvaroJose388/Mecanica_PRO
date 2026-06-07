'use client';
import {ChatLayout} from '@/components/chat/chat-layout';
import {useUser} from '@/contexts/user-context';
import {useState, useMemo, useEffect, useRef} from 'react';
import type {Message, User, Conversation} from '@/lib/types';
import { UpgradeToPremium } from '@/components/upgrade-to-premium';
import { sendMessage as sendMessageAction, getOrCreateConversation, deleteConversation } from '@/app/actions/chat';
import { PageHeader } from '@/components/page-header';
import { MessageSquare, BellRing } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const {user: currentUser, allUsers, conversations, setConversations, workshop, refreshAllData} = useUser();
  const { toast } = useToast();
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const prevConversationsRef = useRef<Conversation[]>([]);

  // Motor de Sincronización Automática (Polling de alta frecuencia)
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(async () => {
      await refreshAllData(currentUser);
    }, 4000); // 4 segundos para equilibrio entre "tiempo real" y rendimiento

    return () => clearInterval(interval);
  }, [currentUser, refreshAllData]);

  // Sistema de Notificaciones Inteligentes
  useEffect(() => {
    if (prevConversationsRef.current.length > 0 && conversations.length > 0) {
        conversations.forEach(currentConvo => {
            const prevConvo = prevConversationsRef.current.find(c => c.id === currentConvo.id);
            if (prevConvo && currentConvo.messages.length > prevConvo.messages.length) {
                const newMsg = currentConvo.messages[currentConvo.messages.length - 1];
                // Solo notificar si el mensaje NO es mío
                if (newMsg.senderId !== currentUser?.id) {
                    const sender = allUsers.find(u => u.id === newMsg.senderId);
                    toast({
                        title: `Nuevo mensaje de ${sender?.name || 'Colega'}`,
                        description: newMsg.text.length > 50 ? newMsg.text.substring(0, 50) + '...' : newMsg.text,
                        action: <BellRing className="h-4 w-4 text-primary animate-bounce" />
                    });
                }
            }
        });
    }
    prevConversationsRef.current = conversations;
  }, [conversations, currentUser?.id, allUsers, toast]);

  // Sincronizar conversación seleccionada con los datos frescos
  useEffect(() => {
    if (selectedConversation) {
      const updated = conversations.find(c => c.id === selectedConversation.id);
      if (updated && updated.messages.length !== selectedConversation.messages.length) {
        setSelectedConversation(updated);
      }
    } else if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);
  
  const isPremium = useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.role === 'SuperAdmin') return true;
    return workshop?.subscription === 'Premium';
  }, [currentUser, workshop]);
  
  const onSendMessage = async (newMessage: {message: string; conversationId: string}) => {
    if (!currentUser) return;

    const {message, conversationId} = newMessage;
    const conversation = conversations.find(c => c.id === conversationId);

    if (conversation) {
      // Optimización: UI Optimista
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: currentUser.id,
        text: message,
        timestamp: new Date().toISOString(),
      };
      
      const updatedConversation = {
          ...conversation,
          messages: [...conversation.messages, optimisticMessage]
      };
      
      setConversations(prev => prev.map(c => c.id === conversationId ? updatedConversation : c));
      setSelectedConversation(updatedConversation);

      try {
        await sendMessageAction(conversationId, currentUser.id, message);
        await refreshAllData(currentUser);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error de Red', description: 'No se pudo enviar el mensaje al servidor.' });
        // Revertir en caso de falla
         setConversations(prev => prev.map(c => {
            if (c.id === conversationId) {
                return {
                    ...c,
                    messages: c.messages.filter(m => m.id !== optimisticMessage.id)
                };
            }
            return c;
        }));
      }
    }
  };

  const handleStartConversation = async (participantId: string) => {
    if (!currentUser) return;

    try {
        const newConversation = await getOrCreateConversation(currentUser.id, participantId);
        await refreshAllData(currentUser);
        setSelectedConversation(newConversation);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo iniciar el chat técnico.' });
    }
  }

  const handleConversationDelete = async (id: string) => {
      try {
          await deleteConversation(id);
          if (selectedConversation?.id === id) {
              setSelectedConversation(null);
          }
          await refreshAllData(currentUser!);
          toast({ title: 'Nodo de chat purgado' });
      } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar el historial.' });
      }
  }
  
  if (!isPremium) {
    return <UpgradeToPremium featureName="Chat del Taller" />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <PageHeader 
        title="Canales de Comunicación" 
        description="Sincronización técnica en tiempo real con el equipo certificado." 
        icon={MessageSquare}
      />
      <div className="flex-1 overflow-hidden bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-2xl">
        <ChatLayout
          conversations={conversations}
          selectedConversation={selectedConversation}
          onConversationSelect={setSelectedConversation}
          onConversationDelete={handleConversationDelete}
          currentUser={currentUser as User}
          allUsers={allUsers.filter(u => u.id !== currentUser?.id)}
          onSendMessage={onSendMessage}
          onStartConversation={handleStartConversation}
        />
      </div>
    </div>
  );
}

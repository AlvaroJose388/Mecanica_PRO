'use server';

import { db } from '@/lib/db';
import { messages, conversations, conversationParticipants, users } from '@/lib/schema';
import { v4 as uuidv4 } from 'uuid';
import type { Message, Conversation, User } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { and, eq, or, inArray, desc } from 'drizzle-orm';

export async function sendMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
  if (!conversationId || !senderId || !text) {
    throw new Error('Missing conversationId, senderId, or text');
  }

  const newMessage = {
    id: `msg-${uuidv4()}`,
    conversationId,
    senderId,
    text,
    timestamp: new Date(),
  };

  const [result] = await db.insert(messages).values(newMessage).returning();
  
  revalidatePath('/chat');

  return {
    id: result.id,
    senderId: result.senderId,
    text: result.text,
    timestamp: result.timestamp!.toISOString(),
  };
}

export async function deleteMessage(messageId: string): Promise<{ success: boolean }> {
    if (!messageId) throw new Error("ID de mensaje requerido");
    
    await db.delete(messages).where(eq(messages.id, messageId));
    
    revalidatePath('/chat');
    return { success: true };
}

export async function deleteConversation(conversationId: string): Promise<{ success: boolean }> {
    if (!conversationId) throw new Error("ID de conversación requerido");
    
    // El borrado en cascada en el esquema se encarga de mensajes y participantes
    await db.delete(conversations).where(eq(conversations.id, conversationId));
    
    revalidatePath('/chat');
    return { success: true };
}


export async function getOrCreateConversation(userId1: string, userId2: string): Promise<Conversation> {
  const existingConversations = await db.select()
    .from(conversationParticipants)
    .where(inArray(conversationParticipants.userId, [userId1, userId2]))
    .then(rows => {
      const counts: Record<string, number> = {};
      rows.forEach(row => {
        counts[row.conversationId] = (counts[row.conversationId] || 0) + 1;
      });
      return Object.keys(counts).filter(id => counts[id] === 2);
    });

  if (existingConversations.length > 0) {
    const conversationId = existingConversations[0];
    const convo = await db.query.conversations.findFirst({
        where: eq(conversations.id, conversationId),
        with: {
            participants: { with: { user: true }}
        }
    });
    
    if (!convo) throw new Error('Conversation not found despite existing participants record');

    const lastMessages = await db.query.messages.findMany({
        where: eq(messages.conversationId, conversationId),
        orderBy: [desc(messages.timestamp)],
        limit: 50,
    });

     const otherParticipantUser = convo.participants.map(p => p.user).find(u => u.id !== userId1);
     const otherParticipant: Omit<User, 'password' | 'passwordHash'> | undefined = otherParticipantUser ? {
        id: otherParticipantUser.id,
        name: otherParticipantUser.name,
        email: otherParticipantUser.email,
        role: otherParticipantUser.role,
        avatarUrl: otherParticipantUser.avatarUrl,
        workshopId: otherParticipantUser.workshopId,
        createdAt: otherParticipantUser.createdAt ? new Date(otherParticipantUser.createdAt).toISOString() : new Date().toISOString(),
     } : undefined;


    return {
        id: convo.id,
        participantIds: convo.participants.map(p => p.userId),
        messages: lastMessages.reverse().map(m => ({ 
            id: m.id,
            senderId: m.senderId,
            text: m.text,
            timestamp: m.timestamp!.toISOString() 
        })),
        otherParticipant,
    };

  }

  const newConversationId = `convo-${uuidv4()}`;
  await db.insert(conversations).values({ id: newConversationId, createdAt: new Date() });
  
  await db.insert(conversationParticipants).values([
    { conversationId: newConversationId, userId: userId1 },
    { conversationId: newConversationId, userId: userId2 },
  ]);

  const otherParticipantUser = await db.query.users.findFirst({ 
      where: eq(users.id, userId2),
      columns: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          workshopId: true,
      }
  });

  return {
    id: newConversationId,
    participantIds: [userId1, userId2],
    messages: [],
    otherParticipant: otherParticipantUser as Omit<User, 'password' | 'passwordHash'>
  };
}

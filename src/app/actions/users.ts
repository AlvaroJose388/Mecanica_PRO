'use server';

import { db } from '@/lib/db';
import { users, conversations, conversationParticipants, messages } from '@/lib/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import type { User, Conversation } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

export async function getAllUsers(): Promise<User[]> {
  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    avatarUrl: users.avatarUrl,
    workshopId: users.workshopId,
    passwordHash: users.passwordHash,
    createdAt: users.createdAt,
  }).from(users);
  return result.map(({ passwordHash, createdAt, ...user }) => ({
    ...user,
    createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
  })) as User[];
}

export async function createUser(userData: User): Promise<User> {
  const passwordHash = await bcrypt.hash(userData.password!, 10);

  const newUser = {
    id: `user-${uuidv4()}`,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    avatarUrl: userData.avatarUrl,
    workshopId: userData.workshopId,
    passwordHash: passwordHash 
  };
  
  const result = await db.insert(users).values(newUser).returning();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...userToReturn } = result[0];
  return {
    ...userToReturn,
    createdAt: userToReturn.createdAt ? new Date(userToReturn.createdAt).toISOString() : new Date().toISOString(),
  } as User;
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<User> {
  const updateData: any = { ...userData };
  delete updateData.id;

  if (userData.password && userData.password.trim() !== '') {
    updateData.passwordHash = await bcrypt.hash(userData.password, 10);
  }
  delete updateData.password;
  
  const result = await db.update(users).set(updateData).where(eq(users.id, userId)).returning();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...userToReturn } = result[0];
  return {
    ...userToReturn,
    createdAt: userToReturn.createdAt ? new Date(userToReturn.createdAt).toISOString() : new Date().toISOString(),
  } as User;
}

export async function deleteUser(userId: string): Promise<{ success: boolean }> {
  await db.delete(users).where(eq(users.id, userId));
  return { success: true };
}

export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
    const userParticipants = await db.select({
      conversationId: conversationParticipants.conversationId,
    }).from(conversationParticipants).where(eq(conversationParticipants.userId, userId));
  
    const conversationIds = userParticipants.map(uc => uc.conversationId);
    if (conversationIds.length === 0) return [];
  
    // Fetch only the last 20 messages for each conversation to avoid massive payloads
    const allMessages = await db.query.messages.findMany({
        where: (messages, { inArray }) => inArray(messages.conversationId, conversationIds),
        orderBy: (messages, { desc }) => [desc(messages.timestamp)],
        limit: 100, // Total limit across all conversations for this prototype
    });

    const allParticipants = await db.query.conversationParticipants.findMany({
        where: (cp, { inArray }) => inArray(cp.conversationId, conversationIds),
        with: {
            user: {
                columns: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    avatarUrl: true,
                    workshopId: true,
                }
            }
        }
    });

    const convos: Conversation[] = conversationIds.map(convoId => {
      // Filter and sort messages for this specific conversation
      const currentMessages = allMessages
        .filter(m => m.conversationId === convoId)
        .sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
        
      const currentParticipants = allParticipants
        .filter(p => p.conversationId === convoId);
      
      const otherParticipant = currentParticipants.find(p => p.userId !== userId)?.user;
  
      return {
        id: convoId,
        messages: currentMessages.map(m => ({
          id: m.id,
          text: m.text,
          senderId: m.senderId,
          timestamp: m.timestamp!.toISOString(),
        })),
        participantIds: currentParticipants.map(p => p.userId),
        otherParticipant: otherParticipant as Omit<User, 'password' | 'passwordHash'> | undefined,
      };
    });
  
    return convos;
  }

'use client';

import {cn} from '@/lib/utils';
import {Message, User, Conversation} from '@/lib/types';
import {ChatList} from './chat-list';
import {Chat} from './chat';
import type {ComponentProps} from 'react';

type ExtendedConversation = Conversation & { otherParticipant?: User };

interface ChatLayoutProps extends ComponentProps<'div'> {
  conversations: ExtendedConversation[];
  selectedConversation: ExtendedConversation | null;
  currentUser: User;
  allUsers: User[];
  onConversationSelect: (conversation: Conversation) => void;
  onConversationDelete: (id: string) => Promise<void>;
  onSendMessage: (newMessage: {message: string; conversationId: string}) => void;
  onStartConversation: (participantId: string) => void;
}

export function ChatLayout({
  className,
  conversations,
  selectedConversation,
  currentUser,
  allUsers,
  onConversationSelect,
  onConversationDelete,
  onSendMessage,
  onStartConversation,
}: ChatLayoutProps) {
  return (
    <div
      className={cn(
        'h-full w-full border rounded-lg flex overflow-hidden',
        className
      )}
    >
      <div className="flex flex-col w-1/3 border-r">
        <ChatList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onConversationSelect={onConversationSelect}
          onConversationDelete={onConversationDelete}
          currentUser={currentUser}
          allUsers={allUsers}
          onStartConversation={onStartConversation}
        />
      </div>
      <div className="flex-1">
        {selectedConversation ? (
          <Chat
            conversation={selectedConversation}
            currentUser={currentUser}
            onSendMessage={onSendMessage}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm font-medium">
            Selecciona una conversación para empezar a chatear
          </div>
        )}
      </div>
    </div>
  );
}

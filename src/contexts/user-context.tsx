'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { User, Conversation, Workshop } from '@/lib/types';
import { authenticateUser } from '@/app/actions/auth';
import { getConversationsForUser, getAllUsers as fetchAllUsers } from '@/app/actions/users';
import { getWorkshopById } from '@/app/actions/workshops';
import { create } from 'zustand';

interface UserContextType {
  user: (User & { workshop: Workshop | null }) | null;
  workshop: Workshop | null;
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  login: (email: string, pass: string) => Promise<Omit<User, 'password' | 'passwordHash'> | null>;
  logout: () => void;
  updateCurrentUser: (user: User) => void;
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  loading: boolean;
  refreshUsers: () => Promise<void>;
  refreshAllData: (user: User) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Zustand store to allow access to state outside of React components
const useUserStore = create<{ conversations: Conversation[] }>(() => ({
    conversations: [],
}));


export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<(User & { workshop: Workshop | null }) | null>(null);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshUsers = useCallback(async () => {
    try {
        const users = await fetchAllUsers();
        setAllUsers(users);
    } catch (error) {
        console.error("Failed to refresh users", error);
    }
  }, []);

  const refreshAllData = useCallback(async (loggedInUser: User) => {
      // Parallelize all data fetching for speed
      try {
          const workshopPromise = loggedInUser.workshopId 
            ? getWorkshopById(loggedInUser.workshopId) 
            : Promise.resolve(null);
          
          const conversationsPromise = getConversationsForUser(loggedInUser.id);
          const usersPromise = fetchAllUsers();

          const [userWorkshop, userConversations, users] = await Promise.all([
            workshopPromise,
            conversationsPromise,
            usersPromise
          ]);

          setWorkshop(userWorkshop);
          setConversations(userConversations);
          setAllUsers(users);
          useUserStore.setState({ conversations: userConversations });
          setUserState({ ...loggedInUser, workshop: userWorkshop });
      } catch (error) {
          console.error("Error refreshing global data", error);
      }
  }, []);
  
  const updateCurrentUser = useCallback((newUser: User) => {
    const fullUser = { ...newUser, workshop: user?.workshop || null };
    setUserState(fullUser);
    try {
      const userToStore = { ...newUser };
      delete (userToStore as any).password;
      delete (userToStore as any).passwordHash;
      localStorage.setItem('mecanicapro-user', JSON.stringify(userToStore));
    } catch (error) {
      console.error("Could not access localStorage to update user", error);
    }
  }, [user?.workshop]);


  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem('mecanicapro-user');
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          await refreshAllData(parsedUser);
        }
      } catch (error) {
        console.error("Could not initialize user from localStorage", error);
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };
    initializeUser();
  }, [refreshAllData]);

  const login = async (email: string, pass: string): Promise<Omit<User, 'password' | 'passwordHash'> | null> => {
    setLoading(true);
    try {
      const authenticatedUser = await authenticateUser(email, pass);

      if (!authenticatedUser) {
        return null;
      }
      
      await refreshAllData(authenticatedUser as User);
      
      try {
        localStorage.setItem('mecanicapro-user', JSON.stringify(authenticatedUser));
      } catch (error) {
        console.error("Could not access localStorage post-login", error);
      }
      return authenticatedUser;

    } catch (error)      {
      console.error("Login error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    setUserState(null);
    setAllUsers([]);
    setConversations([]);
    setWorkshop(null);
    try {
      localStorage.removeItem('mecanicapro-user');
    } catch (error) {
      console.error("Could not access localStorage", error);
    }
    window.location.href = '/login';
    setLoading(false);
  };

  const value = useMemo(() => ({
    user,
    workshop,
    allUsers,
    setAllUsers,
    login,
    logout,
    updateCurrentUser,
    conversations,
    setConversations,
    loading,
    refreshUsers,
    refreshAllData,
  }), [user, workshop, allUsers, conversations, loading, refreshUsers, updateCurrentUser, refreshAllData]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Export the store's getState method for non-React access
useUser.getState = useUserStore.getState;

// userContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

type User = {
    name: string;
    email: string;
    id: number;
    deletedId: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  deletedId: number | null;
  setDeletedId: (id: number | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userFromCookie = Cookies.get('user');
    if (userFromCookie) {
      try {
        setUser(JSON.parse(userFromCookie));
      } catch (error) {
        console.error("Error parsing user from cookie:", error);
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
    Cookies.remove('token');
    router.push('/');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, deletedId, setDeletedId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

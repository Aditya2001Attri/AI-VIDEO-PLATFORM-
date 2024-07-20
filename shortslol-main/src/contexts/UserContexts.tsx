import { PopulatedUser } from '@shortslol/common';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { jsonStringToUser } from '@/lib';
import { supabase } from '@/lib/supabaseClient';

interface UserContext {
  user: PopulatedUser | null;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<PopulatedUser | null>>;
  logout: () => Promise<void>;
  loadingUser: boolean;
}

const UserContext = createContext<UserContext | null>(null);

const LOCAL_STORAGE_USER_KEY = 'authUser';
const LOCAL_STORAGE_EMAIL_KEY = 'authEmail';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<PopulatedUser | null>(null);

  useEffect(() => {
    const localStorageUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    const localStorageEmail = localStorage.getItem(LOCAL_STORAGE_EMAIL_KEY);

    if (localStorageUser) {
      const savedUser = jsonStringToUser(localStorageUser);
      if (savedUser) {
        setUser(savedUser);
      }
    }

    if (localStorageEmail) {
      setEmail(localStorageEmail);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else if (!user && !loading) {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }

    if (email) {
      localStorage.setItem(LOCAL_STORAGE_EMAIL_KEY, email);
    } else if (!email && !loading) {
      localStorage.removeItem(LOCAL_STORAGE_EMAIL_KEY);
    }
  }, [loading, user, email]);

  const logout = async () => {
    setUser(null);
    setEmail(null);
    setLoading(false);
    await supabase.auth.signOut();
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_EMAIL_KEY);
    window.location.href = '/';
  };

  return (
    <UserContext.Provider
      value={{
        user,
        email,
        setUser,
        setEmail,
        logout,
        loadingUser: loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import { MenuItem, Promotion, Review, ShopSettings } from '@/lib/types';
import { initialMenuItems, initialPromotions, initialReviews, initialShopSettings } from '@/lib/database';

// --- LOCAL STORAGE GENERIC HOOK ---
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, state]);

  return [state, setState];
}


// --- AUTH CONTEXT ---
interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = sessionStorage.getItem('kopimi-auth');
      setIsAuthenticated(storedAuth === 'true');
    }
  }, []);

  const login = (password: string) => {
    // In a real app, you'd verify email and password
    if (password === 'admin123') {
      sessionStorage.setItem('kopimi-auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('kopimi-auth');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// --- DATA CONTEXT ---
interface DataContextType {
  menuItems: MenuItem[];
  promotions: Promotion[];
  reviews: Review[];
  settings: ShopSettings;
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  setSettings: React.Dispatch<React.SetStateAction<ShopSettings>>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

const DataProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [menuItems, setMenuItems] = usePersistentState<MenuItem[]>('kopimi_menu', initialMenuItems);
    const [promotions, setPromotions] = usePersistentState<Promotion[]>('kopimi_promos', initialPromotions);
    const [reviews, setReviews] = usePersistentState<Review[]>('kopimi_reviews', initialReviews);
    const [settings, setSettings] = usePersistentState<ShopSettings>('kopimi_settings', initialShopSettings);
    
    useEffect(() => {
        // This effect ensures we don't have a flash of initial data if localStorage is populated.
        // The usePersistentState hook handles the loading, this just manages the global loading state.
        setIsLoading(false);
    }, []);

  return (
    <DataContext.Provider value={{ menuItems, setMenuItems, promotions, setPromotions, reviews, setReviews, settings, setSettings, isLoading }}>
      {children}
    </DataContext.Provider>
  );
};


// --- MAIN PROVIDERS COMPONENT ---
export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <DataProvider>
        {children}
        <Toaster />
      </DataProvider>
    </AuthProvider>
  );
};

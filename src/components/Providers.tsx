"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import { MenuItem, Promotion, Review, ShopSettings, Barista } from '@/lib/types';
import { initialMenuItems, initialPromotions, initialReviews, initialShopSettings, initialBaristas, initialCategories } from '@/lib/database';

// --- LOCAL STORAGE GENERIC HOOK ---
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state with the initial value to prevent mismatches during server-side rendering
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    // This effect runs only on the client, after initial hydration
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setState(JSON.parse(item));
      } else {
        // If no item in localStorage, initialize it with the default value
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        // No need to setState here as it's already set to initialValue
      }
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      // State is already initialValue
    } finally {
        setIsInitialized(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setPersistedState: React.Dispatch<React.SetStateAction<T>> = (value) => {
    setState((prevState) => {
      const newState = typeof value === 'function' ? (value as (prevState: T) => T)(prevState) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(newState));
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
      return newState;
    });
  };

  return [state, setPersistedState, isInitialized];
}


// --- AUTH CONTEXT ---
interface AuthContextType {
  isAuthenticated: boolean | undefined;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
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
  baristas: Barista[];
  categories: string[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  setSettings: React.Dispatch<React.SetStateAction<ShopSettings>>;
  setBaristas: React.Dispatch<React.SetStateAction<Barista[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

const DataProvider = ({ children }: { children: ReactNode }) => {
    const [menuItems, setMenuItems, menuInitialized] = usePersistentState<MenuItem[]>('kopimi_menu', initialMenuItems);
    const [promotions, setPromotions, promosInitialized] = usePersistentState<Promotion[]>('kopimi_promos', initialPromotions);
    const [reviews, setReviews, reviewsInitialized] = usePersistentState<Review[]>('kopimi_reviews', initialReviews);
    const [settings, setSettings, settingsInitialized] = usePersistentState<ShopSettings>('kopimi_settings', initialShopSettings);
    const [baristas, setBaristas, baristasInitialized] = usePersistentState<Barista[]>('kopimi_baristas', initialBaristas);
    const [categories, setCategories, categoriesInitialized] = usePersistentState<string[]>('kopimi_categories', initialCategories);
    
    const isLoading = !menuInitialized || !promosInitialized || !reviewsInitialized || !settingsInitialized || !baristasInitialized || !categoriesInitialized;

  return (
    <DataContext.Provider value={{ menuItems, setMenuItems, promotions, setPromotions, reviews, setReviews, settings, setSettings, baristas, setBaristas, categories, setCategories, isLoading }}>
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

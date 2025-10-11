
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import { MenuItem, Promotion, Review, ShopSettings, Barista, Schedule, LeaveRequest, JobVacancy, CustomerMessage } from '@/lib/types';
import { initialDatabase } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';
import _ from 'lodash';

// --- DATABASE TYPES ---
type Database = {
  menuItems: MenuItem[];
  promotions: Promotion[];
  reviews: Review[];
  settings: ShopSettings;
  baristas: Barista[];
  categories: string[];
  schedules: Schedule[];
  leaveRequests: LeaveRequest[];
  jobVacancies: JobVacancy[];
  customerMessages: CustomerMessage[];
};

type Setters = {
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  setSettings: React.Dispatch<React.SetStateAction<ShopSettings>>;
  setBaristas: React.Dispatch<React.SetStateAction<Barista[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  setJobVacancies: React.Dispatch<React.SetStateAction<JobVacancy[]>>;
  setCustomerMessages: React.Dispatch<React.SetStateAction<CustomerMessage[]>>;
};

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
    const adminAuth = sessionStorage.getItem('kopimi-auth');
    setIsAuthenticated(adminAuth === 'true');
  }, []);

  const login = (password: string) => {
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
interface DataContextType extends Database, Setters {
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

const DataProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Debounced save function
  const debouncedSave = useCallback(
    _.debounce(async (newDb: Database) => {
      try {
        await fetch('/api/database', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDb),
        });
      } catch (error) {
        console.error('Failed to save data:', error);
        toast({
          variant: 'destructive',
          title: 'Save Error',
          description: 'Could not sync changes with the server.',
        });
      }
    }, 1000), // 1-second debounce delay
    [toast]
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/database');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setDb(data);
      } catch (error) {
        console.error('Error fetching data, using initial data:', error);
        setDb(initialDatabase);
        toast({
          variant: 'destructive',
          title: 'Connection Error',
          description: 'Could not fetch data from server. Displaying local data.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const createSetter = <K extends keyof Database>(key: K): ((value: React.SetStateAction<Database[K]>) => void) => {
    return (value) => {
      setDb(prevDb => {
        if (!prevDb) return null;
        const prevValue = prevDb[key];
        const newValue = typeof value === 'function' ? (value as (prevState: Database[K]) => Database[K])(prevValue) : value;
        
        const newDb = { ...prevDb, [key]: newValue };
        
        // Save the entire updated database to the backend
        debouncedSave(newDb);
        
        return newDb;
      });
    };
  };

  const contextValue: DataContextType = {
    menuItems: db?.menuItems ?? [],
    promotions: db?.promotions ?? [],
    reviews: db?.reviews ?? [],
    settings: db?.settings ?? initialDatabase.settings,
    baristas: db?.baristas ?? [],
    categories: db?.categories ?? [],
    schedules: db?.schedules ?? [],
    leaveRequests: db?.leaveRequests ?? [],
    jobVacancies: db?.jobVacancies ?? [],
    customerMessages: db?.customerMessages ?? [],
    setMenuItems: createSetter('menuItems'),
    setPromotions: createSetter('promotions'),
    setReviews: createSetter('reviews'),
    setSettings: createSetter('settings'),
    setBaristas: createSetter('baristas'),
    setCategories: createSetter('categories'),
    setSchedules: createSetter('schedules'),
    setLeaveRequests: createSetter('leaveRequests'),
    setJobVacancies: createSetter('jobVacancies'),
    setCustomerMessages: createSetter('customerMessages'),
    isLoading: isLoading || !db,
  };

  return (
    <DataContext.Provider value={contextValue}>
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

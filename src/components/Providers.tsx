
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import { MenuItem, Promotion, Review, ShopSettings, Barista, Schedule, LeaveRequest, JobVacancy, CustomerMessage, UserProfile } from '@/lib/types';
import { initialMenuItems, initialPromotions, initialReviews, initialShopSettings, initialBaristas, initialCategories, initialSchedules, initialLeaveRequests, initialJobVacancies, initialCustomerMessages, initialUsers } from '@/lib/database';

// --- LOCAL STORAGE GENERIC HOOK ---
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [isInitialized, setIsInitialized] = useState(false);
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setState(JSON.parse(item));
      } else {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
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
  isAuthenticated: boolean | undefined; // Admin auth
  currentUser: UserProfile | null; // Customer auth
  login: (password: string) => boolean; // Admin login
  logout: () => void; // Admin logout
  customerLogin: (email: string, password: string) => boolean;
  customerRegister: (fullName: string, email: string, password: string) => { success: boolean; message: string };
  customerLogout: () => void;
  addPoints: (userId: string, points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [users, setUsers] = usePersistentState<UserProfile[]>('kopimi_users', initialUsers);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const adminAuth = sessionStorage.getItem('kopimi-auth');
    setIsAuthenticated(adminAuth === 'true');

    const customerAuthId = sessionStorage.getItem('kopimi-customer-auth');
    if (customerAuthId) {
      const user = users.find(u => u.id === customerAuthId);
      setCurrentUser(user || null);
    }
  }, [users, pathname]);

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

  const customerLogin = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        sessionStorage.setItem('kopimi-customer-auth', user.id);
        setCurrentUser(user);
        return true;
    }
    return false;
  };

  const customerRegister = (fullName: string, email: string, password: string) => {
    if (users.find(u => u.email === email)) {
        return { success: false, message: "Email already exists." };
    }
    const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        fullName,
        email,
        password, // In a real app, this should be hashed
        points: 0,
    };
    setUsers(prev => [...prev, newUser]);
    sessionStorage.setItem('kopimi-customer-auth', newUser.id);
    setCurrentUser(newUser);
    return { success: true, message: "Registration successful!" };
  };

  const customerLogout = () => {
    sessionStorage.removeItem('kopimi-customer-auth');
    setCurrentUser(null);
    router.push('/');
  };

  const addPoints = (userId: string, points: number) => {
    setUsers(prevUsers => {
        const newUsers = prevUsers.map(user => 
            user.id === userId ? { ...user, points: user.points + points } : user
        );
        // Also update current user state if they are the one getting points
        if (currentUser?.id === userId) {
            setCurrentUser(prev => prev ? { ...prev, points: prev.points + points } : null);
        }
        return newUsers;
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, customerLogin, customerRegister, customerLogout, addPoints }}>
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
  schedules: Schedule[];
  leaveRequests: LeaveRequest[];
  jobVacancies: JobVacancy[];
  customerMessages: CustomerMessage[];
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
    const [schedules, setSchedules, schedulesInitialized] = usePersistentState<Schedule[]>('kopimi_schedules', initialSchedules);
    const [leaveRequests, setLeaveRequests, leaveRequestsInitialized] = usePersistentState<LeaveRequest[]>('kopimi_leave_requests', initialLeaveRequests);
    const [jobVacancies, setJobVacancies, jobsInitialized] = usePersistentState<JobVacancy[]>('kopimi_jobs', initialJobVacancies);
    const [customerMessages, setCustomerMessages, messagesInitialized] = usePersistentState<CustomerMessage[]>('kopimi_messages', initialCustomerMessages);
    
    const isLoading = !menuInitialized || !promosInitialized || !reviewsInitialized || !settingsInitialized || !baristasInitialized || !categoriesInitialized || !schedulesInitialized || !leaveRequestsInitialized || !jobsInitialized || !messagesInitialized;

  return (
    <DataContext.Provider value={{ 
        menuItems, setMenuItems, 
        promotions, setPromotions, 
        reviews, setReviews, 
        settings, setSettings, 
        baristas, setBaristas, 
        categories, setCategories,
        schedules, setSchedules,
        leaveRequests, setLeaveRequests,
        jobVacancies, setJobVacancies,
        customerMessages, setCustomerMessages,
        isLoading 
    }}>
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

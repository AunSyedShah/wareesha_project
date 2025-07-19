import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService, BackendUser } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'attendee' | 'organizer' | 'exhibitor';
  company?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to convert backend user to frontend user
const convertBackendUser = (backendUser: BackendUser): User => ({
  _id: backendUser._id,
  id: backendUser._id, // For compatibility
  email: backendUser.email,
  name: backendUser.name,
  role: backendUser.role,
  __v: backendUser.__v,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('eventsphere_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('eventsphere_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.status && response.data) {
        const frontendUser = convertBackendUser(response.data);
        setUser(frontendUser);
        localStorage.setItem('eventsphere_user', JSON.stringify(frontendUser));
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const backendData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      };

      const response = await authService.register(backendData);
      
      if (response.status && response.data) {
        const frontendUser = convertBackendUser(response.data);
        setUser(frontendUser);
        localStorage.setItem('eventsphere_user', JSON.stringify(frontendUser));
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventsphere_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
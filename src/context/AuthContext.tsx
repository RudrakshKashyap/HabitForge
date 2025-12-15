import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';

// --- Types ---
export interface User {
  mobile: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (mobile: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
}

// --- Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Provider ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (mobile: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.mobile === mobile);

    if (existingUser) {
      // Login existing user
      if (existingUser.password === password) {
        setUser(existingUser);
        localStorage.setItem('currentUser', JSON.stringify(existingUser));
        return { success: true };
      } else {
        return { success: false, message: "Invalid password" };
      }
    } else {
      // Register new user 
      const newUser: User = { mobile, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
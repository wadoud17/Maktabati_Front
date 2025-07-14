import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (credentials: { login: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // pas besoin de true au démarrage sans token

  const login = async (credentials: { login: string; password: string }) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://localhost:7189/api/Auth/signin',
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const user = response.data;
      setUser(user);

      // facultatif : tu peux enregistrer l’utilisateur localement
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      throw new Error('Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // facultatif : auto-login à partir du localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

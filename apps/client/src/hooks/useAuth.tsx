import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api, setToken, setRefreshToken, clearTokens } from '../services/api';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: any) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('zophiel_token');
    if (token) {
      api.auth
        .me()
        .then(setUser)
        .catch(() => clearTokens())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.auth.login({ email, password });
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const data = await api.auth.register({ email, password, name });
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
  };

  const loginWithGoogle = async (credential: string) => {
    const data = await api.auth.google(credential);
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const updateUser = (data: any) => {
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

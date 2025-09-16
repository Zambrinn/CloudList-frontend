import { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface AuthContextData {
  signed: boolean;
  token: string | null;
  signIn(credentials: object): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storagedToken = localStorage.getItem('authToken');
    if (storagedToken) {
      setToken(storagedToken);
      api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
    }
  }, []);

  async function signIn(credentials: object) {
    try {
      const response = await api.post('/auth/login', credentials);
      const receivedToken = response.data.token;

      setToken(receivedToken);
      api.defaults.headers.Authorization = `Bearer ${receivedToken}`;
      localStorage.setItem('authToken', receivedToken);
    } catch (error) {
      console.error("Falha no login via contexto", error);
      throw new Error("Credenciais inválidas"); 
    }
  }

  function signOut() {
    setToken(null);
    localStorage.removeItem('authToken');
    api.defaults.headers.Authorization = null;
  }

  return (
    <AuthContext.Provider value={{ signed: !!token, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
import { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface AuthContextData {
  signed: boolean;
  signIn(credentials: object): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storagedToken = localStorage.getItem('authToken');

    if (storagedToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
    }
    setIsLoading(false);
  }, []);

  async function signIn(credentials: object) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token } = response.data;

      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    } catch (error) {
      console.error("Falha no login via contexto", error);
      throw new Error("Credenciais inválidas"); 
    }
  }

  function signOut() {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  }

  const signed = !!api.defaults.headers.common.Authorization;

  if (isLoading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ signed, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
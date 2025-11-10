import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/shared/lib/api';
import { LoginDto, AuthResponse, User } from '@/shared/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para validar token e carregar usuário
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fazer chamada para validar o token e obter dados do usuário
        const response = await api.get<{ id: string; email: string }>('/auth/profile');
        setUser(response.data);
        console.log('✅ Token válido, usuário autenticado:', response.data.email);
      } catch (error: any) {
        // Token inválido ou expirado
        console.log('❌ Token inválido ou expirado, removendo do storage');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = async (credentials: LoginDto) => {
    try {
      console.log('🔐 Tentando fazer login...', credentials.email);
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setUser(user);
      console.log('✅ Login bem-sucedido!');
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Tempo de espera esgotado. Tente novamente.');
      } else if (error.response) {
        throw new Error(error.response?.data?.message || 'Erro ao fazer login');
      } else {
        throw new Error('Erro desconhecido ao fazer login');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
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


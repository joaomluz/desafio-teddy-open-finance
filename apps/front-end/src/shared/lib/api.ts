import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos de timeout
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log de erros para debug
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Timeout na requisição:', error.config?.url);
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('🌐 Erro de rede - Verifique se o backend está rodando:', API_URL);
    } else if (!error.response) {
      console.error('❌ Sem resposta do servidor:', error.message);
    }

    // Se for 401 (não autorizado) e não for a rota de profile (para evitar loop)
    // remover token e redirecionar para login
    if (error.response?.status === 401) {
      // Não redirecionar imediatamente se for a rota de profile durante a validação inicial
      // O useAuth já vai lidar com isso
      if (!error.config?.url?.includes('/auth/profile')) {
        localStorage.removeItem('token');
        // Só redirecionar se não estiver já na página de login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;


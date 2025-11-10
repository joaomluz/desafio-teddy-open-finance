export const config = () => {
  // No Docker, DB_HOST deve ser 'postgres' (nome do serviço)
  // Para desenvolvimento local, usar 'localhost'
  const dbHost = process.env.DB_HOST || (process.env.NODE_ENV === 'production' ? 'postgres' : 'localhost');
  
  return {
    database: {
      host: dbHost,
      port: parseInt(process.env.DB_PORT || '5432', 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'clients_db',
    },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
    port: parseInt(process.env.PORT || '3000', 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
  };
};


import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from './config';

const dbConfig = config().database;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  // Desabilitar synchronize para usar apenas migrations
  synchronize: false,
  // NÃO executar migrations automaticamente aqui - serão executadas no Dockerfile
  migrationsRun: false,
  logging: process.env.NODE_ENV === 'development',
};

export const dataSource = new DataSource(dataSourceOptions);


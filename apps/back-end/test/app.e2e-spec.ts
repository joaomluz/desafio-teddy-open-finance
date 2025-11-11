import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { getAuthToken } from './helpers/auth.helper';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Aplicar validação global como no main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Habilitar CORS para testes
    app.enableCors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    await app.init();

    // Obter dataSource para limpeza
    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Obter token de autenticação para testes que requerem auth
    try {
      authToken = await getAuthToken(app);
    } catch (error) {
      console.warn('⚠️ Não foi possível obter token de autenticação. Alguns testes podem falhar.');
    }
  });

  afterAll(async () => {
    // Limpar dados de teste se necessário
    if (dataSource && dataSource.isInitialized) {
      // Aqui você pode adicionar lógica para limpar dados de teste
      // Por exemplo, deletar clientes criados durante os testes
      await dataSource.destroy();
    }
    await app.close();
  });

  describe('Health Check', () => {
    it('/healthz (GET) should return 200', () => {
      return request(app.getHttpServer())
        .get('/healthz')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('timestamp');
        });
    });
  });

  describe('Authentication', () => {
    it('/auth/login (POST) should authenticate with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'admin123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user).toHaveProperty('email');
        });
    });

    it('/auth/login (POST) should return 401 with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Clients - Authentication Required', () => {
    it('/clients (GET) should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .expect(401);
    });

    it('/clients (GET) should return 200 with valid token', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Clients - CRUD Operations', () => {
    let createdClientId: string;

    it('/clients (POST) should create a client with authentication', () => {
      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Client E2E',
          salary: 5000.0,
          companyValue: 200000.0,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Test Client E2E');
          expect(res.body.salary).toBe(5000.0);
          expect(res.body.companyValue).toBe(200000.0);
          createdClientId = res.body.id;
        });
    });

    it('/clients/:id (GET) should return client and increment view count', async () => {
      if (!createdClientId) {
        // Se não criou cliente no teste anterior, criar um agora
        const createResponse = await request(app.getHttpServer())
          .post('/clients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Test Client View',
            salary: 4000.0,
            companyValue: 150000.0,
          })
          .expect(201);
        createdClientId = createResponse.body.id;
      }

      // Primeira visualização
      const firstView = await request(app.getHttpServer())
        .get(`/clients/${createdClientId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('viewCount');
          expect(res.body.viewCount).toBeGreaterThanOrEqual(1);
        });

      const firstViewCount = firstView.body.viewCount;

      // Segunda visualização - deve incrementar
      await request(app.getHttpServer())
        .get(`/clients/${createdClientId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.viewCount).toBe(firstViewCount + 1);
        });
    });

    it('/clients/:id (PUT) should update a client', async () => {
      if (!createdClientId) {
        // Se não criou cliente, criar um agora
        const createResponse = await request(app.getHttpServer())
          .post('/clients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Test Client Update',
            salary: 6000.0,
            companyValue: 250000.0,
          })
          .expect(201);
        createdClientId = createResponse.body.id;
      }

      return request(app.getHttpServer())
        .put(`/clients/${createdClientId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Client Name',
          salary: 7000.0,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdClientId);
          expect(res.body.name).toBe('Updated Client Name');
          expect(res.body.salary).toBe(7000.0);
          // companyValue deve ser mantido se não foi enviado
          expect(res.body.companyValue).toBeDefined();
        });
    });

    it('/clients/:id (DELETE) should perform soft delete', async () => {
      if (!createdClientId) {
        // Se não criou cliente, criar um agora
        const createResponse = await request(app.getHttpServer())
          .post('/clients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Test Client Delete',
            salary: 3000.0,
            companyValue: 100000.0,
          })
          .expect(201);
        createdClientId = createResponse.body.id;
      }

      // Deletar cliente
      await request(app.getHttpServer())
        .delete(`/clients/${createdClientId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verificar que o cliente não aparece mais na listagem
      const listResponse = await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deletedClient = listResponse.body.find(
        (client: any) => client.id === createdClientId,
      );
      expect(deletedClient).toBeUndefined();
    });
  });

  describe('Clients - Validation', () => {
    it('/clients (POST) should return 400 with invalid data', () => {
      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'AB', // Muito curto (min 3)
          salary: -100, // Negativo
          companyValue: 'invalid', // Não é número
        })
        .expect(400);
    });

    it('/clients (POST) should return 400 with missing required fields', () => {
      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Client',
          // Faltando salary e companyValue
        })
        .expect(400);
    });
  });
});


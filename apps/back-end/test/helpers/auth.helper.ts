import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function getAuthToken(
  app: INestApplication,
  email: string = 'admin@example.com',
  password: string = 'admin123',
): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(201);

  return response.body.access_token;
}


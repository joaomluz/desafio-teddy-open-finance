import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  try {
    console.log('🚀 Inicializando aplicação...');
    const app = await NestFactory.create(AppModule);

    // Logger estruturado
    try {
      app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    } catch (error) {
      console.warn('⚠️ Erro ao configurar Winston logger, usando logger padrão:', error.message);
    }

    // CORS
    app.enableCors({
      origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        process.env.FRONTEND_URL || 'http://localhost:5173'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Validação global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    );

    // Exception filter global
    app.useGlobalFilters(new HttpExceptionFilter());

    // Logging interceptor global
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Swagger
    try {
      const config = new DocumentBuilder()
        .setTitle('Sistema de Clientes API')
        .setDescription('API REST para gerenciamento de clientes')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('docs', app, document);
      console.log('📚 Swagger configurado com sucesso');
    } catch (error) {
      console.warn('⚠️ Erro ao configurar Swagger:', error.message);
    }

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/docs`);
    console.log(`✅ Aplicação iniciada com sucesso!`);
  } catch (error) {
    console.error('❌ Erro fatal ao inicializar aplicação:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Erro não tratado no bootstrap:', error);
  process.exit(1);
});

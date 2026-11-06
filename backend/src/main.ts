import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { createValidationPipe } from './common/validation';
import { Env } from './config/env';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<ConfigService<Env, true>>(ConfigService);

  app.setGlobalPrefix('api');
  app.set('trust proxy', 1); // we run behind the nginx reverse proxy
  app.use(helmet({ contentSecurityPolicy: false })); // CSP is handled by nginx
  app.use(cookieParser());
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableShutdownHooks();

  if (config.get('NODE_ENV', { infer: true }) !== 'production') {
    // Local development only: the Vite dev server runs on another origin.
    app.enableCors({ origin: ['http://localhost:5173'], credentials: true });
  }

  const swagger = new DocumentBuilder()
    .setTitle('CraftLink API')
    .setDescription('REST API of the CraftLink marketplace')
    .setVersion('1.0')
    .addCookieAuth(config.get('COOKIE_NAME', { infer: true }))
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swagger));

  const port = config.get('PORT', { infer: true });
  await app.listen(port, '0.0.0.0');
  Logger.log(`API ready on port ${port} (docs: /api/docs)`, 'Bootstrap');
}

void bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  // Configure Helmet with relaxed CSP for development
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'", // Allow inline scripts
            "'unsafe-eval'", // Required for Alpine.js
            'https://cdn.tailwindcss.com',
            'https://unpkg.com',
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'", // Allow inline styles
            'https://cdn.tailwindcss.com',
          ],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"], // For SSE connections
        },
      },
    }),
  );

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(
    `Redis connection: ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
  );
}
bootstrap().catch((err) => console.error(err));

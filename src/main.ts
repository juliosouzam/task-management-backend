import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

interface ServerConfig {
  origin: string;
  port: number;
}

async function bootstrap() {
  const logger = new Logger('bootstrap', true);

  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server') as ServerConfig;

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  if (process.env.NODE_ENV === 'production') {
    app.enableCors({
      origin: serverConfig.origin,
    });
  }

  const PORT = process.env.PORT || serverConfig.port || 3000;

  await app.listen(PORT);

  logger.log(`Application listening on port ${PORT}`);
}
bootstrap();

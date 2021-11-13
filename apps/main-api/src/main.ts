import { AppExceptionFilter, ExceptionInterceptor, LoggerService, SecretsService } from '@libs/shared';
import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { description, name, version } from 'apps/main-api/package.json';

import { MainModule } from './modules/module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, {
    bufferLogs: true,
  });

  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalInterceptors(new ExceptionInterceptor());

  const {
    mainAPI: { PORT },
    ENV,
  } = new SecretsService();

  const loggerService = new LoggerService(ENV);
  app.useLogger(loggerService);

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addTag('Swagger Documentation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  loggerService.log(`🟢 ${name} listening at ${PORT} on ${ENV?.toUpperCase()} 🟢\n`, 'Application');

  await app.listen(PORT);

  loggerService.log(`🔵 Swagger listening at ${await app.getUrl()}/api 🔵 \n`, 'Swaggger');
}
bootstrap();

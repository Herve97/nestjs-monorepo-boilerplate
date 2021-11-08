import { RequestMethod } from '@nestjs/common/enums';
import { NestFactory } from '@nestjs/core';
import { ExceptionInterceptor } from 'apps/libs/modules';
import { AppExceptionFilter } from 'apps/libs/modules';
import { LoggerService } from 'apps/libs/modules/modules/logger/service';
import { SecretsService } from 'apps/libs/modules/modules/secrets/service';
import { name } from 'apps/main-api/package.json';

import { MainModule } from './modules/module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, {
    bufferLogs: true,
  });

  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalInterceptors(new ExceptionInterceptor());

  const { ENV, port } = new SecretsService();

  const loggerService = new LoggerService(ENV);
  app.useLogger(loggerService);

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  loggerService.log(
    `🟢 ${name} listening at ${port.MAIN_API} on ${ENV?.toUpperCase()} 🟢\n`,
    name,
  );

  await app.listen(port.MAIN_API);
}
bootstrap();

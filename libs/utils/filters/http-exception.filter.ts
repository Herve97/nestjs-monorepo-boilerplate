import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import * as moment from 'moment-timezone';

import { LoggerService, SecretsService } from '../../modules';
import { ApiException, ErrorModel } from '../exception';
import * as errorStatus from '../static/htttp-status.json';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: ApiException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    new LoggerService(new SecretsService().ENV).error(exception);

    const code = [exception.code, status, HttpStatus.INTERNAL_SERVER_ERROR].find((c) => c);

    const error: ErrorModel = {
      error: {
        code,
        traceId: exception.uuid,
        message: errorStatus[String(code)] || exception.message,
        timestamp: moment(new Date()).tz(process.env.TZ).format(),
        path: request.url,
      },
    };

    response.status(status).json(error);
  }
}
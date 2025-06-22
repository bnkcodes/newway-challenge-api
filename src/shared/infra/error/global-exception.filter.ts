import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

import { ErrorException } from './error-exception';
import { HttpExceptionMapper } from './http-exception.mapper';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpException: HttpException;

    if (exception instanceof ErrorException) {
      httpException = HttpExceptionMapper.toHttpException(exception);
    } else if (exception instanceof HttpException) {
      httpException = exception;
    } else {
      // Fallback para erros não tratados
      httpException = new HttpException(
        {
          statusCode: 500,
          message: 'Internal server error',
        },
        500,
      );
    }

    const status = httpException.getStatus();
    const exceptionResponse = httpException.getResponse();

    response.status(status).json(exceptionResponse);
  }
}

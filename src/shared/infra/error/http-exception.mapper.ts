import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorException } from './error-exception';
import { ErrorCode } from './error-code';

export class HttpExceptionMapper {
  static toHttpException(error: ErrorException): HttpException {
    let status: HttpStatus;

    switch (error.code) {
      case ErrorCode.BadRequest:
        status = HttpStatus.BAD_REQUEST;
        break;
      case ErrorCode.NotFound:
        status = HttpStatus.NOT_FOUND;
        break;
      case ErrorCode.Unauthorized:
        status = HttpStatus.UNAUTHORIZED;
        break;
      case ErrorCode.Forbidden:
        status = HttpStatus.FORBIDDEN;
        break;
      case ErrorCode.ConflictError:
        status = HttpStatus.CONFLICT;
        break;
      case ErrorCode.ValidationError:
        status = HttpStatus.BAD_REQUEST;
        break;
      case ErrorCode.InternalServerError:
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }

    return new HttpException(
      {
        statusCode: status,
        message: error.message,
      },
      status,
    );
  }
}

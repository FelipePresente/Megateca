import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiResponse } from '@/types/responses/ApiResponse';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        exceptionResponse &&
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        const rawMessage = (exceptionResponse as { message: string | string[] }).message;
        message = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage;
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.stack ?? exception.message);
      message = exception.message;
    }

    const body: ApiResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }
}

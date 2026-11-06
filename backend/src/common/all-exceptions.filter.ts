import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ErrorCode } from './error-codes';

interface ErrorBody {
  statusCode: number;
  code: ErrorCode;
  message: string;
  details?: unknown;
  path: string;
  timestamp: string;
}

const CODE_BY_STATUS: Record<number, ErrorCode> = {
  400: 'VALIDATION_ERROR',
  401: 'AUTH_UNAUTHENTICATED',
  403: 'AUTH_FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  429: 'RATE_LIMITED',
};

/**
 * Turns every error into the same JSON shape:
 * { statusCode, code, message, details?, path, timestamp }
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: ErrorCode = 'INTERNAL_ERROR';
    let message = 'Internal server error';
    let details: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'object' && body !== null) {
        const b = body as Record<string, unknown>;
        code = (b.code as ErrorCode) ?? CODE_BY_STATUS[status] ?? 'INTERNAL_ERROR';
        message = typeof b.message === 'string' ? b.message : code;
        details = b.details ?? (Array.isArray(b.message) ? b.message : undefined);
      } else {
        code = CODE_BY_STATUS[status] ?? 'INTERNAL_ERROR';
        message = String(body);
      }
    } else if (this.isPrismaError(exception, 'P2002')) {
      status = HttpStatus.CONFLICT;
      code = 'CONFLICT';
      message = 'Unique constraint violated';
    } else if (this.isPrismaError(exception, 'P2025')) {
      status = HttpStatus.NOT_FOUND;
      code = 'NOT_FOUND';
      message = 'Record not found';
    } else {
      this.logger.error(
        exception instanceof Error ? (exception.stack ?? exception.message) : String(exception),
      );
    }

    const payload: ErrorBody = {
      statusCode: status,
      code,
      message,
      ...(details !== undefined ? { details } : {}),
      path: request.url,
      timestamp: new Date().toISOString(),
    };
    response.status(status).json(payload);
  }

  private isPrismaError(exception: unknown, prismaCode: string): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      (exception as { code?: unknown }).code === prismaCode
    );
  }
}

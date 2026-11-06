import { HttpException } from '@nestjs/common';
import { ErrorCode } from './error-codes';

/**
 * The only exception type business code should throw.
 *
 *   throw new AppError('REQUEST_INVALID_TRANSITION', 409);
 *   throw new AppError('NOT_FOUND', 404, 'Listing not found');
 */
export class AppError extends HttpException {
  constructor(
    public readonly code: ErrorCode,
    status: number,
    message?: string,
    public readonly details?: unknown,
  ) {
    super({ code, message: message ?? code, details }, status);
  }
}

import { ValidationError, ValidationPipe } from '@nestjs/common';
import { AppError } from './app-error';

function flatten(errors: ValidationError[], parent = ''): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const e of errors) {
    const path = parent ? `${parent}.${e.property}` : e.property;
    if (e.constraints) out[path] = Object.values(e.constraints);
    if (e.children?.length) Object.assign(out, flatten(e.children, path));
  }
  return out;
}

/**
 * Global validation for every DTO (class-validator):
 *  - unknown properties are rejected,
 *  - payloads are transformed to the DTO types,
 *  - failures become a VALIDATION_ERROR with `details` = { field: [messages] }.
 */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) =>
      new AppError('VALIDATION_ERROR', 400, 'Validation failed', flatten(errors)),
  });
}

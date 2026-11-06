/**
 * Every error returned by the API carries one of these stable codes.
 * The frontend translates the code (errors.<CODE> in the locale files),
 * so NEVER rely on the human-readable message in the UI.
 */
export const ERROR_CODES = [
  'INTERNAL_ERROR',
  'VALIDATION_ERROR',
  'NOT_FOUND',
  'CONFLICT',
  'RATE_LIMITED',
  'AUTH_UNAUTHENTICATED',
  'AUTH_INVALID_CREDENTIALS',
  'AUTH_FORBIDDEN',
  'AUTH_EMAIL_TAKEN',
  'REQUEST_INVALID_TRANSITION',
  'REQUEST_CRAFTSMAN_UNAVAILABLE',
  'REVIEW_NOT_ALLOWED',
  'FRIENDSHIP_ALREADY_EXISTS',
  'FRIENDSHIP_NOT_ALLOWED',
  'CHAT_NOT_ALLOWED',
  'UPLOAD_INVALID_TYPE',
  'UPLOAD_TOO_LARGE',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

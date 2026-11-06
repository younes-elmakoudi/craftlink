/** Mirrors the Prisma enums of the backend. Keep both in sync. */
export type Role = 'CUSTOMER' | 'CRAFTSMAN' | 'ADMIN';
export type Language = 'EN' | 'FR' | 'ES';
export type RequestStatus =
  'PENDING' | 'ACCEPTED' | 'DECLINED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type PriceType = 'HOURLY' | 'FIXED';
export type FriendshipStatus = 'PENDING' | 'ACCEPTED';

/** Paginated list envelope returned by every list endpoint. */
export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

/** Error body returned by the backend. */
export interface ApiErrorBody {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
}

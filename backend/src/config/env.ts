import { z } from 'zod';

/**
 * Single source of truth for environment variables.
 * The application refuses to start if a variable is missing or invalid,
 * so configuration mistakes are caught at boot, not in the middle of a demo.
 *
 * To add a variable: add it here, in `.env.example` and in the README table.
 */
const bool = z.enum(['true', 'false']).transform((v) => v === 'true');

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  COOKIE_NAME: z.string().default('craftlink_token'),
  COOKIE_SECURE: bool.default(true),

  /** Public URL of the application (used for OAuth callbacks). */
  APP_URL: z.string().default('https://localhost:8443'),

  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(5),

  OAUTH_GITHUB_CLIENT_ID: z.string().optional(),
  OAUTH_GITHUB_CLIENT_SECRET: z.string().optional(),

  SEED_ON_START: bool.default(true),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const problems = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(
      `Invalid environment configuration:\n${problems}\n` +
        'Copy .env.example to .env and fill the missing values.',
    );
  }
  return result.data;
}

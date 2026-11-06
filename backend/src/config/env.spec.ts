import { validateEnv } from './env';

describe('validateEnv', () => {
  const valid = {
    DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
    JWT_SECRET: 'a-secret-with-at-least-16-chars',
  };

  it('applies defaults to optional variables', () => {
    const env = validateEnv(valid);
    expect(env.PORT).toBe(3000);
    expect(env.COOKIE_SECURE).toBe(true);
    expect(env.SEED_ON_START).toBe(true);
  });

  it('parses booleans and numbers from strings', () => {
    const env = validateEnv({ ...valid, PORT: '4000', COOKIE_SECURE: 'false' });
    expect(env.PORT).toBe(4000);
    expect(env.COOKIE_SECURE).toBe(false);
  });

  it('refuses a missing or weak JWT secret with a helpful message', () => {
    expect(() => validateEnv({ DATABASE_URL: valid.DATABASE_URL })).toThrow(/JWT_SECRET/);
    expect(() => validateEnv({ ...valid, JWT_SECRET: 'short' })).toThrow(/at least 16/);
  });
});

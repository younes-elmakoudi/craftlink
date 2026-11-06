// Runs before every test file: gives ConfigModule the variables it validates at import time.
process.env.DATABASE_URL ??= 'postgresql://user:pass@localhost:5432/test';
process.env.JWT_SECRET ??= 'a-test-secret-of-at-least-16-chars';

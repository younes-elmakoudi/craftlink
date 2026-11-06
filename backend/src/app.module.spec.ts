import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

describe('AppModule', () => {
  it('wires every module together (no database needed)', async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn(), $disconnect: jest.fn(), $queryRaw: jest.fn() })
      .compile();

    expect(moduleRef.get(PrismaService)).toBeDefined();
    await moduleRef.close();
  });
});

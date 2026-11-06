import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  async function build(queryRaw: jest.Mock): Promise<HealthController> {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: { $queryRaw: queryRaw } }],
    }).compile();
    return moduleRef.get(HealthController);
  }

  it('reports ok when the database answers', async () => {
    const controller = await build(jest.fn().mockResolvedValue([{ '?column?': 1 }]));
    await expect(controller.check()).resolves.toMatchObject({ status: 'ok', database: 'up' });
  });

  it('reports degraded when the database is unreachable', async () => {
    const controller = await build(jest.fn().mockRejectedValue(new Error('down')));
    await expect(controller.check()).resolves.toMatchObject({
      status: 'degraded',
      database: 'down',
    });
  });
});

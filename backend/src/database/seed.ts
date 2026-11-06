/**
 * Demo data. Safe to run many times (idempotent): it never duplicates anything.
 *
 *   npm run db:seed          (local, after `npm run build`)
 *   SEED_ON_START=true       (Docker: runs automatically at container start)
 *
 * All demo accounts use the password below. NEVER use it for anything real.
 */
import { PrismaClient, PriceType, RequestStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();
const DEMO_PASSWORD = 'Password123!';

const TRADES = [
  'plumbing',
  'electricity',
  'painting',
  'carpentry',
  'tiling',
  'hvac',
  'locksmith',
  'masonry',
];

const CRAFTSMEN = [
  {
    email: 'youssef.plumber@craftlink.test',
    name: 'Youssef El Idrissi',
    city: 'Rabat',
    trade: 'plumbing',
    bio: 'Plumber with 12 years of experience: leaks, water heaters, bathrooms.',
    price: 150,
  },
  {
    email: 'sara.electrician@craftlink.test',
    name: 'Sara Benali',
    city: 'Salé',
    trade: 'electricity',
    bio: 'Certified electrician: installations, repairs, safety checks.',
    price: 180,
  },
  {
    email: 'karim.painter@craftlink.test',
    name: 'Karim Alaoui',
    city: 'Casablanca',
    trade: 'painting',
    bio: 'Interior and exterior painting, clean and on time.',
    price: 120,
  },
];

async function main(): Promise<void> {
  const passwordHash = await argon2.hash(DEMO_PASSWORD);

  for (const slug of TRADES) {
    await prisma.trade.upsert({ where: { slug }, update: {}, create: { slug } });
  }

  await prisma.user.upsert({
    where: { email: 'admin@craftlink.test' },
    update: {},
    create: { email: 'admin@craftlink.test', passwordHash, role: 'ADMIN', displayName: 'Admin' },
  });

  const customers = [];
  for (const [email, displayName] of [
    ['customer1@craftlink.test', 'Amina Customer'],
    ['customer2@craftlink.test', 'Omar Customer'],
  ]) {
    customers.push(
      await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, passwordHash, role: 'CUSTOMER', displayName },
      }),
    );
  }

  const listings = [];
  for (const c of CRAFTSMEN) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: { email: c.email, passwordHash, role: 'CRAFTSMAN', displayName: c.name },
    });
    const profile = await prisma.craftsmanProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, city: c.city, bio: c.bio },
    });
    const trade = await prisma.trade.findUniqueOrThrow({ where: { slug: c.trade } });
    let listing = await prisma.serviceListing.findFirst({
      where: { craftsmanId: profile.id, tradeId: trade.id },
    });
    if (!listing) {
      listing = await prisma.serviceListing.create({
        data: {
          craftsmanId: profile.id,
          tradeId: trade.id,
          title: `${c.trade[0].toUpperCase()}${c.trade.slice(1)} services in ${c.city}`,
          description: c.bio,
          priceType: PriceType.HOURLY,
          basePrice: c.price,
        },
      });
    }
    listings.push({ listing, profile, user });
  }

  // A small realistic history: only created on an empty database.
  if ((await prisma.serviceRequest.count()) === 0) {
    const [first, second] = listings;
    const done = await prisma.serviceRequest.create({
      data: {
        customerId: customers[0].id,
        craftsmanId: first.profile.id,
        listingId: first.listing.id,
        title: 'Leaking kitchen tap',
        description: 'The tap under the sink drips all day.',
        address: '12 Rue Atlas',
        city: 'Rabat',
        status: RequestStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
    await prisma.requestStatusHistory.createMany({
      data: [
        { requestId: done.id, fromStatus: null, toStatus: 'PENDING', changedById: customers[0].id },
        {
          requestId: done.id,
          fromStatus: 'PENDING',
          toStatus: 'ACCEPTED',
          changedById: first.user.id,
        },
        {
          requestId: done.id,
          fromStatus: 'ACCEPTED',
          toStatus: 'IN_PROGRESS',
          changedById: first.user.id,
        },
        {
          requestId: done.id,
          fromStatus: 'IN_PROGRESS',
          toStatus: 'COMPLETED',
          changedById: first.user.id,
        },
      ],
    });
    await prisma.review.create({
      data: {
        requestId: done.id,
        authorId: customers[0].id,
        rating: 5,
        comment: 'Fast and clean work.',
      },
    });
    await prisma.craftsmanProfile.update({
      where: { id: first.profile.id },
      data: { averageRating: 5, reviewCount: 1 },
    });

    const pending = await prisma.serviceRequest.create({
      data: {
        customerId: customers[1].id,
        craftsmanId: second.profile.id,
        listingId: second.listing.id,
        title: 'Install two ceiling lights',
        description: 'Living room, wiring already in place.',
        address: '8 Avenue Hassan II',
        city: 'Salé',
      },
    });
    await prisma.requestStatusHistory.create({
      data: {
        requestId: pending.id,
        fromStatus: null,
        toStatus: 'PENDING',
        changedById: customers[1].id,
      },
    });
  }

  console.log('Seed completed. Demo password for every account:', DEMO_PASSWORD);
}

void main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

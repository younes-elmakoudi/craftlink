import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CraftsmenModule } from './modules/craftsmen/craftsmen.module';
import { RequestsModule } from './modules/requests/requests.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { FriendsModule } from './modules/friends/friends.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { AdminModule } from './modules/admin/admin.module';
import { RealtimeModule } from './modules/realtime/realtime.module';

/**
 * Every domain module is registered here once, so feature branches never need
 * to edit this file (and never conflict on it).
 */
@Module({
  imports: [
    // Reads ../.env in local development; in Docker the variables are injected.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env', '.env'],
      validate: validateEnv,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CraftsmenModule,
    RequestsModule,
    ReviewsModule,
    FriendsModule,
    ChatModule,
    NotificationsModule,
    UploadsModule,
    AdminModule,
    RealtimeModule,
  ],
})
export class AppModule {}

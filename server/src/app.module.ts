import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import AuthModule from './auth/auth.module';
import UsersModule from './user/users.module';
import RoleService from './roles/role.service';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 10,  // 10 requisições por minuto por IP (global)
      },
    ]),
    AuthModule,
    UsersModule,
    BookModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    RoleService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import AuthModule from './auth/auth.module';
import RoleService from './roles/role.service';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, RoleService],
  exports: [PrismaService],
})
export class AppModule {}

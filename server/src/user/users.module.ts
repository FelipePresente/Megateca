import { Module } from '@nestjs/common';
import UsersController from './users.controller';
import UsersService from './users.service';
import AuthGuard from 'src/auth/guards/auth.guard';
import RolesGuard from 'src/auth/guards/roles.guard';
import { PrismaService } from 'src/prisma.service';
import AuthModule from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard, RolesGuard, PrismaService],
  exports: [UsersService],
})
export default class UsersModule {}

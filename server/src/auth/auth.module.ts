import { Module } from '@nestjs/common';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import PasswordService from 'src/helpers/password.service';
import TokenService from 'src/helpers/token.service';
import CookieService from 'src/helpers/cookie.service';
import RolesGuard from './guards/roles.guard';
import AuthGuard from './guards/auth.guard';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    CookieService,
    RolesGuard,
    AuthGuard,
    PrismaService,
  ],
  exports: [AuthService, RolesGuard, AuthGuard, PasswordService, TokenService, CookieService],
})
export default class AuthModule {}

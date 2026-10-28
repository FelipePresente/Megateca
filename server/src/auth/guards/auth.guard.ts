import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { PrismaService } from "src/prisma.service";
import UserDto from '@/types/user/UserDto';
import type { Request, Response } from "express";
import TokenService from "src/helpers/token.service";
import { AUTH_CONFIG } from "../auth.config";

@Injectable()
export default class AuthGuard implements CanActivate {
    constructor(
        private prisma: PrismaService,
        private tokenService: TokenService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        const token = request.cookies?.[AUTH_CONFIG.cookieName];

        if (!token) throw new UnauthorizedException("Authentication required");

        try {
            const decodedUser = this.tokenService.decodeToken(token) as UserDto;

            const userFromDB = await this.prisma.user.findUnique({
                where: { id: decodedUser.id },
                include: { role: true }
            });

            if (!userFromDB) {
                response.clearCookie(AUTH_CONFIG.cookieName);
                throw new UnauthorizedException("User no longer exists");
            }

            (request as any)['user'] = userFromDB;

            return true;
        } catch (error) {
            response.clearCookie(AUTH_CONFIG.cookieName);
            if (error instanceof Error && error.message === 'TOKEN_EXPIRED') {
                throw new UnauthorizedException("Token has expired");
            }
            if (error instanceof Error && error.message === 'INVALID_TOKEN') {
                throw new UnauthorizedException("Invalid token");
            }
            if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedException("Invalid or expired token");
            }
            console.error("Auth guard error:", error);
            throw new BadRequestException("Authentication failed");
        }
    }
}
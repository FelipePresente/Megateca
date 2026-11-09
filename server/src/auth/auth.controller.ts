import { Controller, Post, Body, Res, HttpCode, HttpStatus, UseGuards, Req } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import AuthService from "./auth.service";
import LoginDto from "./dto/loginDto";
import type { Response } from "express";
import type { ApiResponse } from "@/types/responses/ApiResponse";
import type { DefaultResponse } from "@/types/responses/DefaultResponse";
import CookieService from "src/helpers/cookie.service";
import { AUTH_CONFIG } from "./auth.config";

@Controller('auth')
export default class AuthController {
    constructor(
        private authService: AuthService,
        private cookieService: CookieService
    ) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 tentativas de login por minuto por IP
    async login(
        @Body() userToLogin: LoginDto,
        @Res({ passthrough: true }) response: Response
    ): Promise<ApiResponse<{ token: string }>> {
        const token = await this.authService.login(userToLogin)

        this.cookieService.setupAuthCookie(response, token)

        return {
            success: true,
            message: "Login successful",
            data: { token },
            timestamp: new Date().toISOString(),
        }
    }

    @Post('/logout')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 logout por minuto por IP
    async logout(
        @Res({ passthrough: true }) response: Response
    ): Promise<ApiResponse> {
        response.clearCookie(AUTH_CONFIG.cookieName);

        return {
            success: true,
            message: "Logout successful",
            timestamp: new Date().toISOString(),
        }
    }
}
import { Controller, Post, Body, Res, HttpCode, HttpStatus } from "@nestjs/common";
import AuthService from "./auth.service";
import LoginDto from "./dto/loginDto";
import type { Response } from "express";
import type DefaultResponse from "@/types/responses/DefaultResponse";
import CookieService from "src/helpers/cookie.service";

@Controller('auth')
export default class AuthController {
    constructor(
        private authService: AuthService,
        private cookieService: CookieService
    ) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() userToLogin: LoginDto,
        @Res({ passthrough: true }) response: Response
    ): Promise<DefaultResponse> {
        const token = await this.authService.login(userToLogin)

        this.cookieService.setupAuthCookie(response, token)

        return { message: "Login successful" }
    }
}
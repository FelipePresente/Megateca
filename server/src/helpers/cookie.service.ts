import { Injectable } from "@nestjs/common";
import type { Response } from "express";
import { AUTH_CONFIG } from "src/auth/auth.config";

@Injectable()
export default class CookieService {
    setupAuthCookie(response: Response, token: string) {
        response.cookie(AUTH_CONFIG.cookieName, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: AUTH_CONFIG.cookieMaxAge
        })
    }
}
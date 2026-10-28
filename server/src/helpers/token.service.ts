import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import UserDto from '@/types/user/UserDto';
import { AUTH_CONFIG } from 'src/auth/auth.config';

@Injectable()
export default class TokenService {
    decodeToken(token: string): UserDto {
        try {
            const decodedUser = jwt.verify(token, AUTH_CONFIG.jwtSecret)
            return decodedUser as UserDto
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('TOKEN_EXPIRED');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('INVALID_TOKEN');
            }
            throw error;
        }
    }

    generateToken(userToView: UserDto) {
        const token = jwt.sign(userToView, AUTH_CONFIG.jwtSecret, {
            expiresIn: AUTH_CONFIG.jwtExpiration
        })

        return token as string
    }
}
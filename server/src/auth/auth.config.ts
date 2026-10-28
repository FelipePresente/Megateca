import 'dotenv/config'

if (!process.env.SECRET_KEY) {
    throw new Error('CRITICAL ERROR: SECRET_KEY is missing in .env file!')
}

export const AUTH_CONFIG = {
    jwtSecret: process.env.SECRET_KEY as string,
    jwtExpiration: '14d' as const,
    cookieMaxAge: 14 * 24 * 60 * 60 * 1000,
    cookieName: 'access_token'
} as const;
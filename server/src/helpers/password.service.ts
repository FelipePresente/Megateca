import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcryptjs'

@Injectable()
export default class PasswordService {
    async hash(password: string) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
        return await bcrypt.hash(password, saltRounds)
    }

    async compare(password: string, hash: string) {
        return await bcrypt.compare(password, hash)
    }
}
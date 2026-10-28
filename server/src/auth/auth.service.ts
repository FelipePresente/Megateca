import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import LoginDto from "./dto/loginDto";
import PasswordService from "src/helpers/password.service";
import TokenService from "src/helpers/token.service";
import type UserDto from "@/types/user/UserDto";

@Injectable()
export default class AuthService {
    constructor(
        private prisma: PrismaService,
        private passwordService: PasswordService,
        private tokenService: TokenService
    ) {}

    async login(userToLogin: LoginDto) {
        const { username, password } = userToLogin;

        const userFromDB = await this.prisma.user.findUnique({
            where: { username: username },
            include: { role: true }
        });

        if (!userFromDB) throw new UnauthorizedException("Invalid username or password");

        const isPasswordEqual = await this.passwordService.compare(
            password, userFromDB.password
        );

        if (!isPasswordEqual) throw new UnauthorizedException("Invalid username or password");

        const payload: UserDto = {
            id: userFromDB.id,
            username: username,
            roleId: userFromDB.roleId
        };

        const token = this.tokenService.generateToken(payload);

        return token;
    }
}
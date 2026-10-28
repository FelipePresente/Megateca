import PasswordService from "@/helpers/password.service";
import TokenService from "@/helpers/token.service";
import { PrismaService } from "@/prisma.service";
import UserDto from "@/types/user/UserDto";
import UserResponseDto from "@/types/user/UserResponseDto";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import SignUpDto from "./dto/signupDto";
import prismaErrorHandler from "@/helpers/prismaErrorHandler";
import UpdateUserDto from "./dto/updateUserDto";
import { randomUUID } from "crypto";

@Injectable()
export default class UserService {
    constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private tokenService: TokenService
    ) { }

    async findAll(page: number = 1, limit: number = 20, role?: string): Promise<UserResponseDto[]> {
        const safeLimit = Math.min(limit, 50)
        const skip = (page - 1) * safeLimit

        const users = await this.prisma.user.findMany({
            take: safeLimit,
            skip: skip,
            where: role ? { role: { name: role } } : {},
            include: { role: { select: { name: true } } },
            orderBy: [{ role: { name: 'asc' } }, { username: 'asc' }]
        })

        return users.map((u) => ({
            id: u.id,
            username: u.username,
            roleName: u.role?.name ?? '',
        }))
    }

    async create(userToCreate: SignUpDto): Promise<string> {
        const userExists = await this.prisma.user.findUnique({
            where: { username: userToCreate.username }
        })

        if (userExists) throw new ConflictException("This username is being used")

        const hashedPassword = await this.passwordService.hash(userToCreate.password)

        try {
            const createdUser = await this.prisma.user.create({
                data: {
                    username: userToCreate.username,
                    password: hashedPassword,
                    id: randomUUID(),
                    role: { connect: { name: 'user' } }
                }
            })

            const payload: UserDto = {
                id: createdUser.id,
                username: createdUser.username,
                roleId: createdUser.roleId
            }

            const token: string = this.tokenService.generateToken(payload)

            return token
        } catch (error) {
            prismaErrorHandler(error, 'User')
        }
    }

    async update(userId: string, userToUpdate: UpdateUserDto): Promise<void> {
        let updateData: any = {}

        let userFromDB = await this.prisma.user.findUnique({ where: { id: userId } })

        if (!userFromDB) throw new NotFoundException('User not found')

        if (userToUpdate.username) {
            if (userToUpdate.username === userFromDB.username) {
                throw new ConflictException('New username can not be equal to the current one')
            }

            updateData.username = userToUpdate.username
        }

        if (userToUpdate.password) {
            const isSamePassword = await this.passwordService.compare(
                userToUpdate.password, userFromDB.password
            )

            if (isSamePassword) {
                throw new BadRequestException('New password can not be equal to the current one')
            }

            updateData.password = await this.passwordService.hash(userToUpdate.password)
        }

        if (Object.keys(updateData).length === 0) throw new BadRequestException('Nothing to update')

        try {
            await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: updateData
            })
        } catch (error) {
            prismaErrorHandler(error, 'User')
        }
    }

    async delete(userId: string): Promise<void> {
        if (!userId) throw new BadRequestException('No ID sent')

        try {
            await this.prisma.user.delete({
                where: { id: userId }
            })
        } catch (error) {
            prismaErrorHandler(error, 'User')
        }
    }
}
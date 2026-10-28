import { Controller, Get, Post, Put, Delete, Body, UseGuards, Req, Res, Query, ForbiddenException, BadRequestException } from "@nestjs/common";
import type { Response } from 'express'
import UsersService from "./users.service";
import SignUpDto from "./dto/signupDto";
import UpdateUserDto from "./dto/updateUserDto";
import AuthGuard from "src/auth/guards/auth.guard";
import type UserDto from "@/types/user/UserDto";
import UserResponseDto from "@/types/user/UserResponseDto";
import CookieService from "src/helpers/cookie.service";
import RolesGuard from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";

@Controller('users')
export default class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private cookieService: CookieService
    ) { }

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    async findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
        @Query('role') role?: string
    ): Promise<UserResponseDto[]> {
        const parsedPage = Number(page)
        const parsedLimit = Number(limit)

        if (Number.isNaN(parsedPage) || parsedPage < 1) {
            throw new BadRequestException('Page must be a number greater than or equal to 1')
        }

        if (Number.isNaN(parsedLimit) || parsedLimit < 1) {
            throw new BadRequestException('Limit must be a number greater than or equal to 1')
        }

        return this.usersService.findAll(parsedPage, parsedLimit, role)
    }

    @Get('/me')
    @UseGuards(AuthGuard)
    async findMe(@Req() req: Request): Promise<UserDto> {
        const { id, username, roleId } = (req as any).user
        return { id, username, roleId }
    }

    @Post()
    async create(
        @Body() userToCreate: SignUpDto,
        @Res({ passthrough: true }) response: Response
    ) {
        const token = await this.usersService.create(userToCreate);
        this.cookieService.setupAuthCookie(response, token)
        return { message: 'User created successfully' };
    }

    @Put()
    @UseGuards(AuthGuard, RolesGuard)
    async update(
        @Body() userToUpdate: UpdateUserDto,
        @Req() req: Request,
        @Query('userId') targetUserId?: string
    ) {
        const currentUser = (req as any).user
        const userRole = typeof currentUser.role === 'object' ? currentUser.role?.name : currentUser.role

        if (targetUserId && userRole !== 'admin') {
            throw new ForbiddenException('Only admins can update other users')
        }

        const userId = targetUserId || currentUser.id
        await this.usersService.update(userId, userToUpdate)
        return { message: 'User updated successfully' }
    }

    @Delete()
    @UseGuards(AuthGuard, RolesGuard)
    async delete(
        @Req() req: Request,
        @Query('userId') targetUserId?: string
    ) {
        const currentUser = (req as any).user
        const userRole = typeof currentUser.role === 'object' ? currentUser.role?.name : currentUser.role

        if (targetUserId && userRole !== 'admin') {
            throw new ForbiddenException('Only admins can delete other users')
        }

        const userId = targetUserId || currentUser.id
        await this.usersService.delete(userId)
        return { message: 'User deleted successfully' }
    }
}
import { Controller, Get, Post, Put, Delete, Body, UseGuards, Req, Res, Query, Param, ForbiddenException, BadRequestException } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Response } from 'express'
import UsersService from "./users.service";
import SignUpDto from "./dto/signupDto";
import UpdateUserDto from "./dto/updateUserDto";
import AuthGuard from "src/auth/guards/auth.guard";
import type UserDto from "@/types/user/UserDto";
import type { UserResponseDto } from "@/types/user/UserResponseDto";
import type { ApiResponse } from "@/types/responses/ApiResponse";
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
    ): Promise<ApiResponse<UserResponseDto[]>> {
        const parsedPage = Number(page)
        const parsedLimit = Number(limit)

        if (Number.isNaN(parsedPage) || parsedPage < 1) {
            throw new BadRequestException('Page must be a number greater than or equal to 1')
        }

        if (Number.isNaN(parsedLimit) || parsedLimit < 1) {
            throw new BadRequestException('Limit must be a number greater than or equal to 1')
        }

        const users = await this.usersService.findAll(parsedPage, parsedLimit, role)

        return {
            success: true,
            message: 'Users retrieved successfully',
            data: users,
            timestamp: new Date().toISOString(),
        }
    }

    @Get('/me')
    @UseGuards(AuthGuard)
    async findMe(@Req() req: Request): Promise<ApiResponse<UserDto>> {
        const { id, username, roleId } = (req as any).user

        return {
            success: true,
            message: 'Current user retrieved successfully',
            data: { id, username, roleId },
            timestamp: new Date().toISOString(),
        }
    }

    @Post()
    @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 cadastros por minuto por IP
    async create(
        @Body() userToCreate: SignUpDto,
        @Res({ passthrough: true }) response: Response
    ): Promise<ApiResponse<{ token: string }>> {
        const token = await this.usersService.create(userToCreate);
        this.cookieService.setupAuthCookie(response, token)

        return {
            success: true,
            message: 'User created successfully',
            data: { token },
            timestamp: new Date().toISOString(),
        }
    }

    @Put(':userId')
    @UseGuards(AuthGuard, RolesGuard)
    async update(
        @Param('userId') userId: string,
        @Body() userToUpdate: UpdateUserDto,
        @Req() req: Request
    ): Promise<ApiResponse> {
        const currentUser = (req as any).user
        const userRole = typeof currentUser.role === 'object' ? currentUser.role?.name : currentUser.role

        const isUpdatingOwn = userId === currentUser.id;

        if (!isUpdatingOwn && userRole !== 'admin') {
            throw new ForbiddenException('Only admins can update other users')
        }

        await this.usersService.update(userId, userToUpdate)

        return {
            success: true,
            message: 'User updated successfully',
            timestamp: new Date().toISOString(),
        }
    }

    @Delete(':userId')
    @UseGuards(AuthGuard, RolesGuard)
    async delete(
        @Param('userId') userId: string,
        @Req() req: Request
    ): Promise<ApiResponse> {
        const currentUser = (req as any).user
        const userRole = typeof currentUser.role === 'object' ? currentUser.role?.name : currentUser.role

        const isDeletingOwn = userId === currentUser.id;

        if (!isDeletingOwn && userRole !== 'admin') {
            throw new ForbiddenException('Only admins can delete other users')
        }

        await this.usersService.delete(userId)

        return {
            success: true,
            message: 'User deleted successfully',
            timestamp: new Date().toISOString(),
        }
    }
}
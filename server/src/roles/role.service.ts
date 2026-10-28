import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';

@Injectable()
export default class RoleService implements OnModuleInit {
    constructor(private readonly prisma: PrismaService) {}

    async onModuleInit(): Promise<void> {
        await this.seedDefaultRoles();
    }

    async findRoleByName(name: string) {
        return this.prisma.role.findUnique({
            where: { name },
        });
    }

    async seedDefaultRoles(): Promise<void> {
        const defaultRoles = ['admin', 'user'];

        for (const roleName of defaultRoles) {
            const existing = await this.findRoleByName(roleName);
            if (!existing) {
                await this.prisma.role.create({
                    data: { name: roleName },
                });
            }
        }
    }
}

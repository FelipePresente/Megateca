import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export default class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredRoles || requiredRoles.length === 0) return true;

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }
        
        const userRoleName: string | undefined =
            typeof user.role === 'object' && user.role !== null
                ? user.role.name
                : user.role;

        if (!userRoleName) {
            throw new ForbiddenException('Access denied: user has no role assigned');
        }

        const hasRole = requiredRoles.some(
            (role) => role.toLowerCase() === userRoleName.toLowerCase()
        );

        if (hasRole) return true;

        throw new ForbiddenException('Access denied: insufficient permissions');
    }
}
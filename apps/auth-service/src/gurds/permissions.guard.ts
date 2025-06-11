import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleHasPermissionService } from '../role_has_permission/role_has_permission.service';
import { log } from 'console';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
        private readonly roleHasPermissionService: RoleHasPermissionService, // Inject the service to fetch permissions
    ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.get<string[]>(
            'permissions',
            context.getHandler(),
        );
        log('requiredPermissions', requiredPermissions);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        // Fetch permissions for each role and flatten into a single array without repetitions
        const permissionsArrays = await Promise.all(
            user.roles.map(async (role: { id: number }) => {
            return await this.roleHasPermissionService.roleHasPermissions(role.id);
            }),
        );
        // Flatten and deduplicate permissions
        user.permissions = Array.from(new Set(permissionsArrays.flat()));

        log('user.permissions', user.permissions.flat());
        if (!user || !user.permissions.flat()) {
            return false;
        }
        return requiredPermissions.every(permission =>
            user.permissions.flat().includes(permission),
        );
    }
}
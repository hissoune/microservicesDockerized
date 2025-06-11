import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleHasPermissionDto } from './create-role_has_permission.dto';

export class UpdateRoleHasPermissionDto extends PartialType(CreateRoleHasPermissionDto) {}

import { Injectable } from '@nestjs/common';
import { CreateRoleHasPermissionDto } from './dto/create-role_has_permission.dto';
import { UpdateRoleHasPermissionDto } from './dto/update-role_has_permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleHasPermission } from './entities/role_has_permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleHasPermissionService {

  constructor(@InjectRepository(RoleHasPermission) private roleHasPermissionRepository: Repository<RoleHasPermission>) {}

  create(createRoleHasPermissionDto: CreateRoleHasPermissionDto) {
    const roleHasPermission = this.roleHasPermissionRepository.create(createRoleHasPermissionDto as any as Partial<RoleHasPermission>);
    return this.roleHasPermissionRepository.save(roleHasPermission);
  }

  findAll() {
    return this.roleHasPermissionRepository.find({
      relations: ['role', 'permission'],
    });
  }

  findOne(id: string) {
    return this.roleHasPermissionRepository.findOne({
      where: { id },
      relations: ['role', 'permission'],
    });
  }

  // update(id: string, updateRoleHasPermissionDto: UpdateRoleHasPermissionDto) {
  //   return this.roleHasPermissionRepository.update(id, updateRoleHasPermissionDto);
  // }

  roleHasPermissions(roleId: number) {
    const rolePermissions = this.roleHasPermissionRepository.find({
      where: { role: { id: roleId } },
      relations: ['permission'],
    });

    return rolePermissions.then((permissions) => {
      return permissions.map((permission) => permission.permission.name);
    });

  }

  permissionHasRoles(permissionId: string) {
    return this.roleHasPermissionRepository.find({
      where: { permission: { id: permissionId } },
      relations: ['role'],
    });
  }

  remove(id: string) {
    return this.roleHasPermissionRepository.delete(id).then(() => {
      return `This action removed a #${id} role_has_permission`;
    });
  }
}

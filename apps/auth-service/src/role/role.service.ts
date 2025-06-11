import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { KeycloakHelper } from '../helpers/keycloak.helper';
import axios from 'axios';

@Injectable()
export class RoleService {

  constructor(@InjectRepository(Role) private roleRepository : Repository<Role>,
   private readonly keycloakhelper: KeycloakHelper) {}

 async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOne(id: number) {
    return await this.roleRepository.findOneBy({ id });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(+id);
  }

  async remove(id: number) {
    await this.roleRepository.delete(id);
    return `This action removed a #${id} role`;
  }
}

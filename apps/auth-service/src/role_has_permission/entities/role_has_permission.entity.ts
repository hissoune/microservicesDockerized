import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../role/entities/role.entity";
import { Permission } from "../../permission/entities/permission.entity";


@Entity()
export class RoleHasPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Role, (role) => role.id, { eager: true })
  role: Role;

  @ManyToOne(() => Permission , (permission) => permission.id, { eager: true })
  permission: Permission;
}

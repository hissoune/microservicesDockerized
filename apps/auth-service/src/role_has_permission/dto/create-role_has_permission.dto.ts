import { IsString } from "class-validator";

export class CreateRoleHasPermissionDto {

    @IsString()
    role: string;

    @IsString()
    permission: string;
}

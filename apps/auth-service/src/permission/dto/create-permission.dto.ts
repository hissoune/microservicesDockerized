import { IsString } from "class-validator";



export class CreatePermissionDto {

    @IsString()
    name: string;
    @IsString()
    desc?: string;
    
}

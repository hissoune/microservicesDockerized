import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permission {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100, unique: true })
    name: string;

    @Column({ length: 255, nullable: true })
    desc?: string;
}

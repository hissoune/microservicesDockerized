import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()

export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    name: string;

    @Column({ nullable: true })
    desc?: string;
}

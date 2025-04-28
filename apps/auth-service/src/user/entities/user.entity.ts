import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: number;
  @Column({ length: 100, nullable: false})
  name: string;
  @Column({ length: 100, nullable: false})
  email: string;
  @Column({ nullable: false})
  password: string;
}

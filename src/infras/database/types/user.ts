import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Length } from "class-validator";
import { Role } from "./roles";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(3, 100)
  name: string;

  @Column()
  @Length(3, 100)
  user_name: string;

  @Column()
  @Length(3, 100)
  password: string;

  @Column()
  @Length(3, 10)
  contact_no: string;

  @Column()
  @Length(3, 100)
  email: string;

  @Column({ default: false })
  is_delete: boolean;

  @Column()
  role_id: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: "role_id" }) 
  role: Role;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;
}
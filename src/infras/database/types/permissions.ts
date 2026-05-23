import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Length } from "class-validator";
import { DataTypes } from "sequelize";
import { Role } from "./roles";
import { Resource } from "./resource";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  create_s: boolean;

  @Column()
  update_s: boolean;

  @Column()
  delete_s: boolean;

  @Column()
  view: boolean;

  @Column()
  resource_id: number;

  @ManyToOne(() => Resource)
  @JoinColumn({ name: "resource_id" }) 
  resource: Resource;

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

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Length } from "class-validator";

@Entity()
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(3, 50)
  user: string;

  @Column()
  @Length(3, 50)
  action: string;

  @Column()
  @Length(3, 50)
  resource: string;

  @Column({type: "longtext" })
  description: string;

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

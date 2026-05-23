import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Length } from "class-validator";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(3, 100)
  name: string;

  @Column()
  @Length(3, 100)
  keyValue: string;

  @Column()
  is_delete: boolean;
  
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

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user";
import { Project } from "./project";

@Entity()
export class ProjectUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  project_id: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: "project_id" })
  project: Project;

  @Column({ type: "simple-json", nullable: true })
  permissions: string[];

  @Column({ nullable: true })
  role_in_project: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: "timestamp" })
  assigned_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
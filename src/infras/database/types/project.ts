import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ length: 50, nullable: true })
  code: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_archived: boolean;

  @Column({ type: "timestamp", nullable: true })
  start_date: Date;

  @Column({ type: "timestamp", nullable: true })
  end_date: Date;

  @Column({ nullable: true })
  project_lead_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "project_lead_id" })
  project_lead: User;

  @Column({ nullable: true })
  qa_lead_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "qa_lead_id" })
  qa_lead: User;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
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
import { Project } from "./project";
import { User } from "./user";

export enum SuiteType {
  FULL_ROUND = "FULL_ROUND",
  SMOKE = "SMOKE",
  REGRESSION = "REGRESSION",
  SANITY = "SANITY",
  CUSTOM = "CUSTOM",
}

@Entity()
export class TestSuite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "enum", enum: SuiteType, default: SuiteType.CUSTOM })
  suite_type: SuiteType;

  @Column()
  project_id: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: "project_id" })
  project: Project;

  @Column({ default: false })
  is_template: boolean;

  @Column({ nullable: true })
  source_project_id: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true, length: 20 })
  version: string;

  @Column({ type: "text", nullable: true })
  preconditions: string;

  @Column({ default: 0 })
  test_case_count: number;

  @Column({ nullable: true })
  created_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  creator: User;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
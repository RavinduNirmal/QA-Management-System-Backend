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
import { TestCycle } from "./testCycle";

export enum MilestoneStatus {
  PLANNED = "planned",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  ON_HOLD = "on_hold",
}

@Entity()
export class Milestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  project_id: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: "project_id" })
  project: Project;

  @Column({ length: 50, nullable: true })
  release_version: string;

  @Column({ type: "enum", enum: MilestoneStatus, default: MilestoneStatus.PLANNED })
  status: MilestoneStatus;

  @Column({ type: "date", nullable: true })
  start_date: Date;

  @Column({ type: "date", nullable: true })
  end_date: Date;

  @Column({ nullable: true })
  assigned_to: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "assigned_to" })
  assigned_user: User;

  @Column({ default: false })
  is_template: boolean;

  @Column({ type: "simple-json", nullable: true })
  template_config: {
    default_suites?: number[];
    default_assignees?: Record<string, number>;
    required_approvals?: string[];
  };

  @OneToMany(() => TestCycle, (cycle) => cycle.milestone)
  test_cycles: TestCycle[];

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
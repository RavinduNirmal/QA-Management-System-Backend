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
import { Milestone } from "./milestone";
import { User } from "./user";
import { TestExecution } from "./testExecution";

export enum TestCycleType {
  INITIAL = "initial",
  REGRESSION = "regression",
  VERIFICATION = "verification",
  SMOKE = "smoke",
  SANITY = "sanity",
  FULL_ROUND = "full_round",
  UAT = "uat",
  PERFORMANCE = "performance",
  SECURITY = "security",
}

export enum TestCycleStatus {
  PLANNED = "planned",
  IN_PROGRESS = "in_progress",
  PENDING_REVIEW = "pending_review",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity()
export class TestCycle {
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

  @Column({ nullable: true })
  milestone_id: number;

  @ManyToOne(() => Milestone)
  @JoinColumn({ name: "milestone_id" })
  milestone: Milestone;

  @Column({ type: "int", default: 1 })
  round_number: number;

  @Column({ type: "enum", enum: TestCycleType, default: TestCycleType.INITIAL })
  cycle_type: TestCycleType;

  @Column({ type: "enum", enum: TestCycleStatus, default: TestCycleStatus.PLANNED })
  status: TestCycleStatus;

  @Column({ type: "date", nullable: true })
  planned_start_date: Date;

  @Column({ type: "date", nullable: true })
  planned_end_date: Date;

  @Column({ type: "timestamp", nullable: true })
  actual_start_date: Date;

  @Column({ type: "timestamp", nullable: true })
  actual_end_date: Date;

  @Column({ type: "simple-json", nullable: true })
  test_suite_ids: number[];

  @Column({ type: "simple-json", nullable: true })
  test_case_ids: number[];

  @Column({ type: "simple-json", nullable: true })
  bug_ids: number[];

  @Column({ type: "simple-json", nullable: true })
  environment_config: {
    browser?: string;
    os?: string;
    device?: string;
    environment?: string;
  };

  @Column({ type: "simple-json", nullable: true })
  assignees: {
    user_id: number;
    role: string;
    test_case_ids?: number[];
    test_suite_ids?: number[];
  }[];

  @Column({ nullable: true })
  created_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  creator: User;

  @OneToMany(() => TestExecution, (execution) => execution.test_cycle)
  executions: TestExecution[];

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
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
import { TestCase } from "./testCase";
import { TestSuite } from "./testSuite";
import { Project } from "./project";

export enum ExecutionStatus {
  PASS = "pass",
  FAIL = "fail",
  BLOCKED = "blocked",
  SKIPPED = "skipped",
  IN_PROGRESS = "in_progress",
  NOT_EXECUTED = "not_executed",
}

@Entity()
export class TestExecution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  test_case_id: number;

  @ManyToOne(() => TestCase)
  @JoinColumn({ name: "test_case_id" })
  test_case: TestCase;

  @Column()
  test_suite_id: number;

  @ManyToOne(() => TestSuite)
  @JoinColumn({ name: "test_suite_id" })
  test_suite: TestSuite;

  @Column()
  project_id: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: "project_id" })
  project: Project;

  @Column()
  executed_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "executed_by" })
  executor: User;

  @Column({ type: "enum", enum: ExecutionStatus, default: ExecutionStatus.NOT_EXECUTED })
  status: ExecutionStatus;

  @Column({ type: "text", nullable: true })
  actual_result: string;

  @Column({ type: "text", nullable: true })
  comments: string;

  @Column({ nullable: true })
  execution_time: number;

  @Column({ nullable: true })
  environment: string;

  @Column({ nullable: true })
  browser: string;

  @Column({ nullable: true })
  device: string;

  @Column({ type: "simple-json", nullable: true })
  screenshots: string[];

  @Column({ type: "simple-json", nullable: true })
  logs: string[];

  @Column({ nullable: true })
  execution_date: Date;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
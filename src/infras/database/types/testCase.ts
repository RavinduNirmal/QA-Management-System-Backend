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
import { TestSuite } from "./testSuite";
import { User } from "./user";

export enum TestPriority {
  CRITICAL = "critical",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum TestType {
  FUNCTIONAL = "functional",
  PERFORMANCE = "performance",
  SECURITY = "security",
  USABILITY = "usability",
  COMPATIBILITY = "compatibility",
  API = "api",
  UI = "ui",
  INTEGRATION = "integration",
}

export enum TestStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  DEPRECATED = "deprecated",
  REVIEW = "review",
}

export enum AutomationStatus {
  MANUAL = "manual",
  AUTOMATED = "automated",
  IN_PROGRESS = "in_progress",
  NOT_APPLICABLE = "not_applicable",
}

@Entity()
export class TestCase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  preconditions: string;

  @Column({ type: "text", nullable: true })
  test_data: string;

  @Column({ type: "simple-json", nullable: true })
  steps: Array<{
    step_number: number;
    action: string;
    expected_result: string;
    actual_result?: string;
  }>;

  @Column({ type: "text", nullable: true })
  expected_result: string;

  @Column({ type: "text", nullable: true })
  actual_result: string;

  @Column({ type: "enum", enum: TestPriority, default: TestPriority.MEDIUM })
  priority: TestPriority;

  @Column({ type: "enum", enum: TestType, default: TestType.FUNCTIONAL })
  test_type: TestType;

  @Column({ type: "enum", enum: TestStatus, default: TestStatus.DRAFT })
  status: TestStatus;

  @Column({ type: "enum", enum: AutomationStatus, default: AutomationStatus.MANUAL })
  automation_status: AutomationStatus;

  @Column({ nullable: true })
  automation_script_path: string;

  @Column({ default: false })
  is_shared: boolean;

  @Column({ nullable: true })
  source_project_id: number;

  @Column({ nullable: true })
  original_test_case_id: number;

  @Column()
  project_id: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: "project_id" })
  project: Project;

  @Column({ nullable: true })
  test_suite_id: number;

  @ManyToOne(() => TestSuite)
  @JoinColumn({ name: "test_suite_id" })
  test_suite: TestSuite;

  @Column({ nullable: true })
  assigned_to: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "assigned_to" })
  assignee: User;

  @Column({ nullable: true })
  created_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  creator: User;

  @Column({ nullable: true })
  reviewed_by: number;

  @Column({ type: "simple-json", nullable: true })
  tags: string[];

  @Column({ nullable: true })
  estimated_duration: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
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
import { TestCase } from "./testCase";
import { TestExecution } from "./testExecution";
import { TestCycle } from "./testCycle";

// ============ QA Status (Owned by QA Team) ============
export enum DefectQAStatus {
  NEW = "new",
  TRIAGE = "triage",
  OPEN = "open",
  VERIFIED = "verified",
  CLOSED = "closed",
  REOPENED = "reopened",
}

// ============ Developer Status (Owned by Dev Team) ============
export enum DefectDevStatus {
  NOT_ASSIGNED = "not_assigned",
  IN_PROGRESS = "in_progress",
  FIXED = "fixed",
  REJECTED = "rejected",
  DUPLICATE = "duplicate",
  DEFERRED = "deferred",
  NEEDS_INFO = "needs_info",
}

export enum DefectSeverity {
  BLOCKER = "blocker",
  CRITICAL = "critical",
  MAJOR = "major",
  MINOR = "minor",
  TRIVIAL = "trivial",
}

export enum DefectPriority {
  URGENT = "urgent",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum DefectResolution {
  FIXED = "fixed",
  WONTFIX = "wontfix",
  DUPLICATE = "duplicate",
  WORKS_AS_DESIGNED = "works_as_designed",
  CANNOT_REPRODUCE = "cannot_reproduce",
  DEFERRED = "deferred",
}

@Entity()
export class Defect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text", nullable: true })
  steps_to_reproduce: string;

  @Column({ type: "text", nullable: true })
  actual_result: string;

  @Column({ type: "text", nullable: true })
  expected_result: string;

  // ============ Severity & Priority ============
  @Column({ type: "enum", enum: DefectSeverity, default: DefectSeverity.MAJOR })
  severity: DefectSeverity;

  @Column({ type: "enum", enum: DefectPriority, default: DefectPriority.MEDIUM })
  priority: DefectPriority;

  // ============ Dual Status Tracking ============
  @Column({ type: "enum", enum: DefectQAStatus, default: DefectQAStatus.NEW })
  qa_status: DefectQAStatus;

  @Column({ type: "enum", enum: DefectDevStatus, default: DefectDevStatus.NOT_ASSIGNED })
  dev_status: DefectDevStatus;

  @Column({ type: "enum", enum: DefectResolution, nullable: true })
  resolution: DefectResolution;

  // ============ Environment Info ============
  @Column({ nullable: true })
  environment: string;

  @Column({ nullable: true })
  browser: string;

  @Column({ nullable: true })
  device: string;

  @Column({ nullable: true })
  os: string;

  @Column({ nullable: true })
  build_version: string;

  // ============ Cross-Project Support ============
  @Column({ default: false })
  is_common_bug: boolean;

  @Column({ type: "simple-json", nullable: true })
  affected_projects: number[];

  @Column({ type: "simple-json", nullable: true })
  affected_versions: string[];

  @Column({ nullable: true })
  fixed_in_version: string;

  // ============ Relationships ============
  @Column()
  project_id: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: "project_id" })
  project: Project;

  @Column({ nullable: true })
  test_case_id: number;

  @ManyToOne(() => TestCase)
  @JoinColumn({ name: "test_case_id" })
  test_case: TestCase;

  @Column({ nullable: true })
  test_execution_id: number;

  @ManyToOne(() => TestExecution)
  @JoinColumn({ name: "test_execution_id" })
  test_execution: TestExecution;

  @Column({ nullable: true })
  test_cycle_id: number;

  @ManyToOne(() => TestCycle)
  @JoinColumn({ name: "test_cycle_id" })
  test_cycle: TestCycle;

  // ============ People ============
  @Column()
  reported_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "reported_by" })
  reporter: User;

  @Column({ nullable: true })
  assigned_to: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "assigned_to" })
  assignee: User;

  @Column({ nullable: true })
  fixed_by: number;

  @Column({ nullable: true })
  verified_by: number;

  @Column({ nullable: true })
  closed_by: number;

  // ============ Dates ============
  @Column({ type: "timestamp", nullable: true })
  reported_date: Date;

  @Column({ type: "timestamp", nullable: true })
  assigned_date: Date;

  @Column({ type: "timestamp", nullable: true })
  fixed_date: Date;

  @Column({ type: "timestamp", nullable: true })
  verified_date: Date;

  @Column({ type: "timestamp", nullable: true })
  closed_date: Date;

  // ============ Additional Data ============
  @Column({ type: "simple-json", nullable: true })
  attachments: Array<{
    filename: string;
    url: string;
    file_type: string;
    file_size: number;
    uploaded_by: number;
    uploaded_at: Date;
  }>;

  @Column({ type: "simple-json", nullable: true })
  comments: Array<{
    id: number;
    user_id: number;
    user_name: string;
    user_role: string;
    comment: string;
    created_at: Date;
    updated_at?: Date;
  }>;

  @Column({ type: "simple-json", nullable: true })
  history: Array<{
    field: string;
    old_value: string;
    new_value: string;
    changed_by: number;
    changed_by_name: string;
    changed_by_role: string;
    changed_at: Date;
  }>;

  @Column({ type: "simple-json", nullable: true })
  tags: string[];

  @Column({ nullable: true })
  estimated_fix_time: number;

  @Column({ nullable: true })
  actual_fix_time: number;

  @Column({ nullable: true })
  duplicate_of: number;

  @Column({ type: "simple-json", nullable: true })
  related_bugs: number[];

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
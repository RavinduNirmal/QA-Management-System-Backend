import { TestCycleType, TestCycleStatus } from "../../../domain/entities/TestCycle";
import { MilestoneStatus } from "../../../domain/entities/Milestone";

// ============ Milestone DTOs ============
export interface CreateMilestoneDTO {
  name: string;
  description?: string;
  project_id: number;
  release_version?: string;
  start_date?: Date;
  end_date?: Date;
  assigned_to?: number;
  is_template?: boolean;
  template_config?: any;
}

export interface UpdateMilestoneDTO {
  name?: string;
  description?: string;
  status?: MilestoneStatus;
  start_date?: Date;
  end_date?: Date;
  assigned_to?: number;
}

export interface MilestoneResponseDTO {
  id: number;
  name: string;
  description: string | null;
  project_id: number;
  project_name?: string | null;
  release_version: string | null;
  status: MilestoneStatus;
  status_label: string;
  start_date: Date | null;
  end_date: Date | null;
  assigned_to: number | null;
  test_cycles: TestCycleResponseDTO[];
  created_at: Date;
  updated_at: Date;
}

// ============ Test Cycle DTOs ============
export interface CreateTestCycleDTO {
  name: string;
  description?: string;
  project_id: number;
  milestone_id?: number;
  round_number?: number;
  cycle_type: TestCycleType;
  planned_start_date?: Date;
  planned_end_date?: Date;
  test_suite_ids?: number[];
  test_case_ids?: number[];
  bug_ids?: number[];
  environment_config?: any;
  assignees?: any[];
}

export interface UpdateTestCycleDTO {
  name?: string;
  description?: string;
  status?: TestCycleStatus;
  planned_start_date?: Date;
  planned_end_date?: Date;
  actual_start_date?: Date;
  actual_end_date?: Date;
  test_suite_ids?: number[];
  test_case_ids?: number[];
  assignees?: any[];
}

export interface TestCycleResponseDTO {
  id: number;
  name: string;
  description: string | null;
  project_id: number;
  project_name?: string | null;
  milestone_id: number | null;
  milestone_name?: string | null;
  milestone_version?: string | null;
  round_number: number;
  cycle_type: TestCycleType;
  cycle_type_label: string;
  status: TestCycleStatus;
  status_label: string;
  status_color: string;
  planned_start_date: Date | null;
  planned_end_date: Date | null;
  actual_start_date: Date | null;
  actual_end_date: Date | null;
  test_suite_ids: number[] | null;
  test_case_ids: number[] | null;
  bug_ids: number[] | null;
  environment_config: any | null;
  assignees: any[] | null;
  progress_percentage: number;
  created_by: number | null;
  created_by_name?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface TestCycleSummaryDTO {
  cycle_id: number;
  cycle_name: string;
  cycle_type: string;
  round_number: number;
  total_test_cases: number;
  executed: number;
  not_executed: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  pass_rate: number;
  progress_percentage: number;
  bugs_created: number;
  bugs_fixed: number;
  bugs_verified: number;
  bugs_reopened: number;
  estimated_time: number;
  actual_time: number;
  time_variance: number;
}

export interface ReleaseReadinessDTO {
  milestone_id: number;
  milestone_name: string;
  release_version: string;
  total_test_cycles: number;
  completed_cycles: number;
  in_progress_cycles: number;
  total_test_cases: number;
  executed_test_cases: number;
  overall_pass_rate: number;
  critical_bugs_open: number;
  high_bugs_open: number;
  medium_bugs_open: number;
  low_bugs_open: number;
  readiness_score: number;
  recommendation: "READY" | "CONDITIONAL" | "NOT_READY" | "BLOCKED";
  blocking_issues: string[];
}

export interface PaginatedTestCyclesResponse {
  data: TestCycleResponseDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
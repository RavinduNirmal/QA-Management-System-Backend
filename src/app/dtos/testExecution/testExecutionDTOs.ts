// import { ExecutionStatus } from "../../../domain/entities/TestExecution";

// export interface CreateTestExecutionDTO {
//   test_case_id: number;
//   test_suite_id: number;
//   project_id: number;
//   executed_by: number;
//   status: ExecutionStatus;
//   actual_result?: string;
//   comments?: string;
//   execution_time?: number;
//   environment?: string;
//   browser?: string;
//   device?: string;
//   screenshots?: string[];
//   logs?: string[];
// }

// export interface UpdateTestExecutionDTO {
//   status?: ExecutionStatus;
//   actual_result?: string;
//   comments?: string;
//   execution_time?: number;
//   screenshots?: string[];
//   logs?: string[];
// }

// export interface TestExecutionResponseDTO {
//   id: number;
//   test_case_id: number;
//   test_case_title?: string;
//   test_suite_id: number;
//   test_suite_name?: string;
//   project_id: number;
//   project_name?: string;
//   executed_by: number;
//   executed_by_name?: string;
//   status: ExecutionStatus;
//   status_label: string;
//   status_color: string;
//   actual_result: string | null;
//   comments: string | null;
//   execution_time: number | null;
//   environment: string | null;
//   browser: string | null;
//   device: string | null;
//   screenshots: string[] | null;
//   logs: string[] | null;
//   execution_date: Date | null;
//   created_at: Date;
// }

// export interface ExecutionStatsDTO {
//   total: number;
//   passed: number;
//   failed: number;
//   blocked: number;
//   skipped: number;
//   pass_rate: number;
// }

// export interface PaginatedExecutionsResponse {
//   data: TestExecutionResponseDTO[];
//   meta: {
//     total: number;
//     page: number;
//     limit: number;
//   };
// }


import { ExecutionStatus } from "../../../domain/entities/TestExecution";

export interface CreateTestExecutionDTO {
  test_case_id: number;
  test_suite_id: number;
  test_cycle_id: number;  // Add this - required
  project_id: number;
  executed_by: number;
  status: ExecutionStatus;
  actual_result?: string;
  comments?: string;
  execution_time?: number;
  environment?: string;
  browser?: string;
  device?: string;
  screenshots?: string[];
  logs?: string[];
}

export interface UpdateTestExecutionDTO {
  status?: ExecutionStatus;
  actual_result?: string;
  comments?: string;
  execution_time?: number;
  screenshots?: string[];
  logs?: string[];
}

export interface TestExecutionResponseDTO {
  id: number;
  test_case_id: number;
  test_case_title?: string;
  test_suite_id: number;
  test_suite_name?: string;
  test_cycle_id: number;
  test_cycle_name?: string;
  project_id: number;
  project_name?: string;
  executed_by: number;
  executed_by_name?: string;
  status: ExecutionStatus;
  status_label: string;
  status_color: string;
  actual_result: string | null;
  comments: string | null;
  execution_time: number | null;
  environment: string | null;
  browser: string | null;
  device: string | null;
  screenshots: string[] | null;
  logs: string[] | null;
  execution_date: Date | null;
  created_at: Date;
}

export interface ExecutionStatsDTO {
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  pass_rate: number;
}

export interface PaginatedExecutionsResponse {
  data: TestExecutionResponseDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
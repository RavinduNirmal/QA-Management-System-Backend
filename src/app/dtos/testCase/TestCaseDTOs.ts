import { TestPriority, TestType, TestStatus, AutomationStatus, TestStep } from "../../../domain/entities/TestCase";

export interface CreateTestCaseDTO {
  title: string;
  description?: string;
  preconditions?: string;
  test_data?: string;
  steps: TestStep[];
  expected_result?: string;
  priority?: TestPriority;
  test_type?: TestType;
  project_id: number;
  test_suite_id?: number;
  assigned_to?: number;
  is_shared?: boolean;
  tags?: string[];
  estimated_duration?: number;
}

export interface UpdateTestCaseDTO {
  title?: string;
  description?: string;
  preconditions?: string;
  test_data?: string;
  steps?: TestStep[];
  expected_result?: string;
  actual_result?: string;
  priority?: TestPriority;
  test_type?: TestType;
  status?: TestStatus;
  automation_status?: AutomationStatus;
  automation_script_path?: string;
  assigned_to?: number;
  test_suite_id?: number;  // Add this missing property
  tags?: string[];
  estimated_duration?: number;
}

export interface TestCaseResponseDTO {
  id: number;
  title: string;
  description: string | null;
  preconditions: string | null;
  test_data: string | null;
  steps: TestStep[] | null;
  expected_result: string | null;
  actual_result: string | null;
  priority: TestPriority;
  priority_label: string;
  priority_color: string;
  test_type: TestType;
  status: TestStatus;
  status_label: string;
  status_color: string;
  automation_status: AutomationStatus;
  automation_script_path: string | null;
  is_shared: boolean;
  source_project_id: number | null;
  project_id: number;
  project_name?: string;
  test_suite_id: number | null;
  test_suite_name?: string;
  assigned_to: number | null;
  assigned_to_name?: string;
  created_by: number | null;
  created_by_name?: string;
  tags: string[] | null;
  estimated_duration: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface PaginatedTestCasesResponse {
  data: TestCaseResponseDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
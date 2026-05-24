import { SuiteType } from "../../../domain/entities/TestSuite";

export interface CreateTestSuiteDTO {
  name: string;
  description?: string;
  suite_type: SuiteType;
  project_id: number;
  is_template?: boolean;
  source_project_id?: number;
  version?: string;
  preconditions?: string;
}

export interface UpdateTestSuiteDTO {
  name?: string;
  description?: string;
  suite_type?: SuiteType;
  is_active?: boolean;
  version?: string;
  preconditions?: string;
}

export interface TestSuiteResponseDTO {
  id: number;
  name: string;
  description: string | null;
  suite_type: SuiteType;
  suite_type_label: string;
  suite_type_color: string;
  project_id: number;
  project_name?: string;
  is_template: boolean;
  is_active: boolean;
  version: string | null;
  preconditions: string | null;
  test_case_count: number;
  created_by: number | null;
  created_by_name?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PaginatedTestSuitesResponse {
  data: TestSuiteResponseDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
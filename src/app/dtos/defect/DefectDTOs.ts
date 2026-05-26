import { 
  DefectSeverity, 
  DefectPriority, 
  DefectQAStatus, 
  DefectDevStatus, 
  DefectResolution 
} from "../../../domain/entities/Defect";

export interface CreateDefectDTO {
  title: string;
  description: string;
  steps_to_reproduce?: string;
  actual_result?: string;
  expected_result?: string;
  severity?: DefectSeverity;
  priority?: DefectPriority;
  environment?: string;
  browser?: string;
  device?: string;
  os?: string;
  build_version?: string;
  project_id: number;
  test_case_id?: number;
  test_execution_id?: number;
  test_cycle_id?: number;
  assigned_to?: number;
  is_common_bug?: boolean;
  affected_projects?: number[];
  affected_versions?: string[];
  tags?: string[];
  estimated_fix_time?: number;
  related_bugs?: number[];
}

export interface UpdateDefectDTO {
  title?: string;
  description?: string;
  steps_to_reproduce?: string;
  actual_result?: string;
  expected_result?: string;
  severity?: DefectSeverity;
  priority?: DefectPriority;
  qa_status?: DefectQAStatus;
  dev_status?: DefectDevStatus;
  resolution?: DefectResolution;
  assigned_to?: number;
  environment?: string;
  browser?: string;
  device?: string;
  os?: string;
  build_version?: string;
  fixed_in_version?: string;
  tags?: string[];
  estimated_fix_time?: number;
  duplicate_of?: number;
  related_bugs?: number[];
  // Add date fields
  assigned_date?: Date;
  fixed_date?: Date;
  fixed_by?: number;
  verified_date?: Date;
  verified_by?: number;
  closed_date?: Date;
  closed_by?: number;
}

export interface AddDefectCommentDTO {
  comment: string;
}

export interface DefectResponseDTO {
  id: number;
  title: string;
  description: string;
  steps_to_reproduce: string | null;
  actual_result: string | null;
  expected_result: string | null;
  severity: DefectSeverity;
  severity_label: string;
  severity_color: string;
  priority: DefectPriority;
  priority_label: string;
  qa_status: DefectQAStatus;
  qa_status_label: string;
  qa_status_color: string;
  dev_status: DefectDevStatus;
  dev_status_label: string;
  dev_status_color: string;
  resolution: DefectResolution | null;
  environment: string | null;
  browser: string | null;
  device: string | null;
  os: string | null;
  build_version: string | null;
  is_common_bug: boolean;
  affected_projects: number[] | null;
  affected_versions: string[] | null;
  fixed_in_version: string | null;
  project_id: number;
  project_name?: string | null;
  test_case_id: number | null;
  test_case_title?: string | null;
  test_execution_id: number | null;
  test_cycle_id: number | null;
  test_cycle_name?: string | null;
  reported_by: number;
  reported_by_name?: string | null;
  assigned_to: number | null;
  assigned_to_name?: string | null;
  assigned_date: Date | null;
  fixed_by: number | null;
  fixed_by_name?: string | null;
  fixed_date: Date | null;
  verified_by: number | null;
  verified_by_name?: string | null;
  verified_date: Date | null;
  closed_by: number | null;
  closed_by_name?: string | null;
  closed_date: Date | null;
  reported_date: Date | null;
  attachments: any[] | null;
  comments: any[] | null;
  tags: string[] | null;
  estimated_fix_time: number | null;
  actual_fix_time: number | null;
  duplicate_of: number | null;
  related_bugs: number[] | null;
  created_at: Date;
  updated_at: Date;
}

export interface DefectStatsDTO {
  total: number;
  by_qa_status: Record<string, number>;
  by_dev_status: Record<string, number>;
  by_severity: Record<string, number>;
  by_priority: Record<string, number>;
  avg_resolution_time: number;
  reopen_rate: number;
  defect_density: number;
}

export interface PaginatedDefectsResponse {
  data: DefectResponseDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
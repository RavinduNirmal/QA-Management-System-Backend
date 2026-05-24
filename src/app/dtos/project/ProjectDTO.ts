export interface CreateProjectDTO {
  name: string;
  description?: string;
  code?: string;
  start_date?: Date;
  end_date?: Date;
  project_lead_id?: number;
  qa_lead_id?: number;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  code?: string;
  is_active?: boolean;
  is_archived?: boolean;
  start_date?: Date;
  end_date?: Date;
  project_lead_id?: number;
  qa_lead_id?: number;
}

export interface ProjectResponseDTO {
  id: number;
  name: string;
  description: string | null;
  code: string | null;
  is_active: boolean;
  is_archived: boolean;
  start_date: Date | null;
  end_date: Date | null;
  project_lead_id: number | null;
  qa_lead_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface PaginatedProjectsResponse {
  data: ProjectResponseDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
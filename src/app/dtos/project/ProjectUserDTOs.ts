import { ProjectPermission } from "../../../domain/entities/ProjectUser";

export interface AssignUserToProjectDTO {
  user_id: number;
  project_id: number;
  permissions: ProjectPermission[];
  role_in_project?: string;
}

export interface UpdateProjectUserDTO {
  permissions?: ProjectPermission[];
  role_in_project?: string;
  is_active?: boolean;
}

export interface ProjectUserResponseDTO {
  id: number;
  user_id: number;
  user_name: string;
  project_id: number;
  project_name: string;
  permissions: string[];
  role_in_project: string | null;
  is_active: boolean;
  assigned_at: Date;
}

export interface UserProjectsResponseDTO {
  user_id: number;
  user_name: string;
  projects: Array<{
    project_id: number;
    project_name: string;
    permissions: string[];
    role_in_project: string | null;
  }>;
}
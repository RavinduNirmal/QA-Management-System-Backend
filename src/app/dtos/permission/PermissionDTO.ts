export interface CreatePermissionDTO {
  create_s: boolean;
  update_s: boolean;
  delete_s: boolean;
  view: boolean;
  resource_id: number;
  role_id: number;
}

export interface UpdatePermissionDTO {
  create_s?: boolean;
  update_s?: boolean;
  delete_s?: boolean;
  view?: boolean;
  resource_id?: number;
  role_id?: number;
}

export interface PermissionResponseDTO {
  id: number;
  create_s: boolean;
  update_s: boolean;
  delete_s: boolean;
  view: boolean;
  resource_id: number;
  resource_name?: string;
  role_id: number;
  role_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateResourceDTO {
  name: string;
}

export interface ResourceResponseDTO {
  id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PermissionWithResourceDTO {
  id: number;
  create_s: boolean;
  update_s: boolean;
  delete_s: boolean;
  view: boolean;
  resource_id: number;
  role_id: number;
  resourceName: string;
}

export interface CreateUserDTO {
  name: string;
  user_name: string;
  email: string;
  contact_no: string;
  password: string;
  is_delete?: boolean;
  role_id: number;
}

export interface UpdateUserDTO {
  name?: string;
  user_name?: string;
  email?: string;
  contact_no?: string;
  password?: string;
  is_delete?: boolean;
  role_id?: number;
  username?: string; // For audit
}

export interface UserResponseDTO {
  id: number;
  name: string;
  user_name: string;
  email: string;
  contact_no: string;
  role_id: number;
  role?: string;
  roleKeyValue?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
export enum ProjectPermission {
  VIEW = "view",
  CREATE_TEST = "create_test",
  EDIT_TEST = "edit_test",
  DELETE_TEST = "delete_test",
  EXECUTE_TEST = "execute_test",
  CREATE_BUG = "create_bug",
  EDIT_BUG = "edit_bug",
  DELETE_BUG = "delete_bug",
  MANAGE_TASKS = "manage_tasks",
  VIEW_REPORTS = "view_reports",
  MANAGE_MEMBERS = "manage_members",
  FULL_ACCESS = "full_access",
}

export class ProjectUser {
  public readonly id?: number;
  public user_id: number;
  public project_id: number;
  public permissions: ProjectPermission[];
  public role_in_project: string | null;
  public is_active: boolean;
  public assigned_at?: Date;
  public updated_at?: Date;

  constructor(props: {
    id?: number;
    user_id: number;
    project_id: number;
    permissions?: ProjectPermission[];
    role_in_project?: string | null;
    is_active?: boolean;
    assigned_at?: Date;
    updated_at?: Date;
  }) {
    this.id = props.id;
    this.user_id = props.user_id;
    this.project_id = props.project_id;
    this.permissions = props.permissions ?? [];
    this.role_in_project = props.role_in_project ?? null;
    this.is_active = props.is_active ?? true;
    this.assigned_at = props.assigned_at;
    this.updated_at = props.updated_at;
  }

  hasPermission(permission: ProjectPermission): boolean {
    return this.permissions.includes(permission) || this.permissions.includes(ProjectPermission.FULL_ACCESS);
  }

  addPermission(permission: ProjectPermission): void {
    if (!this.hasPermission(permission)) {
      this.permissions.push(permission);
    }
  }

  removePermission(permission: ProjectPermission): void {
    this.permissions = this.permissions.filter((p) => p !== permission);
  }
}
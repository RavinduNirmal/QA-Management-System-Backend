import { Permission } from '../entities/Permission';

/**
 * Options for finding permissions with pagination
 */
export interface FindPermissionsOptions {
  where?: {
    id?: number;
    create_s?: boolean;
    update_s?: boolean;
    delete_s?: boolean;
    view?: boolean;
    resource_id?: number;
    role_id?: number;
    [key: string]: any;
  };
  skip?: number;
  take?: number;
  order?: {
    [key: string]: 'ASC' | 'DESC';
  };
  relations?: string[];
}

/**
 * Permission with resource details DTO
 */
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

/**
 * Permission Repository Interface
 * Handles all database operations related to permissions
 */
export interface IPermissionRepository {
  /**
   * Find permission by ID
   */
  findById(id: number): Promise<Permission | null>;

  /**
   * Find one permission with custom options
   */
  findOne(options: any): Promise<Permission | null>;

  /**
   * Find multiple permissions
   */
  find(options?: any): Promise<Permission[]>;

  /**
   * Find and count permissions with pagination
   */
  findAndCount(options: FindPermissionsOptions): Promise<[Permission[], number]>;

  /**
   * Save a new permission or update existing
   */
  save(permission: Permission): Promise<Permission>;

  /**
   * Update a permission by ID
   */
  update(id: number, permission: Partial<Permission>): Promise<void>;

  /**
   * Delete a permission by ID
   */
  delete(id: number): Promise<void>;

  /**
   * Find all permissions for a specific role
   */
  findByRoleId(roleId: number): Promise<Permission[]>;

  /**
   * Find all permissions for a specific resource
   */
  findByResourceId(resourceId: number): Promise<Permission[]>;

  /**
   * Find permission by role and resource combination
   */
  findByRoleAndResource(roleId: number, resourceId: number): Promise<Permission | null>;

  /**
   * Find permissions for multiple roles
   */
  findByRoleIds(roleIds: number[]): Promise<Permission[]>;

  /**
   * Check if a permission exists for a role and resource
   */
  exists(roleId: number, resourceId: number): Promise<boolean>;

  /**
   * Check if any permission exists for a role
   */
  existsForRole(roleId: number): Promise<boolean>;

  /**
   * Bulk create multiple permissions
   */
  bulkCreate(permissions: Permission[]): Promise<Permission[]>;

  /**
   * Bulk update multiple permissions
   */
  bulkUpdate(permissions: Array<{ id: number; data: Partial<Permission> }>): Promise<void>;

  /**
   * Delete all permissions for a role
   */
  deleteByRoleId(roleId: number): Promise<number>;

  /**
   * Delete all permissions for a resource
   */
  deleteByResourceId(resourceId: number): Promise<number>;

  /**
   * Get all permissions for a role with resource details
   */
  getRolePermissionsWithResources(roleId: number): Promise<PermissionWithResourceDTO[]>;

  /**
   * Validate if a role has specific permission for a resource
   */
  hasPermission(roleId: number, resourceId: number, action: 'create' | 'update' | 'delete' | 'view'): Promise<boolean>;

  /**
   * Copy permissions from one role to another
   */
  copyPermissions(fromRoleId: number, toRoleId: number): Promise<void>;
}

export default IPermissionRepository;
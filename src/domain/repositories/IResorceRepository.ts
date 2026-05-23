import { Resource } from '../entities/Resource';

/**
 * Options for finding resources with pagination
 */
export interface FindResourcesOptions {
  where?: {
    id?: number;
    name?: string;
    [key: string]: any;
  };
  skip?: number;
  take?: number;
  order?: {
    [key: string]: 'ASC' | 'DESC';
  };
}

/**
 * Resource with permission info DTO
 */
export interface ResourceWithPermissionDTO {
  id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
  permissions?: {
    role_id: number;
    create_s: boolean;
    update_s: boolean;
    delete_s: boolean;
    view: boolean;
  };
}

/**
 * Resource Repository Interface
 * Handles all database operations related to resources
 */
export interface IResourceRepository {
  /**
   * Find resource by ID
   * @param id - Resource ID
   * @returns Resource entity or null if not found
   */
  findById(id: number): Promise<Resource | null>;

  /**
   * Find one resource with custom options
   * @param options - Find options (where, relations, etc.)
   * @returns Resource entity or null
   */
  findOne(options: any): Promise<Resource | null>;

  /**
   * Find multiple resources
   * @param options - Find options (where, order, etc.)
   * @returns Array of resources
   */
  find(options?: any): Promise<Resource[]>;

  /**
   * Find and count resources with pagination
   * @param options - Find options with pagination
   * @returns Tuple of [resources array, total count]
   */
  findAndCount(options: FindResourcesOptions): Promise<[Resource[], number]>;

  /**
   * Save a new resource or update existing
   * @param resource - Resource entity to save
   * @returns Saved resource with generated ID
   */
  save(resource: Resource): Promise<Resource>;

  /**
   * Update a resource by ID
   * @param id - Resource ID
   * @param resource - Partial resource data to update
   * @returns Promise<void>
   */
  update(id: number, resource: Partial<Resource>): Promise<void>;

  /**
   * Delete a resource by ID
   * @param id - Resource ID
   * @returns Promise<void>
   */
  delete(id: number): Promise<void>;

  /**
   * Find resource by name
   * @param name - Resource name
   * @returns Resource entity or null
   */
  findByName(name: string): Promise<Resource | null>;

  /**
   * Find resources by names (bulk lookup)
   * @param names - Array of resource names
   * @returns Array of matching resources
   */
  findByNames(names: string[]): Promise<Resource[]>;

  /**
   * Check if resource exists by ID
   * @param id - Resource ID
   * @returns True if resource exists
   */
  exists(id: number): Promise<boolean>;

  /**
   * Check if resource exists by name
   * @param name - Resource name
   * @returns True if resource exists
   */
  existsByName(name: string): Promise<boolean>;

  /**
   * Get all resources with their permissions for a specific role
   * @param roleId - Role ID
   * @returns Array of resources with permission info
   */
  getResourcesWithPermissions(roleId: number): Promise<ResourceWithPermissionDTO[]>;

  /**
   * Get default system resources
   * @returns Array of default resource names
   */
  getDefaultResources(): string[];

  /**
   * Ensure default resources exist in the database
   * Creates them if they don't exist
   * @returns Array of created or existing default resources
   */
  ensureDefaultResources(): Promise<Resource[]>;

  /**
   * Get total count of resources
   * @param where - Optional filter conditions
   * @returns Total count
   */
  count(where?: any): Promise<number>;

  /**
   * Search resources by name pattern
   * @param searchTerm - Search term to match against resource names
   * @param limit - Maximum number of results
   * @returns Array of matching resources
   */
  searchByName(searchTerm: string, limit?: number): Promise<Resource[]>;
}

export default IResourceRepository;
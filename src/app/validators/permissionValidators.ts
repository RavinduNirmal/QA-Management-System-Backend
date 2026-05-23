import { BadRequest, NotFound, Conflict } from '../../shared/errors/baseError';
import { IResourceRepository } from '../../domain/repositories/IResorceRepository';
import { IPermissionRepository } from '../../domain/repositories/IPermissionRepositiory';
import { CreatePermissionDTO } from '../dtos/permission/PermissionDTO';

/**
 * Validate create resource
 */
export const validateCreateResource = async (
  name: string,
  resourceRepository: IResourceRepository
): Promise<void> => {
  // Check if name is provided
  if (!name || name.trim().length === 0) {
    throw new BadRequest('Resource name is required');
  }

  // Validate name length
  if (name.length < 3) {
    throw new BadRequest('Resource name must be at least 3 characters long');
  }

  if (name.length > 100) {
    throw new BadRequest('Resource name cannot exceed 100 characters');
  }

  // Check for duplicate resource name
  const existingResource = await resourceRepository.findByName(name);
  if (existingResource) {
    throw new Conflict(`Resource with name '${name}' already exists`);
  }
};

/**
 * Validate create permission
 */
export const validateCreatePermission = async (
  dto: CreatePermissionDTO,
  resourceRepository: IResourceRepository,
  permissionRepository: IPermissionRepository
): Promise<void> => {
  // Validate required fields
  if (!dto.resource_id) {
    throw new BadRequest('Resource ID is required');
  }

  if (!dto.role_id) {
    throw new BadRequest('Role ID is required');
  }

  // Validate resource exists
  const resource = await resourceRepository.findById(dto.resource_id);
  if (!resource) {
    throw new NotFound(`Resource with ID ${dto.resource_id} not found`);
  }

  // Check if permission already exists for this role and resource
  const existingPermission = await permissionRepository.findByRoleAndResource(
    dto.role_id,
    dto.resource_id
  );

  if (existingPermission) {
    throw new Conflict(
      `Permission already exists for role ID ${dto.role_id} and resource ID ${dto.resource_id}`
    );
  }
};

/**
 * Validate update permission
 */
export const validateUpdatePermission = async (
  permissionId: number,
  permissionRepository: IPermissionRepository
): Promise<void> => {
  // Validate permission ID
  if (!permissionId || permissionId <= 0) {
    throw new BadRequest('Invalid permission ID');
  }

  // Check if permission exists
  const existingPermission = await permissionRepository.findById(permissionId);
  if (!existingPermission) {
    throw new NotFound(`Permission with ID ${permissionId} not found`);
  }
};

/**
 * Validate get permissions by role
 */
export const validateGetPermissionsByRole = (roleId: number): void => {
  if (!roleId || roleId <= 0) {
    throw new BadRequest('Valid role ID is required');
  }
};

/**
 * Validate get permissions by resource
 */
export const validateGetPermissionsByResource = (resourceId: number): void => {
  if (!resourceId || resourceId <= 0) {
    throw new BadRequest('Valid resource ID is required');
  }
};

/**
 * Validate delete permission
 */
export const validateDeletePermission = async (
  permissionId: number,
  permissionRepository: IPermissionRepository
): Promise<void> => {
  if (!permissionId || permissionId <= 0) {
    throw new BadRequest('Invalid permission ID');
  }

  const existingPermission = await permissionRepository.findById(permissionId);
  if (!existingPermission) {
    throw new NotFound(`Permission with ID ${permissionId} not found`);
  }
};

export default {
  validateCreateResource,
  validateCreatePermission,
  validateUpdatePermission,
  validateGetPermissionsByRole,
  validateGetPermissionsByResource,
  validateDeletePermission,
};
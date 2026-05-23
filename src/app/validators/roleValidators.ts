import { BadRequest, Conflict, Forbidden } from '../../shared/errors/baseError';
import { IRoleRepository } from '../../domain/repositories/IRoleRepositiory';

export interface CreateRoleDTO {
  name: string;
  keyValue: string;
}

export interface UpdateRoleDTO {
  name?: string;
  keyValue?: string;
  is_delete?: boolean;
}

/**
 * Validate create role DTO
 */
export const validateCreateRole = async (
  dto: CreateRoleDTO,
  roleRepository: IRoleRepository
): Promise<void> => {
  // Validate required fields
  if (!dto.name || !dto.keyValue) {
    throw new BadRequest('Role name and keyValue are required');
  }

  // Validate name length
  if (dto.name.length < 3 || dto.name.length > 100) {
    throw new BadRequest('Role name must be between 3 and 100 characters');
  }

  // Validate keyValue length
  if (dto.keyValue.length < 3 || dto.keyValue.length > 100) {
    throw new BadRequest('Key value must be between 3 and 100 characters');
  }

  // Check for duplicates
  const existingRole = await roleRepository.findByName(dto.name);
  if (existingRole) {
    throw new Conflict('Role with this name already exists');
  }

  const existingKeyValue = await roleRepository.findByKeyValue(dto.keyValue);
  if (existingKeyValue) {
    throw new Conflict('Role with this keyValue already exists');
  }
};

/**
 * Validate update role DTO
 */
export const validateUpdateRole = async (
  roleId: number,
  dto: UpdateRoleDTO,
  roleRepository: IRoleRepository
): Promise<void> => {
  // Validate role ID
  if (!roleId || roleId <= 0) {
    throw new BadRequest('Invalid role ID');
  }

  // Check if role exists
  const existingRole = await roleRepository.findById(roleId);
  if (!existingRole) {
    throw new BadRequest('Role not found');
  }

  // Prevent modification of SUPER_ADMIN role
  if (existingRole.keyValue === 'SUPER_ADMIN') {
    throw new Forbidden('Super Admin role cannot be modified');
  }

  // Validate name if provided
  if (dto.name) {
    if (dto.name.length < 3 || dto.name.length > 100) {
      throw new BadRequest('Role name must be between 3 and 100 characters');
    }
  }

  // Validate keyValue if provided
  if (dto.keyValue) {
    if (dto.keyValue.length < 3 || dto.keyValue.length > 100) {
      throw new BadRequest('Key value must be between 3 and 100 characters');
    }
  }
};

export default {
  validateCreateRole,
  validateUpdateRole,
};
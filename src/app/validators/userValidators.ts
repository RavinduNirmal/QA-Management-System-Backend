import { CreateUserDTO, UpdateUserDTO } from '../dtos/user/UserDTOs';
import { IUserRepository } from '../../domain/repositories/IUserRepositiory';
import { IRoleRepository } from '../../domain/repositories/IRoleRepositiory';
import { Conflict } from '../../shared/errors/baseError';
import {
  validateEmail,
  validateContactNumber,
  validateRequiredFields,
  validateUserId,
  validatePassword,
  validateUsername,
  validateName,
  validateRoleId,
} from './commonValidator';

/**
 * Validate create user DTO
 */
export const validateCreateUser = async (
  dto: CreateUserDTO,
  userRepository: IUserRepository,
  roleRepository: IRoleRepository
): Promise<void> => {
  // Validate required fields
  const requiredFields: (keyof CreateUserDTO)[] = ['name', 'user_name', 'email', 'contact_no', 'password', 'role_id'];
  validateRequiredFields(dto, requiredFields);

  // Validate name
  validateName(dto.name, 'Name');

  // Validate username
  validateUsername(dto.user_name);

  // Validate email
  validateEmail(dto.email);

  // Validate contact number
  validateContactNumber(dto.contact_no);

  // Validate password
  validatePassword(dto.password);

  // Validate role
  await validateRoleId(dto.role_id, roleRepository);

  // Check for duplicates
  await checkForDuplicates(dto, userRepository);
};

/**
 * Validate update user DTO
 */
export const validateUpdateUser = async (
  userId: number,
  dto: UpdateUserDTO,
  userRepository: IUserRepository,
  roleRepository: IRoleRepository
): Promise<void> => {
  // Validate user ID
  validateUserId(userId);

  // Validate email if provided
  if (dto.email) {
    validateEmail(dto.email);
  }

  // Validate contact number if provided
  if (dto.contact_no) {
    validateContactNumber(dto.contact_no);
  }

  // Validate role if provided
  if (dto.role_id) {
    await validateRoleId(dto.role_id, roleRepository);
  }

  // Validate username if provided
  if (dto.user_name) {
    validateUsername(dto.user_name);
  }

  // Validate name if provided
  if (dto.name) {
    validateName(dto.name, 'Name');
  }

  // Validate password if provided
  if (dto.password) {
    validatePassword(dto.password);
  }

  // Check for duplicates on update
  await checkForDuplicatesOnUpdate(userId, dto, userRepository);
};

/**
 * Check for duplicate email/username on create
 */
const checkForDuplicates = async (
  dto: CreateUserDTO,
  userRepository: IUserRepository
): Promise<void> => {
  const existingByEmail = await userRepository.findByEmail(dto.email);
  if (existingByEmail) {
    throw new Conflict('User with this email already exists');
  }

  const existingByUsername = await userRepository.findByUsername(dto.user_name);
  if (existingByUsername) {
    throw new Conflict('User with this username already exists');
  }
};

/**
 * Check for duplicate email/username on update
 */
const checkForDuplicatesOnUpdate = async (
  userId: number,
  dto: UpdateUserDTO,
  userRepository: IUserRepository
): Promise<void> => {
  if (dto.user_name) {
    const existingByUsername = await userRepository.findByUsername(dto.user_name);
    if (existingByUsername && existingByUsername.id !== userId) {
      throw new Conflict('Username already exists');
    }
  }

  if (dto.email) {
    const existingByEmail = await userRepository.findByEmail(dto.email);
    if (existingByEmail && existingByEmail.id !== userId) {
      throw new Conflict('Email already exists');
    }
  }
};

export default {
  validateCreateUser,
  validateUpdateUser,
};
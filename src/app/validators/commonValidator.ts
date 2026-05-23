import { BadRequest } from '../../shared/errors/baseError';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequest('Invalid email format');
  }
};

/**
 * Validate contact number format
 */
export const validateContactNumber = (contact_no: string): void => {
  const phoneRegex = /^(?:\+94|0)?7\d{8}$/;
  if (!phoneRegex.test(contact_no.replace(/[\s\-\(\)]/g, ''))) {
    throw new BadRequest('Invalid contact number format');
  }
};

/**
 * Validate required fields
 */
export const validateRequiredFields = <T>(dto: T, requiredFields: (keyof T)[]): void => {
  for (const field of requiredFields) {
    if (!dto[field] && dto[field] !== false) {
      throw new BadRequest(`${String(field)} is required`);
    }
  }
};

/**
 * Validate user ID
 */
export const validateUserId = (userId: number): void => {
  if (!userId || userId <= 0) {
    throw new BadRequest('Invalid user ID');
  }
};

/**
 * Validate password
 */
export const validatePassword = (password: string, minLength: number = 6): void => {
  if (!password || password.length < minLength) {
    throw new BadRequest(`Password must be at least ${minLength} characters long`);
  }
};

/**
 * Validate role ID
 */
export const validateRoleId = async (roleId: number, roleRepository: any): Promise<void> => {
  const role = await roleRepository.findById(roleId);
  if (!role) {
    throw new BadRequest('Invalid role selected');
  }
};

/**
 * Validate username
 */
export const validateUsername = (username: string): void => {
  if (!username || username.trim().length === 0) {
    throw new BadRequest('Username is required');
  }
};

/**
 * Validate name
 */
export const validateName = (name: string, fieldName: string = 'Name'): void => {
  if (!name || name.trim().length === 0) {
    throw new BadRequest(`${fieldName} is required`);
  }
};

export default {
  validateEmail,
  validateContactNumber,
  validateRequiredFields,
  validateUserId,
  validatePassword,
  validateRoleId,
  validateUsername,
  validateName,
};
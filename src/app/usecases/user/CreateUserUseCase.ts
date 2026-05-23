// import { User } from '../../../domain/entities/User';
// import { IUserRepository } from '../../../domain/repositories/IUserRepositiory';
// import { IRoleRepository } from '../../../domain/repositories/IRoleRepositiory';
// import { IAuditRepository } from '../../../domain/repositories/IAuditRepositiory';
// import { Audit } from '../../../domain/entities/Audit';
// import { CreateUserDTO, UserResponseDTO } from '../../dtos/user/UserDTOs';
// import {  BadRequest, Conflict, NotFound } from '../../../shared/errors/baseError';
// import * as bcryptjs from 'bcryptjs';

// export class CreateUserUseCase {
//   constructor(
//     private userRepository: IUserRepository,
//     private roleRepository: IRoleRepository,
//     private auditRepository: IAuditRepository
//   ) {}

//   async execute(dto: CreateUserDTO, createdBy: string = 'System'): Promise<UserResponseDTO> {
//     // Validate required fields
//     this.validateRequiredFields(dto);

//     // Validate email format
//     this.validateEmailFormat(dto.email);

//     // Validate contact number format
//     this.validateContactNumber(dto.contact_no);

//     // Check if role exists
//     const role = await this.roleRepository.findById(dto.role_id);
//     if (!role) {
//       throw new BadRequest('Invalid role selected');
//     }

//     // Check for duplicates
//     await this.checkForDuplicates(dto);

//     // Hash password
//     const hashedPassword = await bcryptjs.hash(dto.password, 12);

//     // Create user entity
//     const user = new User({
//       name: dto.name.trim(),
//       user_name: dto.user_name.trim(),
//       email: dto.email.trim().toLowerCase(),
//       contact_no: dto.contact_no.trim(),
//       password: hashedPassword,
//       is_delete: dto.is_delete ?? false,
//       role_id: dto.role_id
//     });

//     // Save user
//     const savedUser = await this.userRepository.save(user);

//     // Create audit log
//     const audit = new Audit({
//       user: createdBy,
//       action: 'Create',
//       resource: 'User',
//       description: JSON.stringify(savedUser)
//     });
//     await this.auditRepository.save(audit);

//     return this.toResponseDTO(savedUser, role.name, role.keyValue);
//   }

//   private validateRequiredFields(dto: CreateUserDTO): void {
//     const requiredFields = ['name', 'user_name', 'email', 'contact_no', 'password', 'role_id'];
//     for (const field of requiredFields) {
//       if (!dto[field as keyof CreateUserDTO] && dto[field as keyof CreateUserDTO] !== false) {
//         throw new BadRequest(`${field} is required`);
//       }
//     }
//   }

//   private validateEmailFormat(email: string): void {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       throw new BadRequest('Invalid email format');
//     }
//   }

//   private validateContactNumber(contact_no: string): void {
//     const phoneRegex = /^(?:\+94|0)?7\d{8}$/;
//     if (!phoneRegex.test(contact_no.replace(/[\s\-\(\)]/g, ''))) {
//       throw new BadRequest('Invalid contact number format');
//     }
//   }

//   private async checkForDuplicates(dto: CreateUserDTO): Promise<void> {
//     const existingByEmail = await this.userRepository.findByEmail(dto.email);
//     if (existingByEmail) {
//       throw new Conflict('User with this email already exists');
//     }

//     const existingByUsername = await this.userRepository.findByUsername(dto.user_name);
//     if (existingByUsername) {
//       throw new Conflict('User with this username already exists');
//     }
//   }

//   private toResponseDTO(user: User, roleName: string = 'Unknown', roleKeyValue: string = 'Unknown'): UserResponseDTO {
//     return {
//       id: user.id!,
//       name: user.name,
//       user_name: user.user_name,
//       email: user.email,
//       contact_no: user.contact_no,
//       role_id: user.role_id,
//       role: roleName,
//       roleKeyValue: roleKeyValue,
//       created_at: user.created_at,
//       updated_at: user.updated_at
//     };
//   }
// }


import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepositiory';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepositiory';
import { IAuditRepository } from '../../../domain/repositories/IAuditRepositiory';
import { Audit } from '../../../domain/entities/Audit';
import { CreateUserDTO, UserResponseDTO } from '../../dtos/user/UserDTOs';
import { validateCreateUser } from '../../validators';
import * as bcryptjs from 'bcryptjs';

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(dto: CreateUserDTO, createdBy: string = 'System'): Promise<UserResponseDTO> {
    // Validate input
    await validateCreateUser(dto, this.userRepository, this.roleRepository);

    // Get role for response
    const role = await this.roleRepository.findById(dto.role_id);

    // Hash password
    const hashedPassword = await bcryptjs.hash(dto.password, 12);

    // Create user entity
    const user = new User({
      name: dto.name.trim(),
      user_name: dto.user_name.trim(),
      email: dto.email.trim().toLowerCase(),
      contact_no: dto.contact_no.trim(),
      password: hashedPassword,
      is_delete: dto.is_delete ?? false,
      role_id: dto.role_id
    });

    // Save user
    const savedUser = await this.userRepository.save(user);

    // Create audit log
    const audit = new Audit({
      user: createdBy,
      action: 'Create',
      resource: 'User',
      description: JSON.stringify(savedUser)
    });
    await this.auditRepository.save(audit);

    return this.toResponseDTO(savedUser, role!.name, role!.keyValue);
  }

  private toResponseDTO(user: User, roleName: string, roleKeyValue: string): UserResponseDTO {
    return {
      id: user.id!,
      name: user.name,
      user_name: user.user_name,
      email: user.email,
      contact_no: user.contact_no,
      role_id: user.role_id,
      role: roleName,
      roleKeyValue: roleKeyValue,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }
}
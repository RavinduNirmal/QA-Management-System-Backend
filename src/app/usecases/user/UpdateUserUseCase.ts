import { IUserRepository } from '../../../domain/repositories/IUserRepositiory';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepositiory';
import { IAuditRepository } from '../../../domain/repositories/IAuditRepositiory';
import { Audit } from '../../../domain/entities/Audit';
import { UpdateUserDTO, UserResponseDTO } from '../../dtos/user/UserDTOs';
import { validateUpdateUser } from '../../validators';
import { NotFound } from '../../../shared/errors/baseError';
import * as bcryptjs from 'bcryptjs';

export class UpdateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(
    userId: number, 
    dto: UpdateUserDTO, 
    updaterUsername: string = 'System'
  ): Promise<UserResponseDTO> {
    // Validate input
    await validateUpdateUser(userId, dto, this.userRepository, this.roleRepository);

    // Find existing user
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFound('User not found');
    }

    // Prepare update data - map username to user_name if needed
    const updateData: Partial<any> = { ...dto };
    
    // Remove username from update data if it exists (it should be user_name)
    if (updateData.username) {
      delete updateData.username;
    }

    // Hash password if provided
    if (dto.password && dto.password.trim()) {
      updateData.password = await bcryptjs.hash(dto.password, 12);
    }

    // Store old data for audit
    const oldUserData = JSON.stringify({
      id: existingUser.id,
      name: existingUser.name,
      user_name: existingUser.user_name,
      email: existingUser.email,
      contact_no: existingUser.contact_no,
      role_id: existingUser.role_id,
      is_delete: existingUser.is_delete
    });

    // Update user
    await this.userRepository.update(userId, updateData);
    
    // Fetch updated user
    const updatedUser = await this.userRepository.findById(userId);
    if (!updatedUser) {
      throw new NotFound('User not found after update');
    }

    // Create audit log
    const audit = new Audit({
      user: updaterUsername,
      action: 'Update',
      resource: 'User',
      description: `Old Values: ${oldUserData}, New Values: ${JSON.stringify(updatedUser)}`
    });
    await this.auditRepository.save(audit);

    // Get role name
    const role = await this.roleRepository.findById(updatedUser.role_id);
    
    return this.toResponseDTO(updatedUser, role?.name || 'Unknown', role?.keyValue || 'Unknown');
  }

  private toResponseDTO(user: any, roleName: string = 'Unknown', roleKeyValue: string = 'Unknown'): UserResponseDTO {
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
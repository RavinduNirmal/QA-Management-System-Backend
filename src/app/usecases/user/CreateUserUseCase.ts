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
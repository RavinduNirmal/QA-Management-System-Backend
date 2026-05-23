import { IUserRepository } from '../../../domain/repositories/IUserRepositiory';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepositiory';
import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepositiory';
import { IResourceRepository } from '../../../domain/repositories/IResorceRepository';
import { IAuditRepository } from '../../../domain/repositories/IAuditRepositiory';
import { Audit } from '../../../domain/entities/Audit';
import { BadRequest } from '../../../shared/errors/baseError';
import * as bcryptjs from 'bcryptjs';
import generateToken from '../../../infras/utils/generateToken';

interface LoginDTO {
  user_name: string;
  password: string;
}

interface PermissionDTO {
  id: number;
  create_s: boolean;
  update_s: boolean;
  delete_s: boolean;
  view: boolean;
  resource_id: number;
  role_id: number;
  resourceName: string;
}

interface LoginResponse {
  id: number;
  name: string;
  user_name: string;
  email: string;
  contact_no: string;
  is_delete: boolean;
  role_id: number;
  token: string;
  permissions: PermissionDTO[];
  role: any;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository,
    private permissionRepository: IPermissionRepository,
    private resourceRepository: IResourceRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(dto: LoginDTO): Promise<LoginResponse> {
    // Validate input
    if (!dto.user_name || !dto.password) {
      throw new BadRequest('Username and password are required');
    }

    // Find user
    const user = await this.userRepository.findOne({
      where: { user_name: dto.user_name }
    });

    if (!user) {
      throw new BadRequest('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcryptjs.compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new BadRequest('Invalid credentials');
    }

    // Get permissions
    const permissions = await this.permissionRepository.find({
      where: { role_id: user.role_id }
    });

    // Enrich permissions with resource names
    const enrichedPermissions: PermissionDTO[] = [];
    for (const permission of permissions) {
      const resource = await this.resourceRepository.findById(permission.resource_id);
      if (resource) {
        enrichedPermissions.push({
          id: permission.id!,
          create_s: permission.create_s,
          update_s: permission.update_s,
          delete_s: permission.delete_s,
          view: permission.view,
          resource_id: permission.resource_id,
          role_id: permission.role_id,
          resourceName: resource.name
        });
      }
    }

    // Get role
    const role = await this.roleRepository.findById(user.role_id);

    // Create audit log
    const audit = new Audit({
      user: user.name,
      action: 'Login',
      resource: '',
      description: ''
    });
    await this.auditRepository.save(audit);

    // Generate token
    const token = generateToken(user.id);

    return {
      id: user.id!,
      name: user.name,
      user_name: user.user_name,
      email: user.email,
      contact_no: user.contact_no,
      is_delete: user.is_delete,
      role_id: user.role_id,
      token,
      permissions: enrichedPermissions,
      role
    };
  }
}
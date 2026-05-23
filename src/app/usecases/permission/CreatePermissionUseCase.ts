import { IPermissionRepository } from '../../../domain/repositories/IPermissionRepositiory';
import { IAuditRepository } from '../../../domain/repositories/IAuditRepositiory';
import { IResourceRepository } from '../../../domain/repositories/IResorceRepository';
import { Permission } from '../../../domain/entities/Permission';
import { Audit } from '../../../domain/entities/Audit';
import { CreatePermissionDTO, PermissionResponseDTO } from '../../dtos/permission/PermissionDTO';
import { validateCreatePermission } from '../../validators/permissionValidators';

export class CreatePermissionUseCase {
  constructor(
    private permissionRepository: IPermissionRepository,
    private auditRepository: IAuditRepository,
    private resourceRepository: IResourceRepository
  ) {}

  async execute(dto: CreatePermissionDTO, createdBy: string = 'System'): Promise<PermissionResponseDTO> {
    // Validate input
    await validateCreatePermission(dto, this.resourceRepository, this.permissionRepository);

    // Get resource name for response
    const resource = await this.resourceRepository.findById(dto.resource_id);

    const permission = new Permission({
      create_s: dto.create_s,
      update_s: dto.update_s,
      delete_s: dto.delete_s,
      view: dto.view,
      resource_id: dto.resource_id,
      role_id: dto.role_id
    });

    const savedPermission = await this.permissionRepository.save(permission);

    const audit = new Audit({
      user: createdBy,
      action: 'Create',
      resource: 'Permission',
      description: JSON.stringify(savedPermission)
    });
    await this.auditRepository.save(audit);

    return this.toResponseDTO(savedPermission, resource?.name);
  }

  private toResponseDTO(permission: Permission, resourceName?: string): PermissionResponseDTO {
    return {
      id: permission.id!,
      create_s: permission.create_s,
      update_s: permission.update_s,
      delete_s: permission.delete_s,
      view: permission.view,
      resource_id: permission.resource_id,
      resource_name: resourceName,
      role_id: permission.role_id,
      created_at: permission.created_at,
      updated_at: permission.updated_at
    };
  }
}

export default CreatePermissionUseCase;
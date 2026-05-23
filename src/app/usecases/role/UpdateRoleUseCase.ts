import { IRoleRepository } from '../../../domain/repositories/IRoleRepositiory';
import { IAuditRepository } from '../../../domain/repositories/IAuditRepositiory';
import { Audit } from '../../../domain/entities/Audit';
import { validateUpdateRole } from '../../validators';
import { NotFound } from '../../../shared/errors/baseError';

export class UpdateRoleUseCase {
  constructor(
    private roleRepository: IRoleRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(
    roleId: number, 
    data: { is_delete?: boolean }, 
    updatedBy: string = 'System'
  ): Promise<void> {
    // Validate input
    await validateUpdateRole(roleId, data, this.roleRepository);

    const existingRole = await this.roleRepository.findById(roleId);
    if (!existingRole) {
      throw new NotFound('Role not found');
    }

    const oldData = JSON.stringify({
      id: existingRole.id,
      name: existingRole.name,
      keyValue: existingRole.keyValue,
      is_delete: existingRole.is_delete
    });

    if (data.is_delete !== undefined) {
      existingRole.is_delete = data.is_delete;
      await this.roleRepository.update(roleId, { is_delete: data.is_delete });
    }

    const audit = new Audit({
      user: updatedBy,
      action: 'Update',
      resource: 'Role',
      description: `Old: ${oldData}, New: ${JSON.stringify({ is_delete: data.is_delete })}`
    });
    await this.auditRepository.save(audit);
  }
}

export default UpdateRoleUseCase;
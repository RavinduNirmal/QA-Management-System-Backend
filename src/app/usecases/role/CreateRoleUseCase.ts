import { IRoleRepository } from '../../../domain/repositories/IRoleRepositiory';
import { IAuditRepository } from '../../../domain/repositories/IAuditRepositiory';
import { Role } from '../../../domain/entities/Role';
import { Audit } from '../../../domain/entities/Audit';
import { validateCreateRole } from '../../validators';

export class CreateRoleUseCase {
  constructor(
    private roleRepository: IRoleRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(name: string, keyValue: string, createdBy: string = 'System'): Promise<Role> {
    // Validate input
    await validateCreateRole({ name, keyValue }, this.roleRepository);

    const role = new Role({
      name,
      keyValue,
      is_delete: false
    });

    const savedRole = await this.roleRepository.save(role);

    const audit = new Audit({
      user: createdBy,
      action: 'Create',
      resource: 'Role',
      description: JSON.stringify(savedRole)
    });
    await this.auditRepository.save(audit);

    return savedRole;
  }
}

export default CreateRoleUseCase;
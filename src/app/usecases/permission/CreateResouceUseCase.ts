import { IResourceRepository } from '../../../domain/repositories/IResorceRepository';
import { IAuditRepository } from '../../../domain/repositories/IAuditRepositiory';
import { Resource } from '../../../domain/entities/Resource';
import { Audit } from '../../../domain/entities/Audit';
import { Conflict, BadRequest } from '../../../shared/errors/baseError';

export class CreateResourceUseCase {
  constructor(
    private resourceRepository: IResourceRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(name: string, createdBy: string = 'System'): Promise<Resource> {
    if (!name || name.trim().length === 0) {
      throw new BadRequest('Resource name is required');
    }

    const existingResource = await this.resourceRepository.findByName(name);
    if (existingResource) {
      throw new Conflict('Resource with this name already exists');
    }

    const resource = new Resource({ name: name.trim() });
    const savedResource = await this.resourceRepository.save(resource);

    const audit = new Audit({
      user: createdBy,
      action: 'Create',
      resource: 'Resource',
      description: JSON.stringify(savedResource)
    });
    await this.auditRepository.save(audit);

    return savedResource;
  }
}

export default CreateResourceUseCase;
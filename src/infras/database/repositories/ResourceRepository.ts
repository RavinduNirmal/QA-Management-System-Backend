import { getRepository, Repository, Like, In } from 'typeorm';
import { Resource as ResourceEntity } from '../types/resource';
import { IResourceRepository, FindResourcesOptions, ResourceWithPermissionDTO } from '../../../domain/repositories/IResorceRepository';
import { Resource } from '../../../domain/entities/Resource';
import { Permission } from '../types/permissions';

export class ResourceRepository implements IResourceRepository {
  private repository: Repository<ResourceEntity>;
  private permissionRepository: Repository<Permission>;

  constructor() {
    this.repository = getRepository(ResourceEntity);
    this.permissionRepository = getRepository(Permission);
  }

  async findById(id: number): Promise<Resource | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async find(options: any): Promise<Resource[]> {
    const entities = await this.repository.find(options);
    return entities.map(entity => this.toDomain(entity));
  }

  async findOne(options: any): Promise<Resource | null> {
    const entity = await this.repository.findOne(options);
    return entity ? this.toDomain(entity) : null;
  }

  async findAndCount(options: FindResourcesOptions): Promise<[Resource[], number]> {
    const [entities, total] = await this.repository.findAndCount(options);
    const resources = entities.map(entity => this.toDomain(entity));
    return [resources, total];
  }

  async save(resource: Resource): Promise<Resource> {
    const entity = this.toEntity(resource);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, resourceData: Partial<Resource>): Promise<void> {
    await this.repository.update(id, resourceData);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByName(name: string): Promise<Resource | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByNames(names: string[]): Promise<Resource[]> {
    // Fixed: Use In operator for array of names
    const entities = await this.repository.find({ 
      where: { name: In(names) } 
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.repository.count({ where: { name } });
    return count > 0;
  }

  async getResourcesWithPermissions(roleId: number): Promise<ResourceWithPermissionDTO[]> {
    // Get all resources
    const resources = await this.repository.find();
    
    // Get permissions for the specified role
    const permissions = await this.permissionRepository.find({
      where: { role_id: roleId }
    });
    
    // Create a map of resource_id to permissions
    const permissionMap = new Map<number, {
      role_id: number;
      create_s: boolean;
      update_s: boolean;
      delete_s: boolean;
      view: boolean;
    }>();
    
    permissions.forEach(perm => {
      permissionMap.set(perm.resource_id, {
        role_id: perm.role_id,
        create_s: perm.create_s,
        update_s: perm.update_s,
        delete_s: perm.delete_s,
        view: perm.view
      });
    });
    
    // Return resources with their permissions
    return resources.map(resource => ({
      id: resource.id,
      name: resource.name,
      created_at: resource.created_at,
      updated_at: resource.updated_at,
      permissions: permissionMap.get(resource.id)
    }));
  }

  getDefaultResources(): string[] {
    return ['User', 'Role', 'Audit', 'Report', 'Permission', 'Resource'];
  }

  async ensureDefaultResources(): Promise<Resource[]> {
    const defaultNames = this.getDefaultResources();
    const existingResources = await this.repository.find();
    const existingNames = new Set(existingResources.map(r => r.name));
    
    const newResources = defaultNames
      .filter(name => !existingNames.has(name))
      .map(name => ({ name }));
    
    if (newResources.length > 0) {
      const saved = await this.repository.save(newResources);
      return saved.map(s => this.toDomain(s));
    }
    
    return existingResources.map(e => this.toDomain(e));
  }

  async count(where?: any): Promise<number> {
    return this.repository.count({ where });
  }

  async searchByName(searchTerm: string, limit: number = 10): Promise<Resource[]> {
    const entities = await this.repository.find({
      where: { name: Like(`%${searchTerm}%`) },
      take: limit
    });
    return entities.map(entity => this.toDomain(entity));
  }

  private toDomain(entity: ResourceEntity): Resource {
    return new Resource({
      id: entity.id,
      name: entity.name,
      created_at: entity.created_at,
      updated_at: entity.updated_at
    });
  }

  private toEntity(domain: Resource): ResourceEntity {
    const entity = new ResourceEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.created_at = domain.created_at;
    entity.updated_at = domain.updated_at;
    return entity;
  }
}

export default ResourceRepository;
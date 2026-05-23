import { getRepository, Repository, In } from 'typeorm';
import { Permission as PermissionEntity } from '../types/permissions';
import { IPermissionRepository, FindPermissionsOptions, PermissionWithResourceDTO } from '../../../domain/repositories/IPermissionRepositiory';
import { Permission } from '../../../domain/entities/Permission';
import { Resource } from '../types/resource';

export class PermissionRepository implements IPermissionRepository {
  private repository: Repository<PermissionEntity>;
  private resourceRepository: Repository<Resource>;

  constructor() {
    this.repository = getRepository(PermissionEntity);
    this.resourceRepository = getRepository(Resource);
  }

  async findById(id: number): Promise<Permission | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async find(options: any): Promise<Permission[]> {
    const entities = await this.repository.find(options);
    return entities.map(entity => this.toDomain(entity));
  }

  async findOne(options: any): Promise<Permission | null> {
    const entity = await this.repository.findOne(options);
    return entity ? this.toDomain(entity) : null;
  }

  async findAndCount(options: FindPermissionsOptions): Promise<[Permission[], number]> {
    const [entities, total] = await this.repository.findAndCount(options);
    const permissions = entities.map(entity => this.toDomain(entity));
    return [permissions, total];
  }

  async save(permission: Permission): Promise<Permission> {
    const entity = this.toEntity(permission);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, permissionData: Partial<Permission>): Promise<void> {
    await this.repository.update(id, permissionData);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByRoleId(roleId: number): Promise<Permission[]> {
    const entities = await this.repository.find({ where: { role_id: roleId } });
    return entities.map(entity => this.toDomain(entity));
  }

  async findByResourceId(resourceId: number): Promise<Permission[]> {
    const entities = await this.repository.find({ where: { resource_id: resourceId } });
    return entities.map(entity => this.toDomain(entity));
  }

  async findByRoleAndResource(roleId: number, resourceId: number): Promise<Permission | null> {
    const entity = await this.repository.findOne({
      where: { role_id: roleId, resource_id: resourceId }
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByRoleIds(roleIds: number[]): Promise<Permission[]> {
    // Fixed: Use In operator for array of role IDs
    const entities = await this.repository.find({ 
      where: { role_id: In(roleIds) } 
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async exists(roleId: number, resourceId: number): Promise<boolean> {
    const count = await this.repository.count({
      where: { role_id: roleId, resource_id: resourceId }
    });
    return count > 0;
  }

  async existsForRole(roleId: number): Promise<boolean> {
    const count = await this.repository.count({ where: { role_id: roleId } });
    return count > 0;
  }

  async bulkCreate(permissions: Permission[]): Promise<Permission[]> {
    const entities = permissions.map(p => this.toEntity(p));
    const saved = await this.repository.save(entities);
    return saved.map(s => this.toDomain(s));
  }

  async bulkUpdate(permissions: Array<{ id: number; data: Partial<Permission> }>): Promise<void> {
    for (const perm of permissions) {
      await this.repository.update(perm.id, perm.data);
    }
  }

  async deleteByRoleId(roleId: number): Promise<number> {
    const result = await this.repository.delete({ role_id: roleId });
    return result.affected || 0;
  }

  async deleteByResourceId(resourceId: number): Promise<number> {
    const result = await this.repository.delete({ resource_id: resourceId });
    return result.affected || 0;
  }

  async getRolePermissionsWithResources(roleId: number): Promise<PermissionWithResourceDTO[]> {
    const permissions = await this.repository.find({
      where: { role_id: roleId },
      relations: ['resource']
    });
    
    return permissions.map(perm => ({
      id: perm.id,
      create_s: perm.create_s,
      update_s: perm.update_s,
      delete_s: perm.delete_s,
      view: perm.view,
      resource_id: perm.resource_id,
      role_id: perm.role_id,
      resourceName: perm.resource?.name || 'Unknown'
    }));
  }

  async hasPermission(roleId: number, resourceId: number, action: 'create' | 'update' | 'delete' | 'view'): Promise<boolean> {
    const permission = await this.repository.findOne({
      where: { role_id: roleId, resource_id: resourceId }
    });
    
    if (!permission) return false;
    
    switch (action) {
      case 'create': return permission.create_s;
      case 'update': return permission.update_s;
      case 'delete': return permission.delete_s;
      case 'view': return permission.view;
      default: return false;
    }
  }

  async copyPermissions(fromRoleId: number, toRoleId: number): Promise<void> {
    const permissions = await this.repository.find({ where: { role_id: fromRoleId } });
    // Fixed: Explicitly type the new permissions object
    const newPermissions: Partial<PermissionEntity>[] = permissions.map(perm => ({
      create_s: perm.create_s,
      update_s: perm.update_s,
      delete_s: perm.delete_s,
      view: perm.view,
      resource_id: perm.resource_id,
      role_id: toRoleId
    }));
    await this.repository.save(newPermissions as PermissionEntity[]);
  }

  private toDomain(entity: PermissionEntity): Permission {
    return new Permission({
      id: entity.id,
      create_s: entity.create_s,
      update_s: entity.update_s,
      delete_s: entity.delete_s,
      view: entity.view,
      resource_id: entity.resource_id,
      role_id: entity.role_id,
      created_at: entity.created_at,
      updated_at: entity.updated_at
    });
  }

  private toEntity(domain: Permission): PermissionEntity {
    const entity = new PermissionEntity();
    entity.id = domain.id;
    entity.create_s = domain.create_s;
    entity.update_s = domain.update_s;
    entity.delete_s = domain.delete_s;
    entity.view = domain.view;
    entity.resource_id = domain.resource_id;
    entity.role_id = domain.role_id;
    entity.created_at = domain.created_at;
    entity.updated_at = domain.updated_at;
    return entity;
  }
}

export default PermissionRepository;
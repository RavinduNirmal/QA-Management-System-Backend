import { getRepository, Repository } from 'typeorm';
import { Role as RoleEntity } from '../types/roles';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepositiory';
import { Role } from '../../../domain/entities/Role';

export class RoleRepository implements IRoleRepository {
  private repository: Repository<RoleEntity>;

  constructor() {
    this.repository = getRepository(RoleEntity);
  }

  async findById(id: number): Promise<Role | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findOne(options: any): Promise<Role | null> {
    const entity = await this.repository.findOne(options);
    return entity ? this.toDomain(entity) : null;
  }

  async findAndCount(options: any): Promise<[Role[], number]> {
    const [entities, total] = await this.repository.findAndCount(options);
    const roles = entities.map(entity => this.toDomain(entity));
    return [roles, total];
  }

  async save(role: Role): Promise<Role> {
    const entity = this.toEntity(role);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, roleData: Partial<Role>): Promise<void> {
    await this.repository.update(id, roleData);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByName(name: string): Promise<Role | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByKeyValue(keyValue: string): Promise<Role | null> {
    const entity = await this.repository.findOne({ where: { keyValue } });
    return entity ? this.toDomain(entity) : null;
  }

  private toDomain(entity: RoleEntity): Role {
    return new Role({
      id: entity.id,
      name: entity.name,
      keyValue: entity.keyValue,
      is_delete: entity.is_delete,
      created_at: entity.created_at,
      updated_at: entity.updated_at
    });
  }

  private toEntity(domain: Role): RoleEntity {
    const entity = new RoleEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.keyValue = domain.keyValue;
    entity.is_delete = domain.is_delete;
    entity.created_at = domain.created_at;
    entity.updated_at = domain.updated_at;
    return entity;
  }
}
import { getRepository, Repository, FindManyOptions } from 'typeorm';
import { Audit as AuditEntity } from '../types/audit';
import { IAuditRepository, FindAuditsOptions } from '../../../domain/repositories/IAuditRepositiory';
import { Audit } from '../../../domain/entities/Audit';

export class AuditRepository implements IAuditRepository {
  private repository: Repository<AuditEntity>;

  constructor() {
    this.repository = getRepository(AuditEntity);
  }

  async findAndCount(options: FindAuditsOptions): Promise<[Audit[], number]> {
    const [entities, total] = await this.repository.findAndCount(options as FindManyOptions<AuditEntity>);
    const audits = entities.map(entity => this.toDomain(entity));
    return [audits, total];
  }

  async save(audit: Audit): Promise<Audit> {
    const entity = this.toEntity(audit);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: AuditEntity): Audit {
    return new Audit({
      id: entity.id,
      user: entity.user,
      action: entity.action,
      resource: entity.resource,
      description: entity.description,
      created_at: entity.created_at,
      updated_at: entity.updated_at
    });
  }

  private toEntity(domain: Audit): AuditEntity {
    const entity = new AuditEntity();
    entity.id = domain.id;
    entity.user = domain.user;
    entity.action = domain.action;
    entity.resource = domain.resource;
    entity.description = domain.description;
    entity.created_at = domain.created_at;
    entity.updated_at = domain.updated_at;
    return entity;
  }
}
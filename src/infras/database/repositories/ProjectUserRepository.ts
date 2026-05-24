import { getRepository, Repository, FindManyOptions } from "typeorm";
import { ProjectUser as ProjectUserEntity } from "../types/projectUser";
import { IProjectUserRepository, FindProjectUsersOptions } from "../../../domain/repositories/IProjectUserRepository";
import { ProjectUser, ProjectPermission } from "../../../domain/entities/ProjectUser";

export class ProjectUserRepository implements IProjectUserRepository {
  private repository: Repository<ProjectUserEntity>;

  constructor() {
    this.repository = getRepository(ProjectUserEntity);
  }

  async findById(id: number): Promise<ProjectUser | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ["user", "project"],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findOne(options: any): Promise<ProjectUser | null> {
    const entity = await this.repository.findOne(options);
    return entity ? this.toDomain(entity) : null;
  }

  async findAndCount(options: FindProjectUsersOptions): Promise<[ProjectUser[], number]> {
    const findOptions: FindManyOptions<ProjectUserEntity> = {
      where: options.where || {},
      skip: options.skip,
      take: options.take,
      order: options.order || { assigned_at: "DESC" },
      relations: ["user", "project"],
    };
    const [entities, total] = await this.repository.findAndCount(findOptions);
    const projectUsers = entities.map((entity) => this.toDomain(entity));
    return [projectUsers, total];
  }

  async save(projectUser: ProjectUser): Promise<ProjectUser> {
    const entity = this.toEntity(projectUser);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, projectUserData: Partial<ProjectUser>): Promise<void> {
    await this.repository.update(id, projectUserData);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByUserAndProject(userId: number, projectId: number): Promise<ProjectUser | null> {
    const entity = await this.repository.findOne({
      where: { user_id: userId, project_id: projectId },
      relations: ["user", "project"],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUser(userId: number): Promise<ProjectUser[]> {
    const entities = await this.repository.find({
      where: { user_id: userId, is_active: true },
      relations: ["project"],
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByProject(projectId: number): Promise<ProjectUser[]> {
    const entities = await this.repository.find({
      where: { project_id: projectId, is_active: true },
      relations: ["user"],
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async deleteByUserAndProject(userId: number, projectId: number): Promise<void> {
    await this.repository.delete({ user_id: userId, project_id: projectId });
  }

  async hasPermission(userId: number, projectId: number, permission: ProjectPermission): Promise<boolean> {
    const assignment = await this.repository.findOne({
      where: { user_id: userId, project_id: projectId, is_active: true },
    });
    if (!assignment) return false;
    const permissions = assignment.permissions as ProjectPermission[];
    return permissions.includes(permission) || permissions.includes(ProjectPermission.FULL_ACCESS);
  }

  private toDomain(entity: ProjectUserEntity): ProjectUser {
    return new ProjectUser({
      id: entity.id,
      user_id: entity.user_id,
      project_id: entity.project_id,
      permissions: entity.permissions as ProjectPermission[],
      role_in_project: entity.role_in_project,
      is_active: entity.is_active,
      assigned_at: entity.assigned_at,
      updated_at: entity.updated_at,
    });
  }

  private toEntity(domain: ProjectUser): ProjectUserEntity {
    const entity = new ProjectUserEntity();
    entity.id = domain.id;
    entity.user_id = domain.user_id;
    entity.project_id = domain.project_id;
    entity.permissions = domain.permissions;
    entity.role_in_project = domain.role_in_project;
    entity.is_active = domain.is_active;
    entity.assigned_at = domain.assigned_at;
    entity.updated_at = domain.updated_at;
    return entity;
  }
}
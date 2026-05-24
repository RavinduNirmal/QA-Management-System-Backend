import { getRepository, Repository, FindManyOptions } from "typeorm";
import { Project as ProjectEntity } from "../types/project";
import { IProjectRepository, FindProjectsOptions } from "../../../domain/repositories/IProjectRepository";
import { Project } from "../../../domain/entities/Project";

export class ProjectRepository implements IProjectRepository {
  private repository: Repository<ProjectEntity>;

  constructor() {
    this.repository = getRepository(ProjectEntity);
  }

  async findById(id: number): Promise<Project | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ["project_lead", "qa_lead"],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findOne(options: any): Promise<Project | null> {
    const entity = await this.repository.findOne(options);
    return entity ? this.toDomain(entity) : null;
  }

  async findAndCount(options: FindProjectsOptions): Promise<[Project[], number]> {
    const findOptions: FindManyOptions<ProjectEntity> = {
      where: options.where || {},
      skip: options.skip,
      take: options.take,
      order: options.order || { created_at: "DESC" },
      relations: ["project_lead", "qa_lead"],
    };
    const [entities, total] = await this.repository.findAndCount(findOptions);
    const projects = entities.map((entity) => this.toDomain(entity));
    return [projects, total];
  }

  async save(project: Project): Promise<Project> {
    const entity = this.toEntity(project);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, projectData: Partial<Project>): Promise<void> {
    await this.repository.update(id, projectData);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByName(name: string): Promise<Project | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? this.toDomain(entity) : null;
  }

  async count(where?: any): Promise<number> {
    return this.repository.count({ where });
  }

  private toDomain(entity: ProjectEntity): Project {
    return new Project({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      code: entity.code,
      is_active: entity.is_active,
      is_archived: entity.is_archived,
      start_date: entity.start_date,
      end_date: entity.end_date,
      project_lead_id: entity.project_lead_id,
      qa_lead_id: entity.qa_lead_id,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }

  private toEntity(domain: Project): ProjectEntity {
    const entity = new ProjectEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.code = domain.code;
    entity.is_active = domain.is_active;
    entity.is_archived = domain.is_archived;
    entity.start_date = domain.start_date;
    entity.end_date = domain.end_date;
    entity.project_lead_id = domain.project_lead_id;
    entity.qa_lead_id = domain.qa_lead_id;
    entity.created_at = domain.created_at;
    entity.updated_at = domain.updated_at;
    return entity;
  }
}
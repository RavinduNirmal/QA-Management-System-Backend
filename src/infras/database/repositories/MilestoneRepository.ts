import { getRepository, Repository, FindManyOptions } from "typeorm";
import { Milestone as MilestoneEntity, MilestoneStatus } from "../../database/types/milestone";
import { IMilestoneRepository, FindMilestonesOptions } from "../../../domain/repositories/IMilestoneRepository";
import { Milestone } from "../../../domain/entities/Milestone";

export class MilestoneRepository implements IMilestoneRepository {
  private repository: Repository<MilestoneEntity>;

  constructor() {
    this.repository = getRepository(MilestoneEntity);
  }

  async findById(id: number): Promise<Milestone | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ["project", "assigned_user", "test_cycles"],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findOne(options: any): Promise<Milestone | null> {
    const entity = await this.repository.findOne(options);
    return entity ? this.toDomain(entity) : null;
  }

  async findAndCount(options: FindMilestonesOptions): Promise<[Milestone[], number]> {
    const findOptions: FindManyOptions<MilestoneEntity> = {
      where: options.where || {},
      skip: options.skip,
      take: options.take,
      order: options.order || { created_at: "DESC" },
      relations: ["project", "assigned_user"],
    };
    const [entities, total] = await this.repository.findAndCount(findOptions);
    const milestones = entities.map((entity) => this.toDomain(entity));
    return [milestones, total];
  }

  async save(milestone: Milestone): Promise<Milestone> {
    const entity = this.toEntity(milestone);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, milestoneData: Partial<Milestone>): Promise<void> {
    await this.repository.update(id, milestoneData);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByProject(projectId: number): Promise<Milestone[]> {
    const entities = await this.repository.find({
      where: { project_id: projectId },
      relations: ["project", "assigned_user"],
      order: { created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByStatus(status: MilestoneStatus): Promise<Milestone[]> {
    const entities = await this.repository.find({
      where: { status },
      relations: ["project"],
      order: { created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async getReleaseReadiness(milestoneId: number): Promise<{
    readiness_score: number;
    blocking_issues: string[];
    recommendation: string;
  }> {
    const milestone = await this.repository.findOne({
      where: { id: milestoneId },
      relations: ["test_cycles"],
    });

    if (!milestone) {
      return {
        readiness_score: 0,
        blocking_issues: ["Milestone not found"],
        recommendation: "NOT_READY",
      };
    }

    const cycles = milestone.test_cycles || [];
    const completedCycles = cycles.filter(c => c.status === "completed").length;
    const inProgressCycles = cycles.filter(c => c.status === "in_progress").length;
    
    let readinessScore = 0;
    const blockingIssues: string[] = [];

    if (completedCycles === cycles.length && cycles.length > 0) {
      readinessScore += 50;
    } else if (completedCycles > 0) {
      readinessScore += (completedCycles / cycles.length) * 30;
      blockingIssues.push(`${cycles.length - completedCycles} test cycle(s) not completed`);
    }

    if (inProgressCycles === 0 && cycles.length > 0) {
      readinessScore += 20;
    } else {
      blockingIssues.push(`${inProgressCycles} test cycle(s) still in progress`);
    }

    let recommendation = "NOT_READY";
    if (readinessScore >= 80) recommendation = "READY";
    else if (readinessScore >= 60) recommendation = "CONDITIONAL";
    else if (readinessScore >= 40) recommendation = "NOT_READY";
    else recommendation = "BLOCKED";

    return {
      readiness_score: readinessScore,
      blocking_issues: blockingIssues,
      recommendation,
    };
  }

  private toDomain(entity: MilestoneEntity): Milestone {
    return new Milestone({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      project_id: entity.project_id,
      release_version: entity.release_version,
      status: entity.status,
      start_date: entity.start_date,
      end_date: entity.end_date,
      assigned_to: entity.assigned_to,
      is_template: entity.is_template,
      template_config: entity.template_config,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }

  private toEntity(domain: Milestone): MilestoneEntity {
    const entity = new MilestoneEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.project_id = domain.project_id;
    entity.release_version = domain.release_version;
    entity.status = domain.status;
    entity.start_date = domain.start_date;
    entity.end_date = domain.end_date;
    entity.assigned_to = domain.assigned_to;
    entity.is_template = domain.is_template;
    entity.template_config = domain.template_config;
    entity.created_at = domain.created_at;
    entity.updated_at = domain.updated_at;
    return entity;
  }
}
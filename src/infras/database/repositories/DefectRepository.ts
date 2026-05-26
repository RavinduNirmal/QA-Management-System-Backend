import { getRepository, Repository, FindManyOptions } from "typeorm";
import { Defect as DefectEntity, DefectQAStatus, DefectDevStatus } from "../../database/types/defect";
import { IDefectRepository, FindDefectsOptions } from "../../../domain/repositories/IDefectRepository";
import { Defect } from "../../../domain/entities/Defect";

export class DefectRepository implements IDefectRepository {
  private repository: Repository<DefectEntity>;

  constructor() {
    this.repository = getRepository(DefectEntity);
  }

  async findById(id: number): Promise<Defect | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ["project", "test_case", "test_cycle", "reporter", "assignee", "fixed_by", "verified_by"],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findOne(options: any): Promise<Defect | null> {
    const entity = await this.repository.findOne(options);
    return entity ? this.toDomain(entity) : null;
  }

  async findAndCount(options: FindDefectsOptions): Promise<[Defect[], number]> {
    const findOptions: FindManyOptions<DefectEntity> = {
      where: options.where || {},
      skip: options.skip,
      take: options.take,
      order: options.order || { created_at: "DESC" },
      relations: ["project", "test_case", "reporter", "assignee"],
    };
    const [entities, total] = await this.repository.findAndCount(findOptions);
    const defects = entities.map((entity) => this.toDomain(entity));
    return [defects, total];
  }

  async save(defect: Defect): Promise<Defect> {
    const entity = this.toEntity(defect);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, defectData: Partial<Defect>): Promise<void> {
    await this.repository.update(id, defectData);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByProject(projectId: number): Promise<Defect[]> {
    const entities = await this.repository.find({
      where: { project_id: projectId },
      relations: ["reporter", "assignee"],
      order: { created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByAssignee(userId: number): Promise<Defect[]> {
    const entities = await this.repository.find({
      where: { assigned_to: userId },
      relations: ["project", "reporter"],
      order: { priority: "ASC", created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByReporter(userId: number): Promise<Defect[]> {
    const entities = await this.repository.find({
      where: { reported_by: userId },
      relations: ["project", "assignee"],
      order: { created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByQAStatus(status: DefectQAStatus): Promise<Defect[]> {
    const entities = await this.repository.find({
      where: { qa_status: status },
      relations: ["project", "assignee", "reporter"],
      order: { created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByDevStatus(status: DefectDevStatus): Promise<Defect[]> {
    const entities = await this.repository.find({
      where: { dev_status: status },
      relations: ["project", "assignee", "reporter"],
      order: { created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByTestExecution(executionId: number): Promise<Defect[]> {
    const entities = await this.repository.find({
      where: { test_execution_id: executionId },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async getDefectStats(projectId: number): Promise<{
    total: number;
    by_qa_status: Record<string, number>;
    by_dev_status: Record<string, number>;
    by_severity: Record<string, number>;
    by_priority: Record<string, number>;
    avg_resolution_time: number;
    reopen_rate: number;
    defect_density: number;
  }> {
    const defects = await this.repository.find({
      where: { project_id: projectId },
    });

    const by_qa_status: Record<string, number> = {};
    const by_dev_status: Record<string, number> = {};
    const by_severity: Record<string, number> = {};
    const by_priority: Record<string, number> = {};

    let totalResolutionTime = 0;
    let resolvedCount = 0;
    let reopenedCount = 0;

    defects.forEach((defect) => {
      by_qa_status[defect.qa_status] = (by_qa_status[defect.qa_status] || 0) + 1;
      by_dev_status[defect.dev_status] = (by_dev_status[defect.dev_status] || 0) + 1;
      by_severity[defect.severity] = (by_severity[defect.severity] || 0) + 1;
      by_priority[defect.priority] = (by_priority[defect.priority] || 0) + 1;

      if (defect.qa_status === DefectQAStatus.REOPENED) {
        reopenedCount++;
      }

      if (defect.fixed_date && defect.reported_date) {
        const resolutionTime = new Date(defect.fixed_date).getTime() - new Date(defect.reported_date).getTime();
        totalResolutionTime += resolutionTime / (1000 * 60 * 60);
        resolvedCount++;
      }
    });

    return {
      total: defects.length,
      by_qa_status,
      by_dev_status,
      by_severity,
      by_priority,
      avg_resolution_time: resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0,
      reopen_rate: defects.length > 0 ? (reopenedCount / defects.length) * 100 : 0,
      defect_density: 0,
    };
  }

  async addComment(defectId: number, userId: number, userName: string, userRole: string, comment: string): Promise<void> {
    const defect = await this.repository.findOne({ where: { id: defectId } });
    if (defect) {
      const comments = defect.comments || [];
      const newComment = {
        id: Date.now(),
        user_id: userId,
        user_name: userName,
        user_role: userRole,
        comment,
        created_at: new Date(),
      };
      comments.push(newComment);
      await this.repository.update(defectId, { comments });
    }
  }

  async addHistory(
    defectId: number,
    field: string,
    oldValue: string,
    newValue: string,
    changedBy: number,
    changedByName: string,
    changedByRole: string
  ): Promise<void> {
    const defect = await this.repository.findOne({ where: { id: defectId } });
    if (defect) {
      const history = defect.history || [];
      const newHistory = {
        field,
        old_value: oldValue,
        new_value: newValue,
        changed_by: changedBy,
        changed_by_name: changedByName,
        changed_by_role: changedByRole,
        changed_at: new Date(),
      };
      history.push(newHistory);
      await this.repository.update(defectId, { history });
    }
  }

  async getDefectsForVerification(projectId: number, buildVersion?: string): Promise<Defect[]> {
    const where: any = {
      project_id: projectId,
      dev_status: DefectDevStatus.FIXED,
      qa_status: DefectQAStatus.OPEN,
    };
    if (buildVersion) {
      where.fixed_in_version = buildVersion;
    }
    const entities = await this.repository.find({
      where,
      relations: ["test_case", "reporter", "assignee"],
      order: { priority: "ASC", created_at: "ASC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  private toDomain(entity: DefectEntity): Defect {
    return new Defect({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      steps_to_reproduce: entity.steps_to_reproduce,
      actual_result: entity.actual_result,
      expected_result: entity.expected_result,
      severity: entity.severity,
      priority: entity.priority,
      qa_status: entity.qa_status,
      dev_status: entity.dev_status,
      resolution: entity.resolution,
      environment: entity.environment,
      browser: entity.browser,
      device: entity.device,
      os: entity.os,
      build_version: entity.build_version,
      is_common_bug: entity.is_common_bug,
      affected_projects: entity.affected_projects,
      affected_versions: entity.affected_versions,
      fixed_in_version: entity.fixed_in_version,
      project_id: entity.project_id,
      test_case_id: entity.test_case_id,
      test_execution_id: entity.test_execution_id,
      test_cycle_id: entity.test_cycle_id,
      reported_by: entity.reported_by,
      assigned_to: entity.assigned_to,
      fixed_by: entity.fixed_by,
      verified_by: entity.verified_by,
      closed_by: entity.closed_by,
      reported_date: entity.reported_date,
      assigned_date: entity.assigned_date,
      fixed_date: entity.fixed_date,
      verified_date: entity.verified_date,
      closed_date: entity.closed_date,
      attachments: entity.attachments,
      comments: entity.comments,
      history: entity.history,
      tags: entity.tags,
      estimated_fix_time: entity.estimated_fix_time,
      actual_fix_time: entity.actual_fix_time,
      duplicate_of: entity.duplicate_of,
      related_bugs: entity.related_bugs,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }

  private toEntity(domain: Defect): DefectEntity {
    const entity = new DefectEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.description = domain.description;
    entity.steps_to_reproduce = domain.steps_to_reproduce;
    entity.actual_result = domain.actual_result;
    entity.expected_result = domain.expected_result;
    entity.severity = domain.severity;
    entity.priority = domain.priority;
    entity.qa_status = domain.qa_status;
    entity.dev_status = domain.dev_status;
    entity.resolution = domain.resolution;
    entity.environment = domain.environment;
    entity.browser = domain.browser;
    entity.device = domain.device;
    entity.os = domain.os;
    entity.build_version = domain.build_version;
    entity.is_common_bug = domain.is_common_bug;
    entity.affected_projects = domain.affected_projects;
    entity.affected_versions = domain.affected_versions;
    entity.fixed_in_version = domain.fixed_in_version;
    entity.project_id = domain.project_id;
    entity.test_case_id = domain.test_case_id;
    entity.test_execution_id = domain.test_execution_id;
    entity.test_cycle_id = domain.test_cycle_id;
    entity.reported_by = domain.reported_by;
    entity.assigned_to = domain.assigned_to;
    entity.fixed_by = domain.fixed_by;
    entity.verified_by = domain.verified_by;
    entity.closed_by = domain.closed_by;
    entity.reported_date = domain.reported_date;
    entity.assigned_date = domain.assigned_date;
    entity.fixed_date = domain.fixed_date;
    entity.verified_date = domain.verified_date;
    entity.closed_date = domain.closed_date;
    entity.attachments = domain.attachments;
    entity.comments = domain.comments;
    entity.history = domain.history;
    entity.tags = domain.tags;
    entity.estimated_fix_time = domain.estimated_fix_time;
    entity.actual_fix_time = domain.actual_fix_time;
    entity.duplicate_of = domain.duplicate_of;
    entity.related_bugs = domain.related_bugs;
    entity.created_at = domain.created_at;
    entity.updated_at = domain.updated_at;
    return entity;
  }
}
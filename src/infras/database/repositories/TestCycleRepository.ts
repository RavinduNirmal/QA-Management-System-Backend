import { getRepository, Repository, FindManyOptions } from "typeorm";
import { TestCycle as TestCycleEntity, TestCycleStatus } from "../../database/types/testCycle";
import { ITestCycleRepository, FindTestCyclesOptions } from "../../../domain/repositories/ITestCycleRepository";
import { TestCycle } from "../../../domain/entities/TestCycle";

export class TestCycleRepository implements ITestCycleRepository {
  private repository: Repository<TestCycleEntity>;

  constructor() {
    this.repository = getRepository(TestCycleEntity);
  }

  async findById(id: number): Promise<TestCycle | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ["project", "milestone", "creator"],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findOne(options: any): Promise<TestCycle | null> {
    const entity = await this.repository.findOne(options);
    return entity ? this.toDomain(entity) : null;
  }

  async findAndCount(options: FindTestCyclesOptions): Promise<[TestCycle[], number]> {
    const findOptions: FindManyOptions<TestCycleEntity> = {
      where: options.where || {},
      skip: options.skip,
      take: options.take,
      order: options.order || { created_at: "DESC" },
      relations: ["project", "milestone", "creator"],
    };
    const [entities, total] = await this.repository.findAndCount(findOptions);
    const cycles = entities.map((entity) => this.toDomain(entity));
    return [cycles, total];
  }

  async save(testCycle: TestCycle): Promise<TestCycle> {
    const entity = this.toEntity(testCycle);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, testCycleData: Partial<TestCycle>): Promise<void> {
    await this.repository.update(id, testCycleData);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByProject(projectId: number): Promise<TestCycle[]> {
    const entities = await this.repository.find({
      where: { project_id: projectId },
      relations: ["project", "milestone"],
      order: { created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByMilestone(milestoneId: number): Promise<TestCycle[]> {
    const entities = await this.repository.find({
      where: { milestone_id: milestoneId },
      relations: ["project"],
      order: { round_number: "ASC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByStatus(status: TestCycleStatus): Promise<TestCycle[]> {
    const entities = await this.repository.find({
      where: { status },
      relations: ["project", "milestone"],
      order: { created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async getCycleSummary(cycleId: number): Promise<{
    total_test_cases: number;
    executed: number;
    passed: number;
    failed: number;
    blocked: number;
    skipped: number;
    pass_rate: number;
    bugs_created: number;
  }> {
    const cycle = await this.repository.findOne({
      where: { id: cycleId },
      relations: ["executions"],
    });

    if (!cycle) {
      return {
        total_test_cases: 0,
        executed: 0,
        passed: 0,
        failed: 0,
        blocked: 0,
        skipped: 0,
        pass_rate: 0,
        bugs_created: 0,
      };
    }

    const executions = cycle.executions || [];
    const total = executions.length;
    const executed = executions.filter(e => e.status !== "not_executed").length;
    const passed = executions.filter(e => e.status === "pass").length;
    const failed = executions.filter(e => e.status === "fail").length;
    const blocked = executions.filter(e => e.status === "blocked").length;
    const skipped = executions.filter(e => e.status === "skipped").length;

    return {
      total_test_cases: total,
      executed,
      passed,
      failed,
      blocked,
      skipped,
      pass_rate: executed > 0 ? (passed / executed) * 100 : 0,
      bugs_created: 0,
    };
  }

  async updateProgress(cycleId: number): Promise<void> {
    const summary = await this.getCycleSummary(cycleId);
    // Progress can be stored or used for real-time calculations
  }

  private toDomain(entity: TestCycleEntity): TestCycle {
    return new TestCycle({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      project_id: entity.project_id,
      milestone_id: entity.milestone_id,
      round_number: entity.round_number,
      cycle_type: entity.cycle_type,
      status: entity.status,
      planned_start_date: entity.planned_start_date,
      planned_end_date: entity.planned_end_date,
      actual_start_date: entity.actual_start_date,
      actual_end_date: entity.actual_end_date,
      test_suite_ids: entity.test_suite_ids,
      test_case_ids: entity.test_case_ids,
      bug_ids: entity.bug_ids,
      environment_config: entity.environment_config,
      assignees: entity.assignees,
      created_by: entity.created_by,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }

  private toEntity(domain: TestCycle): TestCycleEntity {
    const entity = new TestCycleEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.project_id = domain.project_id;
    entity.milestone_id = domain.milestone_id;
    entity.round_number = domain.round_number;
    entity.cycle_type = domain.cycle_type;
    entity.status = domain.status;
    entity.planned_start_date = domain.planned_start_date;
    entity.planned_end_date = domain.planned_end_date;
    entity.actual_start_date = domain.actual_start_date;
    entity.actual_end_date = domain.actual_end_date;
    entity.test_suite_ids = domain.test_suite_ids;
    entity.test_case_ids = domain.test_case_ids;
    entity.bug_ids = domain.bug_ids;
    entity.environment_config = domain.environment_config;
    entity.assignees = domain.assignees;
    entity.created_by = domain.created_by;
    entity.created_at = domain.created_at;
    entity.updated_at = domain.updated_at;
    return entity;
  }
}
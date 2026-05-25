import { getRepository, Repository, FindManyOptions } from "typeorm";
import { TestExecution as TestExecutionEntity, ExecutionStatus } from "../types/testExecution";
import { ITestExecutionRepository, FindTestExecutionsOptions } from "../../../domain/repositories/ITestExecutionRepository";
import { TestExecution } from "../../../domain/entities/TestExecution";

export class TestExecutionRepository implements ITestExecutionRepository {
  private repository: Repository<TestExecutionEntity>;

  constructor() {
    this.repository = getRepository(TestExecutionEntity);
  }

  async findById(id: number): Promise<TestExecution | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ["test_case", "test_suite", "project", "executor"],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findOne(options: any): Promise<TestExecution | null> {
    const entity = await this.repository.findOne(options);
    return entity ? this.toDomain(entity) : null;
  }

  async findAndCount(options: FindTestExecutionsOptions): Promise<[TestExecution[], number]> {
    const findOptions: FindManyOptions<TestExecutionEntity> = {
      where: options.where || {},
      skip: options.skip,
      take: options.take,
      order: options.order || { execution_date: "DESC", created_at: "DESC" },
      relations: ["test_case", "test_suite", "project", "executor"],
    };
    const [entities, total] = await this.repository.findAndCount(findOptions);
    const executions = entities.map((entity) => this.toDomain(entity));
    return [executions, total];
  }

  async save(execution: TestExecution): Promise<TestExecution> {
    const entity = this.toEntity(execution);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, executionData: Partial<TestExecution>): Promise<void> {
    await this.repository.update(id, executionData);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByTestCase(testCaseId: number): Promise<TestExecution[]> {
    const entities = await this.repository.find({
      where: { test_case_id: testCaseId },
      relations: ["executor"],
      order: { execution_date: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByTestSuite(suiteId: number): Promise<TestExecution[]> {
    const entities = await this.repository.find({
      where: { test_suite_id: suiteId },
      relations: ["test_case", "executor"],
      order: { execution_date: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByProject(projectId: number): Promise<TestExecution[]> {
    const entities = await this.repository.find({
      where: { project_id: projectId },
      relations: ["test_case", "test_suite", "executor"],
      order: { execution_date: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByExecutor(userId: number): Promise<TestExecution[]> {
    const entities = await this.repository.find({
      where: { executed_by: userId },
      relations: ["test_case", "test_suite", "project"],
      order: { execution_date: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async getLatestExecution(testCaseId: number): Promise<TestExecution | null> {
    const entity = await this.repository.findOne({
      where: { test_case_id: testCaseId },
      order: { execution_date: "DESC", created_at: "DESC" },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async getExecutionStats(projectId: number): Promise<{
    total: number;
    passed: number;
    failed: number;
    blocked: number;
    skipped: number;
    passRate: number;
  }> {
    const result = await this.repository
      .createQueryBuilder("execution")
      .select("execution.status", "status")
      .addSelect("COUNT(*)", "count")
      .where("execution.project_id = :projectId", { projectId })
      .groupBy("execution.status")
      .getRawMany();

    const stats = {
      total: 0,
      passed: 0,
      failed: 0,
      blocked: 0,
      skipped: 0,
      passRate: 0,
    };

    result.forEach((row) => {
      stats.total += parseInt(row.count);
      if (row.status === ExecutionStatus.PASS) stats.passed = parseInt(row.count);
      if (row.status === ExecutionStatus.FAIL) stats.failed = parseInt(row.count);
      if (row.status === ExecutionStatus.BLOCKED) stats.blocked = parseInt(row.count);
      if (row.status === ExecutionStatus.SKIPPED) stats.skipped = parseInt(row.count);
    });

    stats.passRate = stats.total > 0 ? (stats.passed / stats.total) * 100 : 0;
    return stats;
  }

  private toDomain(entity: TestExecutionEntity): TestExecution {
    return new TestExecution({
      id: entity.id,
      test_case_id: entity.test_case_id,
      test_suite_id: entity.test_suite_id,
      project_id: entity.project_id,
      executed_by: entity.executed_by,
      status: entity.status,
      actual_result: entity.actual_result,
      comments: entity.comments,
      execution_time: entity.execution_time,
      environment: entity.environment,
      browser: entity.browser,
      device: entity.device,
      screenshots: entity.screenshots,
      logs: entity.logs,
      execution_date: entity.execution_date || entity.created_at,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }

  private toEntity(domain: TestExecution): TestExecutionEntity {
    const entity = new TestExecutionEntity();
    entity.id = domain.id;
    entity.test_case_id = domain.test_case_id;
    entity.test_suite_id = domain.test_suite_id;
    entity.project_id = domain.project_id;
    entity.executed_by = domain.executed_by;
    entity.status = domain.status;
    entity.actual_result = domain.actual_result;
    entity.comments = domain.comments;
    entity.execution_time = domain.execution_time;
    entity.environment = domain.environment;
    entity.browser = domain.browser;
    entity.device = domain.device;
    entity.screenshots = domain.screenshots;
    entity.logs = domain.logs;
    entity.execution_date = domain.execution_date;
    entity.created_at = domain.created_at;
    entity.updated_at = domain.updated_at;
    return entity;
  }
}
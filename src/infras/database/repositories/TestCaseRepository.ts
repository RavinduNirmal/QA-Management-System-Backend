import { getRepository, Repository, FindManyOptions } from "typeorm";
import { TestCase as TestCaseEntity } from "../types/testCase";
import { ITestCaseRepository, FindTestCasesOptions } from "../../../domain/repositories/ITestCaseRepository";
import { TestCase, TestStatus } from "../../../domain/entities/TestCase";

export class TestCaseRepository implements ITestCaseRepository {
  private repository: Repository<TestCaseEntity>;

  constructor() {
    this.repository = getRepository(TestCaseEntity);
  }

  async findById(id: number): Promise<TestCase | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ["project", "test_suite", "assignee", "creator"],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findOne(options: any): Promise<TestCase | null> {
    const entity = await this.repository.findOne(options);
    return entity ? this.toDomain(entity) : null;
  }

  async findAndCount(options: FindTestCasesOptions): Promise<[TestCase[], number]> {
    const findOptions: FindManyOptions<TestCaseEntity> = {
      where: options.where || {},
      skip: options.skip,
      take: options.take,
      order: options.order || { created_at: "DESC" },
      relations: ["project", "test_suite", "assignee", "creator"],
    };
    const [entities, total] = await this.repository.findAndCount(findOptions);
    const testCases = entities.map((entity) => this.toDomain(entity));
    return [testCases, total];
  }

  async save(testCase: TestCase): Promise<TestCase> {
    const entity = this.toEntity(testCase);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, testCaseData: Partial<TestCase>): Promise<void> {
    await this.repository.update(id, testCaseData);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByProject(projectId: number): Promise<TestCase[]> {
    const entities = await this.repository.find({
      where: { project_id: projectId },
      relations: ["project", "test_suite", "assignee", "creator"],
      order: { created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findBySuite(suiteId: number): Promise<TestCase[]> {
    const entities = await this.repository.find({
      where: { test_suite_id: suiteId },
      relations: ["assignee", "creator"],
      order: { created_at: "ASC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByAssignee(userId: number): Promise<TestCase[]> {
    const entities = await this.repository.find({
      where: { assigned_to: userId },
      relations: ["project", "test_suite"],
      order: { created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async getSharedTestCases(): Promise<TestCase[]> {
    const entities = await this.repository.find({
      where: { is_shared: true },
      relations: ["project"],
      order: { created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

async copyTestCase(testCaseId: number, targetProjectId: number, targetSuiteId?: number): Promise<TestCase> {
  const original = await this.findById(testCaseId);
  if (!original) throw new Error("Test case not found");

  const copied = new TestCase({
    title: original.title,
    description: original.description,
    preconditions: original.preconditions,
    test_data: original.test_data,
    steps: original.steps,
    expected_result: original.expected_result,
    priority: original.priority,
    test_type: original.test_type,
    project_id: targetProjectId,
    test_suite_id: targetSuiteId,
    original_test_case_id: original.id,
    source_project_id: original.project_id,
    status: TestStatus.DRAFT,  // Fix: Use enum instead of string
    tags: original.tags,
    estimated_duration: original.estimated_duration,
  });

  return this.save(copied);
}

  private toDomain(entity: TestCaseEntity): TestCase {
    return new TestCase({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      preconditions: entity.preconditions,
      test_data: entity.test_data,
      steps: entity.steps,
      expected_result: entity.expected_result,
      actual_result: entity.actual_result,
      priority: entity.priority,
      test_type: entity.test_type,
      status: entity.status,
      automation_status: entity.automation_status,
      automation_script_path: entity.automation_script_path,
      is_shared: entity.is_shared,
      source_project_id: entity.source_project_id,
      original_test_case_id: entity.original_test_case_id,
      project_id: entity.project_id,
      test_suite_id: entity.test_suite_id,
      assigned_to: entity.assigned_to,
      created_by: entity.created_by,
      reviewed_by: entity.reviewed_by,
      tags: entity.tags,
      estimated_duration: entity.estimated_duration,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }

  private toEntity(domain: TestCase): TestCaseEntity {
    const entity = new TestCaseEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.description = domain.description;
    entity.preconditions = domain.preconditions;
    entity.test_data = domain.test_data;
    entity.steps = domain.steps;
    entity.expected_result = domain.expected_result;
    entity.actual_result = domain.actual_result;
    entity.priority = domain.priority;
    entity.test_type = domain.test_type;
    entity.status = domain.status;
    entity.automation_status = domain.automation_status;
    entity.automation_script_path = domain.automation_script_path;
    entity.is_shared = domain.is_shared;
    entity.source_project_id = domain.source_project_id;
    entity.original_test_case_id = domain.original_test_case_id;
    entity.project_id = domain.project_id;
    entity.test_suite_id = domain.test_suite_id;
    entity.assigned_to = domain.assigned_to;
    entity.created_by = domain.created_by;
    entity.reviewed_by = domain.reviewed_by;
    entity.tags = domain.tags;
    entity.estimated_duration = domain.estimated_duration;
    entity.created_at = domain.created_at;
    entity.updated_at = domain.updated_at;
    return entity;
  }
}
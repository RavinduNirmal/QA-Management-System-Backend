import { getRepository, Repository, FindManyOptions } from "typeorm";
import { TestSuite as TestSuiteEntity, SuiteType } from "../types/testSuite";
import { ITestSuiteRepository, FindTestSuitesOptions } from "../../../domain/repositories/ITestSuiteRepository";
import { TestSuite } from "../../../domain/entities/TestSuite";

export class TestSuiteRepository implements ITestSuiteRepository {
  private repository: Repository<TestSuiteEntity>;

  constructor() {
    this.repository = getRepository(TestSuiteEntity);
  }

  async findById(id: number): Promise<TestSuite | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ["project", "creator"],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findOne(options: any): Promise<TestSuite | null> {
    const entity = await this.repository.findOne(options);
    return entity ? this.toDomain(entity) : null;
  }

  async findAndCount(options: FindTestSuitesOptions): Promise<[TestSuite[], number]> {
    const findOptions: FindManyOptions<TestSuiteEntity> = {
      where: options.where || {},
      skip: options.skip,
      take: options.take,
      order: options.order || { created_at: "DESC" },
      relations: ["project", "creator"],
    };
    const [entities, total] = await this.repository.findAndCount(findOptions);
    const testSuites = entities.map((entity) => this.toDomain(entity));
    return [testSuites, total];
  }

  async save(testSuite: TestSuite): Promise<TestSuite> {
    const entity = this.toEntity(testSuite);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, testSuiteData: Partial<TestSuite>): Promise<void> {
    await this.repository.update(id, testSuiteData);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByProject(projectId: number): Promise<TestSuite[]> {
    const entities = await this.repository.find({
      where: { project_id: projectId, is_active: true },
      relations: ["project", "creator"],
      order: { created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByType(suiteType: string): Promise<TestSuite[]> {
    const entities = await this.repository.find({
      where: { suite_type: suiteType as SuiteType, is_active: true },
      relations: ["project"],
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async getTemplates(): Promise<TestSuite[]> {
    const entities = await this.repository.find({
      where: { is_template: true, is_active: true },
      relations: ["project"],
      order: { created_at: "DESC" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async updateTestCaseCount(suiteId: number, count: number): Promise<void> {
    await this.repository.update(suiteId, { test_case_count: count });
  }

  private toDomain(entity: TestSuiteEntity): TestSuite {
    return new TestSuite({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      suite_type: entity.suite_type as SuiteType,
      project_id: entity.project_id,
      is_template: entity.is_template,
      source_project_id: entity.source_project_id,
      is_active: entity.is_active,
      version: entity.version,
      preconditions: entity.preconditions,
      test_case_count: entity.test_case_count,
      created_by: entity.created_by,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }

  private toEntity(domain: TestSuite): TestSuiteEntity {
    const entity = new TestSuiteEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.suite_type = domain.suite_type;
    entity.project_id = domain.project_id;
    entity.is_template = domain.is_template;
    entity.source_project_id = domain.source_project_id;
    entity.is_active = domain.is_active;
    entity.version = domain.version;
    entity.preconditions = domain.preconditions;
    entity.test_case_count = domain.test_case_count;
    entity.created_by = domain.created_by;
    entity.created_at = domain.created_at;
    entity.updated_at = domain.updated_at;
    return entity;
  }
}
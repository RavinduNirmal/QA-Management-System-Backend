import { TestSuite, SuiteType } from "../../../domain/entities/TestSuite";
import { ITestSuiteRepository } from "../../../domain/repositories/ITestSuiteRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IAuditRepository } from "../../../domain/repositories/IAuditRepositiory";
import { Audit } from "../../../domain/entities/Audit";
import { CreateTestSuiteDTO, TestSuiteResponseDTO } from "../../dtos/testSuite/TestSuiteDTOs";
import { BadRequest, NotFound } from "../../../shared/errors/baseError";

export class CreateTestSuiteUseCase {
  constructor(
    private testSuiteRepository: ITestSuiteRepository,
    private projectRepository: IProjectRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(dto: CreateTestSuiteDTO, createdBy: string = "System"): Promise<TestSuiteResponseDTO> {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new BadRequest("Test suite name is required");
    }

    if (dto.name.length < 3) {
      throw new BadRequest("Test suite name must be at least 3 characters");
    }

    const project = await this.projectRepository.findById(dto.project_id);
    if (!project) {
      throw new NotFound(`Project with ID ${dto.project_id} not found`);
    }

    const testSuite = new TestSuite({
      name: dto.name.trim(),
      description: dto.description,
      suite_type: dto.suite_type,
      project_id: dto.project_id,
      is_template: dto.is_template || false,
      source_project_id: dto.source_project_id,
      version: dto.version,
      preconditions: dto.preconditions,
    });

    const savedTestSuite = await this.testSuiteRepository.save(testSuite);

    const audit = new Audit({
      user: createdBy,
      action: "Create",
      resource: "TestSuite",
      description: `Test suite created: ${savedTestSuite.name} (${savedTestSuite.getSuiteTypeLabel()}) for project ${project.name}`,
    });
    await this.auditRepository.save(audit);

    return this.toResponseDTO(savedTestSuite, project.name);
  }

  private toResponseDTO(suite: TestSuite, projectName?: string): TestSuiteResponseDTO {
    return {
      id: suite.id!,
      name: suite.name,
      description: suite.description,
      suite_type: suite.suite_type,
      suite_type_label: suite.getSuiteTypeLabel(),
      suite_type_color: suite.getSuiteTypeColor(),
      project_id: suite.project_id,
      project_name: projectName,
      is_template: suite.is_template,
      is_active: suite.is_active,
      version: suite.version,
      preconditions: suite.preconditions,
      test_case_count: suite.test_case_count,
      created_by: suite.created_by,
      created_at: suite.created_at!,
      updated_at: suite.updated_at!,
    };
  }
}
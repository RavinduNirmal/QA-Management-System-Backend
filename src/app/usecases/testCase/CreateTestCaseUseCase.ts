import { TestCase, TestPriority, TestType, TestStatus, AutomationStatus } from "../../../domain/entities/TestCase";
import { ITestCaseRepository } from "../../../domain/repositories/ITestCaseRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ITestSuiteRepository } from "../../../domain/repositories/ITestSuiteRepository";
import { IAuditRepository } from "../../../domain/repositories/IAuditRepositiory";
import { Audit } from "../../../domain/entities/Audit";
import { CreateTestCaseDTO, TestCaseResponseDTO } from "../../dtos/testCase/TestCaseDTOs";
import { BadRequest, NotFound } from "../../../shared/errors/baseError";

export class CreateTestCaseUseCase {
  constructor(
    private testCaseRepository: ITestCaseRepository,
    private projectRepository: IProjectRepository,
    private testSuiteRepository: ITestSuiteRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(dto: CreateTestCaseDTO, createdBy: string = "System"): Promise<TestCaseResponseDTO> {
    if (!dto.title || dto.title.trim().length === 0) {
      throw new BadRequest("Test case title is required");
    }

    if (dto.title.length < 3) {
      throw new BadRequest("Test case title must be at least 3 characters");
    }

    const project = await this.projectRepository.findById(dto.project_id);
    if (!project) {
      throw new NotFound(`Project with ID ${dto.project_id} not found`);
    }

    if (dto.test_suite_id) {
      const testSuite = await this.testSuiteRepository.findById(dto.test_suite_id);
      if (!testSuite) {
        throw new NotFound(`Test suite with ID ${dto.test_suite_id} not found`);
      }
    }

    const testCase = new TestCase({
      title: dto.title.trim(),
      description: dto.description,
      preconditions: dto.preconditions,
      test_data: dto.test_data,
      steps: dto.steps,
      expected_result: dto.expected_result,
      priority: dto.priority || TestPriority.MEDIUM,
      test_type: dto.test_type || TestType.FUNCTIONAL,
      project_id: dto.project_id,
      test_suite_id: dto.test_suite_id,
      assigned_to: dto.assigned_to,
      is_shared: dto.is_shared || false,
      tags: dto.tags,
      estimated_duration: dto.estimated_duration,
    });

    const savedTestCase = await this.testCaseRepository.save(testCase);

    if (dto.test_suite_id) {
      const suite = await this.testSuiteRepository.findById(dto.test_suite_id);
      if (suite) {
        suite.incrementTestCaseCount();
        await this.testSuiteRepository.update(suite.id!, { test_case_count: suite.test_case_count });
      }
    }

    const audit = new Audit({
      user: createdBy,
      action: "Create",
      resource: "TestCase",
      description: `Test case created: ${savedTestCase.title} for project ${project.name}`,
    });
    await this.auditRepository.save(audit);

    return this.toResponseDTO(savedTestCase, project.name);
  }

  private toResponseDTO(testCase: TestCase, projectName?: string): TestCaseResponseDTO {
    return {
      id: testCase.id!,
      title: testCase.title,
      description: testCase.description,
      preconditions: testCase.preconditions,
      test_data: testCase.test_data,
      steps: testCase.steps,
      expected_result: testCase.expected_result,
      actual_result: testCase.actual_result,
      priority: testCase.priority,
      priority_label: testCase.getPriorityLabel(),
      priority_color: testCase.getPriorityColor(),
      test_type: testCase.test_type,
      status: testCase.status,
      status_label: testCase.getStatusLabel(),
      status_color: testCase.getStatusColor(),
      automation_status: testCase.automation_status,
      automation_script_path: testCase.automation_script_path,
      is_shared: testCase.is_shared,
      source_project_id: testCase.source_project_id,
      project_id: testCase.project_id,
      project_name: projectName,
      test_suite_id: testCase.test_suite_id,
      assigned_to: testCase.assigned_to,
      created_by: testCase.created_by,
      tags: testCase.tags,
      estimated_duration: testCase.estimated_duration,
      created_at: testCase.created_at!,
      updated_at: testCase.updated_at!,
    };
  }
}
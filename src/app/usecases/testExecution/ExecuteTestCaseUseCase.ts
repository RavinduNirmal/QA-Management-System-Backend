import { TestExecution, ExecutionStatus } from "../../../domain/entities/TestExecution";
import { ITestExecutionRepository } from "../../../domain/repositories/ITestExecutionRepository";
import { ITestCaseRepository } from "../../../domain/repositories/ITestCaseRepository";
import { ITestSuiteRepository } from "../../../domain/repositories/ITestSuiteRepository";
import { ITestCycleRepository } from "../../../domain/repositories/ITestCycleRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IAuditRepository } from "../../../domain/repositories/IAuditRepositiory";
import { Audit } from "../../../domain/entities/Audit";
import { CreateTestExecutionDTO, TestExecutionResponseDTO } from "../../dtos/testExecution/testExecutionDTOs";
import { NotFound, BadRequest } from "../../../shared/errors/baseError";

export class ExecuteTestCaseUseCase {
  constructor(
    private testExecutionRepository: ITestExecutionRepository,
    private testCaseRepository: ITestCaseRepository,
    private testSuiteRepository: ITestSuiteRepository,
    private testCycleRepository: ITestCycleRepository,  // Add this
    private projectRepository: IProjectRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(dto: CreateTestExecutionDTO, executedBy: string = "System"): Promise<TestExecutionResponseDTO> {
    // Validate test_cycle_id is provided
    if (!dto.test_cycle_id) {
      throw new BadRequest("test_cycle_id is required");
    }

    const testCase = await this.testCaseRepository.findById(dto.test_case_id);
    if (!testCase) {
      throw new NotFound(`Test case with ID ${dto.test_case_id} not found`);
    }

    const testSuite = await this.testSuiteRepository.findById(dto.test_suite_id);
    if (!testSuite) {
      throw new NotFound(`Test suite with ID ${dto.test_suite_id} not found`);
    }

    const testCycle = await this.testCycleRepository.findById(dto.test_cycle_id);
    if (!testCycle) {
      throw new NotFound(`Test cycle with ID ${dto.test_cycle_id} not found`);
    }

    const project = await this.projectRepository.findById(dto.project_id);
    if (!project) {
      throw new NotFound(`Project with ID ${dto.project_id} not found`);
    }

    const execution = new TestExecution({
      test_case_id: dto.test_case_id,
      test_suite_id: dto.test_suite_id,
      test_cycle_id: dto.test_cycle_id,  // Add this
      project_id: dto.project_id,
      executed_by: dto.executed_by,
      status: dto.status,
      actual_result: dto.actual_result,
      comments: dto.comments,
      execution_time: dto.execution_time,
      environment: dto.environment,
      browser: dto.browser,
      device: dto.device,
      screenshots: dto.screenshots,
      logs: dto.logs,
      execution_date: new Date(),
    });

    const savedExecution = await this.testExecutionRepository.save(execution);

    const audit = new Audit({
      user: executedBy,
      action: "Execute",
      resource: "TestCase",
      description: `Test case "${testCase.title}" executed with status: ${execution.status} for cycle ${testCycle.name}`,
    });
    await this.auditRepository.save(audit);

    return {
      id: savedExecution.id!,
      test_case_id: savedExecution.test_case_id,
      test_case_title: testCase.title,
      test_suite_id: savedExecution.test_suite_id,
      test_suite_name: testSuite.name,
      test_cycle_id: savedExecution.test_cycle_id,
      test_cycle_name: testCycle.name,
      project_id: savedExecution.project_id,
      project_name: project.name,
      executed_by: savedExecution.executed_by,
      status: savedExecution.status,
      status_label: savedExecution.getStatusLabel(),
      status_color: savedExecution.getStatusColor(),
      actual_result: savedExecution.actual_result,
      comments: savedExecution.comments,
      execution_time: savedExecution.execution_time,
      environment: savedExecution.environment,
      browser: savedExecution.browser,
      device: savedExecution.device,
      screenshots: savedExecution.screenshots,
      logs: savedExecution.logs,
      execution_date: savedExecution.execution_date,
      created_at: savedExecution.created_at!,
    };
  }
}
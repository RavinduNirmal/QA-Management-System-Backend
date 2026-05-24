import { ITestCaseRepository } from "../../../domain/repositories/ITestCaseRepository";
import { ITestSuiteRepository } from "../../../domain/repositories/ITestSuiteRepository";
import { IAuditRepository } from "../../../domain/repositories/IAuditRepositiory";
import { Audit } from "../../../domain/entities/Audit";
import { UpdateTestCaseDTO, TestCaseResponseDTO } from "../../dtos/testCase/TestCaseDTOs";
import { NotFound } from "../../../shared/errors/baseError";

export class UpdateTestCaseUseCase {
  constructor(
    private testCaseRepository: ITestCaseRepository,
    private testSuiteRepository: ITestSuiteRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(testCaseId: number, dto: UpdateTestCaseDTO, updatedBy: string = "System"): Promise<TestCaseResponseDTO> {
    const existingTestCase = await this.testCaseRepository.findById(testCaseId);
    if (!existingTestCase) {
      throw new NotFound(`Test case with ID ${testCaseId} not found`);
    }

    // Handle test suite change separately
    const oldSuiteId = existingTestCase.test_suite_id;
    const newSuiteId = dto.test_suite_id;

    // Create a copy of dto without test_suite_id for the main update
    const { test_suite_id, ...updateData } = dto;

    // Perform the main update
    await this.testCaseRepository.update(testCaseId, updateData);

    // Handle test suite count updates
    if (oldSuiteId !== newSuiteId) {
      // Decrement count from old suite
      if (oldSuiteId) {
        const oldSuite = await this.testSuiteRepository.findById(oldSuiteId);
        if (oldSuite) {
          oldSuite.decrementTestCaseCount();
          await this.testSuiteRepository.update(oldSuite.id!, { test_case_count: oldSuite.test_case_count });
        }
      }
      // Increment count for new suite
      if (newSuiteId) {
        const newSuite = await this.testSuiteRepository.findById(newSuiteId);
        if (newSuite) {
          newSuite.incrementTestCaseCount();
          await this.testSuiteRepository.update(newSuite.id!, { test_case_count: newSuite.test_case_count });
        }
      }
      // Also update the test_case_id reference
      await this.testCaseRepository.update(testCaseId, { test_suite_id: newSuiteId });
    }

    const updatedTestCase = await this.testCaseRepository.findById(testCaseId);
    if (!updatedTestCase) {
      throw new NotFound(`Test case with ID ${testCaseId} not found after update`);
    }

    const audit = new Audit({
      user: updatedBy,
      action: "Update",
      resource: "TestCase",
      description: `Test case updated: ${updatedTestCase.title}`,
    });
    await this.auditRepository.save(audit);

    return {
      id: updatedTestCase.id!,
      title: updatedTestCase.title,
      description: updatedTestCase.description,
      preconditions: updatedTestCase.preconditions,
      test_data: updatedTestCase.test_data,
      steps: updatedTestCase.steps,
      expected_result: updatedTestCase.expected_result,
      actual_result: updatedTestCase.actual_result,
      priority: updatedTestCase.priority,
      priority_label: updatedTestCase.getPriorityLabel(),
      priority_color: updatedTestCase.getPriorityColor(),
      test_type: updatedTestCase.test_type,
      status: updatedTestCase.status,
      status_label: updatedTestCase.getStatusLabel(),
      status_color: updatedTestCase.getStatusColor(),
      automation_status: updatedTestCase.automation_status,
      automation_script_path: updatedTestCase.automation_script_path,
      is_shared: updatedTestCase.is_shared,
      source_project_id: updatedTestCase.source_project_id,
      project_id: updatedTestCase.project_id,
      test_suite_id: updatedTestCase.test_suite_id,
      assigned_to: updatedTestCase.assigned_to,
      created_by: updatedTestCase.created_by,
      tags: updatedTestCase.tags,
      estimated_duration: updatedTestCase.estimated_duration,
      created_at: updatedTestCase.created_at!,
      updated_at: updatedTestCase.updated_at!,
    };
  }
}
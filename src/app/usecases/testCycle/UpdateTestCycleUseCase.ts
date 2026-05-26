import { ITestCycleRepository } from "../../../domain/repositories/ITestCycleRepository";
import { IAuditRepository } from "../../../domain/repositories/IAuditRepositiory";
import { Audit } from "../../../domain/entities/Audit";
import { UpdateTestCycleDTO, TestCycleResponseDTO, TestCycleSummaryDTO } from "../../dtos/testCycle/TestCycleDTOs";
import { TestCycleStatus } from "../../../infras/database/types/testCycle";
import { NotFound, BadRequest } from "../../../shared/errors/baseError";

export class UpdateTestCycleUseCase {
  constructor(
    private testCycleRepository: ITestCycleRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(cycleId: number, dto: UpdateTestCycleDTO, updatedBy: string = "System"): Promise<TestCycleResponseDTO> {
    const existingCycle = await this.testCycleRepository.findById(cycleId);
    if (!existingCycle) {
      throw new NotFound(`Test cycle with ID ${cycleId} not found`);
    }

    // Handle status transitions
    if (dto.status && dto.status !== existingCycle.status) {
      if (dto.status === TestCycleStatus.IN_PROGRESS && existingCycle.status === TestCycleStatus.PLANNED) {
        dto.actual_start_date = new Date();
      }
      if (dto.status === TestCycleStatus.COMPLETED && existingCycle.status === TestCycleStatus.IN_PROGRESS) {
        dto.actual_end_date = new Date();
      }
    }

    await this.testCycleRepository.update(cycleId, dto);

    const audit = new Audit({
      user: updatedBy,
      action: "Update",
      resource: "TestCycle",
      description: `Test cycle ${cycleId} updated`,
    });
    await this.auditRepository.save(audit);

    const updatedCycle = await this.testCycleRepository.findById(cycleId);
    if (!updatedCycle) {
      throw new NotFound(`Test cycle with ID ${cycleId} not found after update`);
    }

    return {
      id: updatedCycle.id!,
      name: updatedCycle.name,
      description: updatedCycle.description,
      project_id: updatedCycle.project_id,
      milestone_id: updatedCycle.milestone_id,
      round_number: updatedCycle.round_number,
      cycle_type: updatedCycle.cycle_type,
      cycle_type_label: updatedCycle.getCycleTypeLabel(),
      status: updatedCycle.status,
      status_label: updatedCycle.getStatusLabel(),
      status_color: updatedCycle.getStatusColor(),
      planned_start_date: updatedCycle.planned_start_date,
      planned_end_date: updatedCycle.planned_end_date,
      actual_start_date: updatedCycle.actual_start_date,
      actual_end_date: updatedCycle.actual_end_date,
      test_suite_ids: updatedCycle.test_suite_ids,
      test_case_ids: updatedCycle.test_case_ids,
      bug_ids: updatedCycle.bug_ids,
      environment_config: updatedCycle.environment_config,
      assignees: updatedCycle.assignees,
      progress_percentage: 0,
      created_by: updatedCycle.created_by,
      created_at: updatedCycle.created_at!,
      updated_at: updatedCycle.updated_at!,
    };
  }

  async getSummary(cycleId: number): Promise<TestCycleSummaryDTO> {
    const cycle = await this.testCycleRepository.findById(cycleId);
    if (!cycle) {
      throw new NotFound(`Test cycle with ID ${cycleId} not found`);
    }

    const summary = await this.testCycleRepository.getCycleSummary(cycleId);

    return {
      cycle_id: cycleId,
      cycle_name: cycle.name,
      cycle_type: cycle.cycle_type,
      round_number: cycle.round_number,
      total_test_cases: summary.total_test_cases,
      executed: summary.executed,
      not_executed: summary.total_test_cases - summary.executed,
      passed: summary.passed,
      failed: summary.failed,
      blocked: summary.blocked,
      skipped: summary.skipped,
      pass_rate: summary.pass_rate,
      progress_percentage: (summary.executed / summary.total_test_cases) * 100 || 0,
      bugs_created: summary.bugs_created,
      bugs_fixed: 0,
      bugs_verified: 0,
      bugs_reopened: 0,
      estimated_time: 0,
      actual_time: 0,
      time_variance: 0,
    };
  }
}
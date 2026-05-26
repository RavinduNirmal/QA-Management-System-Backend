import { TestCycle, TestCycleStatus } from "../../../domain/entities/TestCycle";
import { ITestCycleRepository } from "../../../domain/repositories/ITestCycleRepository";
import { IMilestoneRepository } from "../../../domain/repositories/IMilestoneRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IAuditRepository } from "../../../domain/repositories/IAuditRepositiory";
import { Audit } from "../../../domain/entities/Audit";
import { CreateTestCycleDTO, TestCycleResponseDTO } from "../../dtos/testCycle/TestCycleDTOs";
import { BadRequest, NotFound } from "../../../shared/errors/baseError";
import { TestCycleType } from "../../../infras/database/types/testCycle";

export class CreateTestCycleUseCase {
  constructor(
    private testCycleRepository: ITestCycleRepository,
    private milestoneRepository: IMilestoneRepository,
    private projectRepository: IProjectRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(dto: CreateTestCycleDTO, createdBy: string = "System"): Promise<TestCycleResponseDTO> {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new BadRequest("Test cycle name is required");
    }

    const project = await this.projectRepository.findById(dto.project_id);
    if (!project) {
      throw new NotFound(`Project with ID ${dto.project_id} not found`);
    }

    let milestoneName = null;
    let milestoneVersion = null;
    if (dto.milestone_id) {
      const milestone = await this.milestoneRepository.findById(dto.milestone_id);
      if (!milestone) {
        throw new NotFound(`Milestone with ID ${dto.milestone_id} not found`);
      }
      milestoneName = milestone.name;
      milestoneVersion = milestone.release_version;
    }

    const testCycle = new TestCycle({
      name: dto.name.trim(),
      description: dto.description,
      project_id: dto.project_id,
      milestone_id: dto.milestone_id,
      round_number: dto.round_number || 1,
      cycle_type: dto.cycle_type || TestCycleType.INITIAL,
      planned_start_date: dto.planned_start_date,
      planned_end_date: dto.planned_end_date,
      test_suite_ids: dto.test_suite_ids,
      test_case_ids: dto.test_case_ids,
      bug_ids: dto.bug_ids,
      environment_config: dto.environment_config,
      assignees: dto.assignees,
    });

    const savedTestCycle = await this.testCycleRepository.save(testCycle);

    const audit = new Audit({
      user: createdBy,
      action: "Create",
      resource: "TestCycle",
      description: `Test cycle created: ${savedTestCycle.name} (Round ${savedTestCycle.round_number}) for project ${project.name}`,
    });
    await this.auditRepository.save(audit);

    return this.toResponseDTO(savedTestCycle, project.name, milestoneName, milestoneVersion);
  }

  private toResponseDTO(cycle: TestCycle, projectName?: string, milestoneName?: string | null, milestoneVersion?: string | null): TestCycleResponseDTO {
    return {
      id: cycle.id!,
      name: cycle.name,
      description: cycle.description,
      project_id: cycle.project_id,
      project_name: projectName,
      milestone_id: cycle.milestone_id,
      milestone_name: milestoneName || undefined,
      milestone_version: milestoneVersion || undefined,
      round_number: cycle.round_number,
      cycle_type: cycle.cycle_type,
      cycle_type_label: cycle.getCycleTypeLabel(),
      status: cycle.status,
      status_label: cycle.getStatusLabel(),
      status_color: cycle.getStatusColor(),
      planned_start_date: cycle.planned_start_date,
      planned_end_date: cycle.planned_end_date,
      actual_start_date: cycle.actual_start_date,
      actual_end_date: cycle.actual_end_date,
      test_suite_ids: cycle.test_suite_ids,
      test_case_ids: cycle.test_case_ids,
      bug_ids: cycle.bug_ids,
      environment_config: cycle.environment_config,
      assignees: cycle.assignees,
      progress_percentage: 0,
      created_by: cycle.created_by,
      created_at: cycle.created_at!,
      updated_at: cycle.updated_at!,
    };
  }
}
import { ITestCycleRepository } from "../../../domain/repositories/ITestCycleRepository";
import { IMilestoneRepository } from "../../../domain/repositories/IMilestoneRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { TestCycleResponseDTO, PaginatedTestCyclesResponse } from "../../dtos/testCycle/TestCycleDTOs";

interface GetTestCyclesQuery {
  page?: number;
  limit?: number;
  project_id?: number;
  milestone_id?: number;
  status?: string;
  cycle_type?: string;
}

export class GetTestCyclesUseCase {
  constructor(
    private testCycleRepository: ITestCycleRepository,
    private milestoneRepository: IMilestoneRepository,
    private projectRepository: IProjectRepository
  ) {}

  async execute(query: GetTestCyclesQuery): Promise<PaginatedTestCyclesResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.project_id) {
      where.project_id = query.project_id;
    }
    if (query.milestone_id) {
      where.milestone_id = query.milestone_id;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.cycle_type) {
      where.cycle_type = query.cycle_type;
    }

    const [cycles, total] = await this.testCycleRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });

    const enrichedCycles = await Promise.all(
      cycles.map(async (cycle) => {
        const project = await this.projectRepository.findById(cycle.project_id);
        let milestoneName = null;
        let milestoneVersion = null;
        if (cycle.milestone_id) {
          const milestone = await this.milestoneRepository.findById(cycle.milestone_id);
          milestoneName = milestone?.name;
          milestoneVersion = milestone?.release_version;
        }

        const summary = await this.testCycleRepository.getCycleSummary(cycle.id!);

        return {
          id: cycle.id!,
          name: cycle.name,
          description: cycle.description,
          project_id: cycle.project_id,
          project_name: project?.name,
          milestone_id: cycle.milestone_id,
          milestone_name: milestoneName,
          milestone_version: milestoneVersion,
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
          progress_percentage: (summary.executed / summary.total_test_cases) * 100 || 0,
          created_by: cycle.created_by,
          created_at: cycle.created_at!,
          updated_at: cycle.updated_at!,
        };
      })
    );

    return {
      data: enrichedCycles,
      meta: { total, page, limit },
    };
  }
}
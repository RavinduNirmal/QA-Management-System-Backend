import { IMilestoneRepository } from "../../../domain/repositories/IMilestoneRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { MilestoneResponseDTO, TestCycleResponseDTO } from "../../dtos/testCycle/TestCycleDTOs";

interface GetMilestonesQuery {
  page?: number;
  limit?: number;
  project_id?: number;
  status?: string;
}

export class GetMilestonesUseCase {
  constructor(
    private milestoneRepository: IMilestoneRepository,
    private projectRepository: IProjectRepository
  ) {}

  async execute(query: GetMilestonesQuery): Promise<{
    data: MilestoneResponseDTO[];
    meta: { total: number; page: number; limit: number };
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.project_id) {
      where.project_id = query.project_id;
    }
    if (query.status) {
      where.status = query.status;
    }

    const [milestones, total] = await this.milestoneRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });

    const enrichedMilestones: MilestoneResponseDTO[] = await Promise.all(
      milestones.map(async (milestone) => {
        const project = await this.projectRepository.findById(milestone.project_id);
        return {
          id: milestone.id!,
          name: milestone.name,
          description: milestone.description,
          project_id: milestone.project_id,
          project_name: project?.name || null,
          release_version: milestone.release_version,
          status: milestone.status,
          status_label: milestone.getStatusLabel(),
          start_date: milestone.start_date,
          end_date: milestone.end_date,
          assigned_to: milestone.assigned_to,
          test_cycles: [] as TestCycleResponseDTO[],  // Explicitly type as empty array of TestCycleResponseDTO
          created_at: milestone.created_at!,
          updated_at: milestone.updated_at!,
        };
      })
    );

    return {
      data: enrichedMilestones,
      meta: { total, page, limit },
    };
  }
}
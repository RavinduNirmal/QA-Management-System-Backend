import { IProjectUserRepository } from "../../../domain/repositories/IProjectUserRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepositiory";
import { ProjectUserResponseDTO } from "../../dtos/project/ProjectUserDTOs";
import { NotFound } from "../../../shared/errors/baseError";

interface GetProjectUsersQuery {
  projectId: number;
  page?: number;
  limit?: number;
}

export class GetProjectUsersUseCase {
  constructor(
    private projectUserRepository: IProjectUserRepository,
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository  // Add this missing dependency
  ) {}

  async execute(query: GetProjectUsersQuery): Promise<{
    data: ProjectUserResponseDTO[];
    meta: { total: number; page: number; limit: number };
  }> {
    const project = await this.projectRepository.findById(query.projectId);
    if (!project) {
      throw new NotFound(`Project with ID ${query.projectId} not found`);
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [assignments, total] = await this.projectUserRepository.findAndCount({
      where: { project_id: query.projectId, is_active: true },
      skip,
      take: limit,
      order: { assigned_at: "DESC" },
    });

    const enrichedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        const user = await this.userRepository.findById(assignment.user_id);
        return {
          id: assignment.id!,
          user_id: assignment.user_id,
          user_name: user?.name || "Unknown",
          project_id: assignment.project_id,
          project_name: project.name,
          permissions: assignment.permissions,
          role_in_project: assignment.role_in_project,
          is_active: assignment.is_active,
          assigned_at: assignment.assigned_at!,
        };
      })
    );

    return {
      data: enrichedAssignments,
      meta: { total, page, limit },
    };
  }
}
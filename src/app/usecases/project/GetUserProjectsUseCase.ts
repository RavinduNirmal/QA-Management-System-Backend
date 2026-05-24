import { IProjectUserRepository } from "../../../domain/repositories/IProjectUserRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";  // Add this missing import
import { IUserRepository } from "../../../domain/repositories/IUserRepositiory";
import { UserProjectsResponseDTO } from "../../dtos/project/ProjectUserDTOs";
import { NotFound } from "../../../shared/errors/baseError";

export class GetUserProjectsUseCase {
  constructor(
    private projectUserRepository: IProjectUserRepository,
    private projectRepository: IProjectRepository,  // Add this missing dependency
    private userRepository: IUserRepository
  ) {}

  async execute(userId: number): Promise<UserProjectsResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFound(`User with ID ${userId} not found`);
    }

    const assignments = await this.projectUserRepository.findByUser(userId);

    const projects = await Promise.all(
      assignments.map(async (assignment) => {
        const project = await this.projectRepository.findById(assignment.project_id);
        return {
          project_id: assignment.project_id,
          project_name: project?.name || "Unknown",
          permissions: assignment.permissions,
          role_in_project: assignment.role_in_project,
        };
      })
    );

    return {
      user_id: userId,
      user_name: user.name,
      projects,
    };
  }
}
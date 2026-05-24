import { ProjectUser, ProjectPermission } from "../../../domain/entities/ProjectUser";
import { IProjectUserRepository } from "../../../domain/repositories/IProjectUserRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepositiory";
import { IAuditRepository } from "../../../domain/repositories/IAuditRepositiory";
import { Audit } from "../../../domain/entities/Audit";
import { AssignUserToProjectDTO, ProjectUserResponseDTO } from "../../dtos/project/ProjectUserDTOs";
import { BadRequest, NotFound } from "../../../shared/errors/baseError";

export class AssignUserToProjectUseCase {
  constructor(
    private projectUserRepository: IProjectUserRepository,
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(dto: AssignUserToProjectDTO, assignedBy: string = "System"): Promise<ProjectUserResponseDTO> {
    const project = await this.projectRepository.findById(dto.project_id);
    if (!project) {
      throw new NotFound(`Project with ID ${dto.project_id} not found`);
    }

    const user = await this.userRepository.findById(dto.user_id);
    if (!user) {
      throw new NotFound(`User with ID ${dto.user_id} not found`);
    }

    const existingAssignment = await this.projectUserRepository.findByUserAndProject(dto.user_id, dto.project_id);
    if (existingAssignment) {
      throw new BadRequest("User is already assigned to this project");
    }

    const projectUser = new ProjectUser({
      user_id: dto.user_id,
      project_id: dto.project_id,
      permissions: dto.permissions,
      role_in_project: dto.role_in_project,
    });

    const savedAssignment = await this.projectUserRepository.save(projectUser);

    const audit = new Audit({
      user: assignedBy,
      action: "Assign",
      resource: "ProjectUser",
      description: `User ${user.name} assigned to project ${project.name} with permissions: ${dto.permissions.join(", ")}`,
    });
    await this.auditRepository.save(audit);

    return {
      id: savedAssignment.id!,
      user_id: savedAssignment.user_id,
      user_name: user.name,
      project_id: savedAssignment.project_id,
      project_name: project.name,
      permissions: savedAssignment.permissions,
      role_in_project: savedAssignment.role_in_project,
      is_active: savedAssignment.is_active,
      assigned_at: savedAssignment.assigned_at!,
    };
  }
}
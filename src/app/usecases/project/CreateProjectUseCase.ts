import { Project } from "../../../domain/entities/Project";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IAuditRepository } from "../../../domain/repositories/IAuditRepositiory";
import { Audit } from "../../../domain/entities/Audit";
import { CreateProjectDTO, ProjectResponseDTO } from "../../dtos/project/ProjectDTO";
import { BadRequest, Conflict } from "../../../shared/errors/baseError";

export class CreateProjectUseCase {
  constructor(
    private projectRepository: IProjectRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(dto: CreateProjectDTO, createdBy: string = "System"): Promise<ProjectResponseDTO> {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new BadRequest("Project name is required");
    }

    if (dto.name.length < 3) {
      throw new BadRequest("Project name must be at least 3 characters");
    }

    const existingProject = await this.projectRepository.findByName(dto.name);
    if (existingProject) {
      throw new Conflict(`Project with name '${dto.name}' already exists`);
    }

    const project = new Project({
      name: dto.name.trim(),
      description: dto.description,
      code: dto.code,
      start_date: dto.start_date,
      end_date: dto.end_date,
      project_lead_id: dto.project_lead_id,
      qa_lead_id: dto.qa_lead_id,
    });

    const savedProject = await this.projectRepository.save(project);

    const audit = new Audit({
      user: createdBy,
      action: "Create",
      resource: "Project",
      description: `Project created: ${savedProject.name}`,
    });
    await this.auditRepository.save(audit);

    return this.toResponseDTO(savedProject);
  }

  private toResponseDTO(project: Project): ProjectResponseDTO {
    return {
      id: project.id!,
      name: project.name,
      description: project.description,
      code: project.code,
      is_active: project.is_active,
      is_archived: project.is_archived,
      start_date: project.start_date,
      end_date: project.end_date,
      project_lead_id: project.project_lead_id,
      qa_lead_id: project.qa_lead_id,
      created_at: project.created_at!,
      updated_at: project.updated_at!,
    };
  }
}
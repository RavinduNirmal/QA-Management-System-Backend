import { Milestone, MilestoneStatus } from "../../../domain/entities/Milestone";
import { IMilestoneRepository } from "../../../domain/repositories/IMilestoneRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IAuditRepository } from "../../../domain/repositories/IAuditRepositiory";
import { Audit } from "../../../domain/entities/Audit";
import { CreateMilestoneDTO, MilestoneResponseDTO } from "../../dtos/testCycle/TestCycleDTOs";
import { BadRequest, NotFound } from "../../../shared/errors/baseError";

export class CreateMilestoneUseCase {
  constructor(
    private milestoneRepository: IMilestoneRepository,
    private projectRepository: IProjectRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(dto: CreateMilestoneDTO, createdBy: string = "System"): Promise<MilestoneResponseDTO> {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new BadRequest("Milestone name is required");
    }

    const project = await this.projectRepository.findById(dto.project_id);
    if (!project) {
      throw new NotFound(`Project with ID ${dto.project_id} not found`);
    }

    const milestone = new Milestone({
      name: dto.name.trim(),
      description: dto.description,
      project_id: dto.project_id,
      release_version: dto.release_version,
      start_date: dto.start_date,
      end_date: dto.end_date,
      assigned_to: dto.assigned_to,
      is_template: dto.is_template || false,
      template_config: dto.template_config,
    });

    const savedMilestone = await this.milestoneRepository.save(milestone);

    const audit = new Audit({
      user: createdBy,
      action: "Create",
      resource: "Milestone",
      description: `Milestone created: ${savedMilestone.name} for project ${project.name}`,
    });
    await this.auditRepository.save(audit);

    return this.toResponseDTO(savedMilestone, project.name);
  }

  private toResponseDTO(milestone: Milestone, projectName?: string): MilestoneResponseDTO {
    return {
      id: milestone.id!,
      name: milestone.name,
      description: milestone.description,
      project_id: milestone.project_id,
      project_name: projectName,
      release_version: milestone.release_version,
      status: milestone.status,
      status_label: milestone.getStatusLabel(),
      start_date: milestone.start_date,
      end_date: milestone.end_date,
      assigned_to: milestone.assigned_to,
      test_cycles: [],
      created_at: milestone.created_at!,
      updated_at: milestone.updated_at!,
    };
  }
}
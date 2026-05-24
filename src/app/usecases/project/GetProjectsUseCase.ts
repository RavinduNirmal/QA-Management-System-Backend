import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ProjectResponseDTO, PaginatedProjectsResponse } from "../../dtos/project/ProjectDTO";

interface GetProjectsQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  is_active?: boolean;
}

export class GetProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(query: GetProjectsQuery): Promise<PaginatedProjectsResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (query.is_active !== undefined) {
      where.is_active = query.is_active;
    }
    
    if (query.searchTerm) {
      where.name = query.searchTerm;
    }

    const [projects, total] = await this.projectRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });

    return {
      data: projects.map((project) => this.toResponseDTO(project)),
      meta: { total, page, limit },
    };
  }

  private toResponseDTO(project: any): ProjectResponseDTO {
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
      created_at: project.created_at,
      updated_at: project.updated_at,
    };
  }
}
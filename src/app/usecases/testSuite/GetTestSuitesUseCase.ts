import { ITestSuiteRepository } from "../../../domain/repositories/ITestSuiteRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepositiory";
import { TestSuiteResponseDTO, PaginatedTestSuitesResponse } from "../../dtos/testSuite/TestSuiteDTOs";
import { SuiteType } from "../../../domain/entities/TestSuite";

interface GetTestSuitesQuery {
  page?: number;
  limit?: number;
  project_id?: number;
  suite_type?: string;
  is_template?: boolean;
}

export class GetTestSuitesUseCase {
  constructor(
    private testSuiteRepository: ITestSuiteRepository,
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(query: GetTestSuitesQuery): Promise<PaginatedTestSuitesResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { is_active: true };

    if (query.project_id) {
      where.project_id = query.project_id;
    }

    if (query.suite_type) {
      where.suite_type = query.suite_type;
    }

    if (query.is_template !== undefined) {
      where.is_template = query.is_template;
    }

    const [testSuites, total] = await this.testSuiteRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });

    const enrichedSuites = await Promise.all(
      testSuites.map(async (suite) => {
        const project = await this.projectRepository.findById(suite.project_id);
        let createdByName = null;
        if (suite.created_by) {
          const creator = await this.userRepository.findById(suite.created_by);
          createdByName = creator?.name;
        }

        return {
          id: suite.id!,
          name: suite.name,
          description: suite.description,
          suite_type: suite.suite_type,
          suite_type_label: suite.getSuiteTypeLabel(),
          suite_type_color: suite.getSuiteTypeColor(),
          project_id: suite.project_id,
          project_name: project?.name,
          is_template: suite.is_template,
          is_active: suite.is_active,
          version: suite.version,
          preconditions: suite.preconditions,
          test_case_count: suite.test_case_count,
          created_by: suite.created_by,
          created_by_name: createdByName,
          created_at: suite.created_at!,
          updated_at: suite.updated_at!,
        };
      })
    );

    return {
      data: enrichedSuites,
      meta: { total, page, limit },
    };
  }
}
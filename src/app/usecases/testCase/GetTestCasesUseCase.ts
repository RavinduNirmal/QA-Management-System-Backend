import { ITestCaseRepository } from "../../../domain/repositories/ITestCaseRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ITestSuiteRepository } from "../../../domain/repositories/ITestSuiteRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepositiory";
import { TestCaseResponseDTO, PaginatedTestCasesResponse } from "../../dtos/testCase/TestCaseDTOs";
import { TestStatus } from "../../../domain/entities/TestCase";

interface GetTestCasesQuery {
  page?: number;
  limit?: number;
  project_id?: number;
  suite_id?: number;
  assigned_to?: number;
  status?: string;
  is_shared?: boolean;
}

export class GetTestCasesUseCase {
  constructor(
    private testCaseRepository: ITestCaseRepository,
    private projectRepository: IProjectRepository,
    private testSuiteRepository: ITestSuiteRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(query: GetTestCasesQuery): Promise<PaginatedTestCasesResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.project_id) {
      where.project_id = query.project_id;
    }

    if (query.suite_id) {
      where.test_suite_id = query.suite_id;
    }

    if (query.assigned_to) {
      where.assigned_to = query.assigned_to;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.is_shared !== undefined) {
      where.is_shared = query.is_shared;
    }

    const [testCases, total] = await this.testCaseRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });

    const enrichedCases = await Promise.all(
      testCases.map(async (testCase) => {
        const project = await this.projectRepository.findById(testCase.project_id);
        let testSuiteName = null;
        if (testCase.test_suite_id) {
          const suite = await this.testSuiteRepository.findById(testCase.test_suite_id);
          testSuiteName = suite?.name;
        }
        let assigneeName = null;
        if (testCase.assigned_to) {
          const assignee = await this.userRepository.findById(testCase.assigned_to);
          assigneeName = assignee?.name;
        }
        let creatorName = null;
        if (testCase.created_by) {
          const creator = await this.userRepository.findById(testCase.created_by);
          creatorName = creator?.name;
        }

        return {
          id: testCase.id!,
          title: testCase.title,
          description: testCase.description,
          preconditions: testCase.preconditions,
          test_data: testCase.test_data,
          steps: testCase.steps,
          expected_result: testCase.expected_result,
          actual_result: testCase.actual_result,
          priority: testCase.priority,
          priority_label: testCase.getPriorityLabel(),
          priority_color: testCase.getPriorityColor(),
          test_type: testCase.test_type,
          status: testCase.status,
          status_label: testCase.getStatusLabel(),
          status_color: testCase.getStatusColor(),
          automation_status: testCase.automation_status,
          automation_script_path: testCase.automation_script_path,
          is_shared: testCase.is_shared,
          source_project_id: testCase.source_project_id,
          project_id: testCase.project_id,
          project_name: project?.name,
          test_suite_id: testCase.test_suite_id,
          test_suite_name: testSuiteName,
          assigned_to: testCase.assigned_to,
          assigned_to_name: assigneeName,
          created_by: testCase.created_by,
          created_by_name: creatorName,
          tags: testCase.tags,
          estimated_duration: testCase.estimated_duration,
          created_at: testCase.created_at!,
          updated_at: testCase.updated_at!,
        };
      })
    );

    return {
      data: enrichedCases,
      meta: { total, page, limit },
    };
  }
}
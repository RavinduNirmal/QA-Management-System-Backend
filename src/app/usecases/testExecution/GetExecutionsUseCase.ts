import { ITestExecutionRepository } from "../../../domain/repositories/ITestExecutionRepository";
import { ITestCaseRepository } from "../../../domain/repositories/ITestCaseRepository";
import { ITestSuiteRepository } from "../../../domain/repositories/ITestSuiteRepository";
import { ITestCycleRepository } from "../../../domain/repositories/ITestCycleRepository";  // Add this
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepositiory";
import { TestExecutionResponseDTO, PaginatedExecutionsResponse } from "../../dtos/testExecution/testExecutionDTOs";

interface GetExecutionsQuery {
  page?: number;
  limit?: number;
  project_id?: number;
  suite_id?: number;
  test_case_id?: number;
  executed_by?: number;
  status?: string;
}

export class GetExecutionsUseCase {
  constructor(
    private testExecutionRepository: ITestExecutionRepository,
    private testCaseRepository: ITestCaseRepository,
    private testSuiteRepository: ITestSuiteRepository,
    private testCycleRepository: ITestCycleRepository,  // Add this
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(query: GetExecutionsQuery): Promise<PaginatedExecutionsResponse> {
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
    if (query.test_case_id) {
      where.test_case_id = query.test_case_id;
    }
    if (query.executed_by) {
      where.executed_by = query.executed_by;
    }
    if (query.status) {
      where.status = query.status;
    }

    const [executions, total] = await this.testExecutionRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { execution_date: "DESC" },
    });

    const enrichedExecutions = await Promise.all(
      executions.map(async (execution) => {
        const testCase = await this.testCaseRepository.findById(execution.test_case_id);
        const testSuite = await this.testSuiteRepository.findById(execution.test_suite_id);
        const testCycle = await this.testCycleRepository.findById(execution.test_cycle_id);  // Add this
        const project = await this.projectRepository.findById(execution.project_id);
        const executor = await this.userRepository.findById(execution.executed_by);

        return {
          id: execution.id!,
          test_case_id: execution.test_case_id,
          test_case_title: testCase?.title || "Unknown",
          test_suite_id: execution.test_suite_id,
          test_suite_name: testSuite?.name || "Unknown",
          test_cycle_id: execution.test_cycle_id,  // Add this
          test_cycle_name: testCycle?.name || "Unknown",  // Add this
          project_id: execution.project_id,
          project_name: project?.name || "Unknown",
          executed_by: execution.executed_by,
          executed_by_name: executor?.name || "Unknown",
          status: execution.status,
          status_label: execution.getStatusLabel(),
          status_color: execution.getStatusColor(),
          actual_result: execution.actual_result,
          comments: execution.comments,
          execution_time: execution.execution_time,
          environment: execution.environment,
          browser: execution.browser,
          device: execution.device,
          screenshots: execution.screenshots,
          logs: execution.logs,
          execution_date: execution.execution_date,
          created_at: execution.created_at!,
        };
      })
    );

    return {
      data: enrichedExecutions,
      meta: { total, page, limit },
    };
  }
}
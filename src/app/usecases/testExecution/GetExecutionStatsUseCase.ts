import { ITestExecutionRepository } from "../../../domain/repositories/ITestExecutionRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ExecutionStatsDTO } from "../../dtos/testExecution/testExecutionDTOs";
import { NotFound } from "../../../shared/errors/baseError";

export class GetExecutionStatsUseCase {
  constructor(
    private testExecutionRepository: ITestExecutionRepository,
    private projectRepository: IProjectRepository
  ) {}

  async execute(projectId: number): Promise<ExecutionStatsDTO> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFound(`Project with ID ${projectId} not found`);
    }

    const stats = await this.testExecutionRepository.getExecutionStats(projectId);

    return {
      total: stats.total,
      passed: stats.passed,
      failed: stats.failed,
      blocked: stats.blocked,
      skipped: stats.skipped,
      pass_rate: stats.passRate,
    };
  }
}
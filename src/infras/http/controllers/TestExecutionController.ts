import { Request, Response } from "express";
import { ExecuteTestCaseUseCase } from "../../../app/usecases/testExecution/ExecuteTestCaseUseCase";
import { GetExecutionStatsUseCase } from "../../../app/usecases/testExecution/GetExecutionStatsUseCase";
import { GetExecutionsUseCase } from "../../../app/usecases/testExecution/GetExecutionsUseCase";
import { getPermission } from "../middlewares/authMiddleware";
import handleError from "../../../shared/errors/errorHandler";

export class TestExecutionController {
  constructor(
    private executeTestCaseUseCase: ExecuteTestCaseUseCase,
    private getExecutionStatsUseCase: GetExecutionStatsUseCase,
    private getExecutionsUseCase: GetExecutionsUseCase
  ) {}

  async executeTestCase(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("TestExecution");
      if (!permission.create) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { username } = req.body;
      const result = await this.executeTestCaseUseCase.execute(req.body, username);
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getExecutionStats(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("TestExecution");
      if (!permission.view) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const projectId = parseInt(req.params.projectId);
      const result = await this.getExecutionStatsUseCase.execute(projectId);
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getExecutions(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("TestExecution");
      if (!permission.view) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { page, limit, project_id, suite_id, test_case_id, executed_by, status } = req.query;
      const result = await this.getExecutionsUseCase.execute({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        project_id: project_id ? parseInt(project_id as string) : undefined,
        suite_id: suite_id ? parseInt(suite_id as string) : undefined,
        test_case_id: test_case_id ? parseInt(test_case_id as string) : undefined,
        executed_by: executed_by ? parseInt(executed_by as string) : undefined,
        status: status as string,
      });
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }
}
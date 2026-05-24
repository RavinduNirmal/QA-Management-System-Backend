import { Request, Response } from "express";
import { CreateTestCaseUseCase } from "../../../app/usecases/testCase/CreateTestCaseUseCase";
import { GetTestCasesUseCase } from "../../../app/usecases/testCase/GetTestCasesUseCase";
import { UpdateTestCaseUseCase } from "../../../app/usecases/testCase/UpdateTestCaseUseCase";
import { getPermission } from "../middlewares/authMiddleware";
import handleError from "../../../shared/errors/errorHandler";

export class TestCaseController {
  constructor(
    private createTestCaseUseCase: CreateTestCaseUseCase,
    private getTestCasesUseCase: GetTestCasesUseCase,
    private updateTestCaseUseCase: UpdateTestCaseUseCase
  ) {}

  async createTestCase(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("TestCase");
      if (!permission.create) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { username } = req.body;
      const result = await this.createTestCaseUseCase.execute(req.body, username);
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getTestCases(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("TestCase");
      if (!permission.view) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { page, limit, project_id, suite_id, assigned_to, status, is_shared } = req.query;
      const result = await this.getTestCasesUseCase.execute({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        project_id: project_id ? parseInt(project_id as string) : undefined,
        suite_id: suite_id ? parseInt(suite_id as string) : undefined,
        assigned_to: assigned_to ? parseInt(assigned_to as string) : undefined,
        status: status as string,
        is_shared: is_shared === "true" ? true : is_shared === "false" ? false : undefined,
      });
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateTestCase(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("TestCase");
      if (!permission.update) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const testCaseId = parseInt(req.params.id);
      const { username } = req.body;
      const result = await this.updateTestCaseUseCase.execute(testCaseId, req.body, username);
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }
}
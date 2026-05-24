import { Request, Response } from "express";
import { CreateTestSuiteUseCase } from "../../../app/usecases/testSuite/CreateTestSuiteUseCase";
import { GetTestSuitesUseCase } from "../../../app/usecases/testSuite/GetTestSuitesUseCase";
import { getPermission } from "../middlewares/authMiddleware";
import handleError from "../../../shared/errors/errorHandler";

export class TestSuiteController {
  constructor(
    private createTestSuiteUseCase: CreateTestSuiteUseCase,
    private getTestSuitesUseCase: GetTestSuitesUseCase
  ) {}

  async createTestSuite(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("TestSuite");
      if (!permission.create) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { username } = req.body;
      const result = await this.createTestSuiteUseCase.execute(req.body, username);
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getTestSuites(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("TestSuite");
      if (!permission.view) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { page, limit, project_id, suite_type, is_template } = req.query;
      const result = await this.getTestSuitesUseCase.execute({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        project_id: project_id ? parseInt(project_id as string) : undefined,
        suite_type: suite_type as string,
        is_template: is_template === "true" ? true : is_template === "false" ? false : undefined,
      });
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }
}
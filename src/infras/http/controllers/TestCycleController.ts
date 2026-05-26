import { Request, Response } from "express";
import { CreateMilestoneUseCase } from "../../../app/usecases/testCycle/CreateMilestoneUseCase";
import { CreateTestCycleUseCase } from "../../../app/usecases/testCycle/CreateTestCycleUseCase";
import { GetTestCyclesUseCase } from "../../../app/usecases/testCycle/GetTestCyclesUseCase";
import { UpdateTestCycleUseCase } from "../../../app/usecases/testCycle/UpdateTestCycleUseCase";
import { GetMilestonesUseCase } from "../../../app/usecases/testCycle/GetMilestonesUseCase";
import { getPermission } from "../middlewares/authMiddleware";
import handleError from "../../../shared/errors/errorHandler";

export class TestCycleController {
  constructor(
    private createMilestoneUseCase: CreateMilestoneUseCase,
    private createTestCycleUseCase: CreateTestCycleUseCase,
    private getTestCyclesUseCase: GetTestCyclesUseCase,
    private updateTestCycleUseCase: UpdateTestCycleUseCase,
    private getMilestonesUseCase: GetMilestonesUseCase
  ) {}

  async createMilestone(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("Milestone");
      if (!permission.create) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { username } = req.body;
      const result = await this.createMilestoneUseCase.execute(req.body, username);
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getMilestones(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("Milestone");
      if (!permission.view) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { page, limit, project_id, status } = req.query;
      const result = await this.getMilestonesUseCase.execute({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        project_id: project_id ? parseInt(project_id as string) : undefined,
        status: status as string,
      });
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async createTestCycle(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("TestCycle");
      if (!permission.create) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { username } = req.body;
      const result = await this.createTestCycleUseCase.execute(req.body, username);
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getTestCycles(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("TestCycle");
      if (!permission.view) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { page, limit, project_id, milestone_id, status, cycle_type } = req.query;
      const result = await this.getTestCyclesUseCase.execute({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        project_id: project_id ? parseInt(project_id as string) : undefined,
        milestone_id: milestone_id ? parseInt(milestone_id as string) : undefined,
        status: status as string,
        cycle_type: cycle_type as string,
      });
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateTestCycle(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("TestCycle");
      if (!permission.update) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const cycleId = parseInt(req.params.id);
      const { username } = req.body;
      const result = await this.updateTestCycleUseCase.execute(cycleId, req.body, username);
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getTestCycleSummary(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("TestCycle");
      if (!permission.view) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const cycleId = parseInt(req.params.id);
      const result = await this.updateTestCycleUseCase.getSummary(cycleId);
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }
}
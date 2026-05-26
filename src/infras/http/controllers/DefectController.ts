import { Request, Response } from "express";
import { CreateDefectUseCase } from "../../../app/usecases/defect/CreateDefectUseCase";
import { GetDefectsUseCase } from "../../../app/usecases/defect/GetDefectsUseCase";
import { UpdateDefectUseCase } from "../../../app/usecases/defect/UpdateDefectUseCase";
import { getPermission } from "../middlewares/authMiddleware";
import handleError from "../../../shared/errors/errorHandler";

export class DefectController {
  constructor(
    private createDefectUseCase: CreateDefectUseCase,
    private getDefectsUseCase: GetDefectsUseCase,
    private updateDefectUseCase: UpdateDefectUseCase
  ) {}

  async createDefect(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("Defect");
      if (!permission.create) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { username } = req.body;
      const currentUser = (req as any).user;
      const result = await this.createDefectUseCase.execute(req.body, username || currentUser?.name || "System");
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getDefects(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("Defect");
      if (!permission.view) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { page, limit, project_id, qa_status, dev_status, assigned_to, severity, priority } = req.query;
      const result = await this.getDefectsUseCase.execute({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        project_id: project_id ? parseInt(project_id as string) : undefined,
        qa_status: qa_status as string,
        dev_status: dev_status as string,
        assigned_to: assigned_to ? parseInt(assigned_to as string) : undefined,
        severity: severity as string,
        priority: priority as string,
      });
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getDefectStats(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("Defect");
      if (!permission.view) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const projectId = parseInt(req.params.projectId);
      const result = await this.getDefectsUseCase.getStats(projectId);
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateDefect(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("Defect");
      if (!permission.update) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const defectId = parseInt(req.params.id);
      const currentUser = (req as any).user;
      const { username } = req.body;
      const userRole = currentUser?.role?.name || "User";
      const result = await this.updateDefectUseCase.execute(
        defectId, 
        req.body, 
        username || currentUser?.name || "System",
        userRole
      );
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }
}
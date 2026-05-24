import { Request, Response } from "express";
import { CreateProjectUseCase } from "../../../app/usecases/project/CreateProjectUseCase";
import { GetProjectsUseCase } from "../../../app/usecases/project/GetProjectsUseCase";
import { getPermission } from "../middlewares/authMiddleware";
import handleError from "../../../shared/errors/errorHandler";

export class ProjectController {
  constructor(
    private createProjectUseCase: CreateProjectUseCase,
    private getProjectsUseCase: GetProjectsUseCase
  ) {}

  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("Project");
      if (!permission.create) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { username } = req.body;
      const result = await this.createProjectUseCase.execute(req.body, username);
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getProjects(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("Project");
      if (!permission.view) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { page, limit, searchTerm, is_active } = req.query;
      const result = await this.getProjectsUseCase.execute({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        searchTerm: searchTerm as string,
        is_active: is_active === "true" ? true : is_active === "false" ? false : undefined,
      });
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }
}
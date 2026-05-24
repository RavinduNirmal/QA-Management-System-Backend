import { Request, Response } from "express";
import { CreateProjectUseCase } from "../../../app/usecases/project/CreateProjectUseCase";
import { GetProjectsUseCase } from "../../../app/usecases/project/GetProjectsUseCase";
import { AssignUserToProjectUseCase } from "../../../app/usecases/project/AssignUserToProjectUseCase";
import { GetProjectUsersUseCase } from "../../../app/usecases/project/GetProjectUsersUseCase";
import { GetUserProjectsUseCase } from "../../../app/usecases/project/GetUserProjectsUseCase";
import { getPermission } from "../middlewares/authMiddleware";
import handleError from "../../../shared/errors/errorHandler";

export class ProjectController {
  constructor(
    private createProjectUseCase: CreateProjectUseCase,
    private getProjectsUseCase: GetProjectsUseCase,
    private assignUserToProjectUseCase: AssignUserToProjectUseCase,
    private getProjectUsersUseCase: GetProjectUsersUseCase,
    private getUserProjectsUseCase: GetUserProjectsUseCase
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

  async assignUserToProject(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("Project");
      if (!permission.update) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const { username } = req.body;
      const result = await this.assignUserToProjectUseCase.execute(req.body, username);
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getProjectUsers(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("Project");
      if (!permission.view) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const projectId = parseInt(req.params.projectId);
      const { page, limit } = req.query;
      const result = await this.getProjectUsersUseCase.execute({
        projectId,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getUserProjects(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission("Project");
      if (!permission.view) {
        res.status(403).json({ message: "Not Authorized!" });
        return;
      }

      const userId = parseInt(req.params.userId);
      const result = await this.getUserProjectsUseCase.execute(userId);
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }
}
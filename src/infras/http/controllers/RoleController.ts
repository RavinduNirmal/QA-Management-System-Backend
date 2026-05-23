import { Request, Response } from 'express';
import { CreateRoleUseCase } from '../../../app/usecases/role/CreateRoleUseCase';
import { GetRolesUseCase } from '../../../app/usecases/role/GetRoleUseCase';
import { UpdateRoleUseCase } from '../../../app/usecases/role/UpdateRoleUseCase';
import { getPermission } from '../../http/middlewares/authMiddleware';
import handleError from '../../../shared/errors/errorHandler';

export class RoleController {
  constructor(
    private createRoleUseCase: CreateRoleUseCase,
    private getRolesUseCase: GetRolesUseCase,
    private updateRoleUseCase: UpdateRoleUseCase
  ) {}

  async createRole(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission('Role');
      if (!permission.create) {
        res.status(403).json({ message: 'Not Authorized!' });
        return;
      }
      const { name, keyValue, username } = req.body;
      const result = await this.createRoleUseCase.execute(name, keyValue, username);
      res.status(200).json({ message: 'Successfully Added role', RoleID: result.id });
    } catch (error) {
      handleError(error, res);
    }
  }

  async getRoles(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission('Role');
      if (!permission.view) {
        res.status(403).json({ message: 'Not Authorized!' });
        return;
      }
      const { page, limit, searchColumn, searchTerm } = req.query;
      const result = await this.getRolesUseCase.execute({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        searchColumn: searchColumn as string,
        searchTerm: searchTerm as string
      });
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission('Role');
      if (!permission.update) {
        res.status(403).json({ message: 'Not Authorized!' });
        return;
      }
      const roleId = parseInt(req.params.id);
      const { is_delete, username } = req.body;
      await this.updateRoleUseCase.execute(roleId, { is_delete }, username);
      res.json({ message: 'Role updated successfully' });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default RoleController;
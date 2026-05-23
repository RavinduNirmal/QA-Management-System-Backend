import { Request, Response } from 'express';
import { CreateResourceUseCase } from '../../../app/usecases/permission/CreateResouceUseCase';
import { CreatePermissionUseCase } from '../../../app/usecases/permission/CreatePermissionUseCase';
import { getPermission } from '../../http/middlewares/authMiddleware';
import handleError from '../../../shared/errors/errorHandler';

export class PermissionController {
  constructor(
    private createResourceUseCase: CreateResourceUseCase,
    private createPermissionUseCase: CreatePermissionUseCase
  ) {}

  async createResource(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission('Resource');
      if (!permission.create) {
        res.status(403).json({ message: 'Not Authorized!' });
        return;
      }
      const { name, username } = req.body;
      const result = await this.createResourceUseCase.execute(name, username);
      res.status(200).json({ message: 'Successfully Added Resource', ResourceId: result.id });
    } catch (error) {
      handleError(error, res);
    }
  }

  async createPermission(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission('Permission');
      if (!permission.create) {
        res.status(403).json({ message: 'Not Authorized!' });
        return;
      }
      const { username, ...permissionData } = req.body;
      const result = await this.createPermissionUseCase.execute(permissionData, username);
      res.status(200).json({ message: 'Successfully Added Permission', PermissionID: result.id });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default PermissionController;
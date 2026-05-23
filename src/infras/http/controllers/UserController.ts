import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../app/usecases/user/CreateUserUseCase';
import { UpdateUserUseCase } from '../../../app/usecases/user/UpdateUserUseCase';
import { GetUsersUseCase } from '../../../app/usecases/user/GetUserUseCase';
import { UpdateUserPasswordUseCase } from '../../../app/usecases/user/UpdateUserPasswordUseCase';
import handleError from '../../../shared/errors/errorHandler';
import { getPermission } from '../middlewares/authMiddleware';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private getUsersUseCase: GetUsersUseCase,
    private updateUserPasswordUseCase: UpdateUserPasswordUseCase
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission('User');
      if (!permission.create) {
        res.status(403).json({ message: 'Not Authorized!' });
        return;
      }

      const { username } = req.body;
      const result = await this.createUserUseCase.execute(req.body, username);
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission('User');
      if (!permission.update) {
        res.status(403).json({ message: 'Not Authorized!' });
        return;
      }

      const userId = parseInt(req.params.id);
      const { username } = req.body;
      const result = await this.updateUserUseCase.execute(userId, req.body, username);
      res.json({
        message: 'User updated successfully',
        payload: result
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission('User');
      if (!permission.view) {
        res.status(403).json({ message: 'Not Authorized!' });
        return;
      }

      const { page, limit, searchColumn, searchTerm } = req.query;
      const result = await this.getUsersUseCase.execute({
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

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { password, username } = req.body;
      await this.updateUserPasswordUseCase.execute(userId, password, username);
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default UserController;
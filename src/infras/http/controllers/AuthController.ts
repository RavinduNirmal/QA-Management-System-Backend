import { Request, Response } from 'express';
import { LoginUseCase } from '../../../app/usecases/auth/LoginUseCase';
import handleError from '../../../shared/errors/errorHandler';

export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.loginUseCase.execute(req.body);
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  }
}
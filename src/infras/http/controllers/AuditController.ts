import { Request, Response } from 'express';
import { GetAuditsUseCase } from '../../../app/usecases/audit/GetAuditsUseCase';
import { getPermission } from '../../http/middlewares/authMiddleware';
import handleError from '../../../shared/errors/errorHandler';

export class AuditController {
  constructor(private getAuditsUseCase: GetAuditsUseCase) {}

  async getAudits(req: Request, res: Response): Promise<void> {
    try {
      const permission = await getPermission('Audit');
      if (!permission.view) {
        res.status(403).json({ message: 'Not Authorized!' });
        return;
      }
      const { page, limit, searchColumn, searchTerm } = req.query;
      const result = await this.getAuditsUseCase.execute({
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
}

export default AuditController;
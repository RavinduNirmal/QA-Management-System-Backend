import { IUserRepository } from '../../../domain/repositories/IUserRepositiory';
import { IAuditRepository } from '../../../domain/repositories/IAuditRepositiory';
import { IAuthGateway } from '../../../domain/interfaces/gateways/IAuthGateway';
import { Audit } from '../../../domain/entities/Audit';
import { BadRequest, NotFound } from '../../../shared/errors/baseError';

export class UpdateUserPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private auditRepository: IAuditRepository,
    private authGateway: IAuthGateway
  ) {}

  async execute(
    userId: number, 
    newPassword: string, 
    updatedBy: string = 'System'
  ): Promise<void> {
    if (!userId || userId <= 0) {
      throw new BadRequest('Invalid user ID');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new BadRequest('Password must be at least 6 characters long');
    }

    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFound('User not found');
    }

    const hashedPassword = await this.authGateway.hashPassword(newPassword);
    await this.userRepository.update(userId, { password: hashedPassword });

    const audit = new Audit({
      user: updatedBy,
      action: 'Update',
      resource: 'User',
      description: `Password updated for user ID: ${userId}`
    });
    await this.auditRepository.save(audit);
  }
}

export default UpdateUserPasswordUseCase;
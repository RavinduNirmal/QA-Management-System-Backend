import { IAuditRepository } from '../../../domain/repositories/IAuditRepositiory';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepositiory';
import { Audit } from '../../../domain/entities/Audit';

interface GetAuditsQuery {
  page?: number;
  limit?: number;
  searchColumn?: string;
  searchTerm?: string;
}

interface PaginatedAuditsResponse {
  data: Audit[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export class GetAuditsUseCase {
  private validSearchColumns = ['user', 'action', 'resource'];

  constructor(
    private auditRepository: IAuditRepository,
    private roleRepository: IRoleRepository
  ) {}

  async execute(query: GetAuditsQuery, userRoleId?: number): Promise<PaginatedAuditsResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply search filter if provided
    if (query.searchColumn && query.searchTerm && this.validSearchColumns.includes(query.searchColumn)) {
      where[query.searchColumn] = query.searchTerm;
    }

    // Apply role-based filter if userRoleId is provided
    // This prevents non-admin users from seeing all audit logs
    if (userRoleId) {
      const userRole = await this.roleRepository.findById(userRoleId);
      // If user is not SUPER_ADMIN or ADMIN, only show their own audit logs
      if (userRole && userRole.keyValue !== 'SUPER_ADMIN' && userRole.keyValue !== 'ADMIN') {
        // You can add additional filtering logic here
        // For example, only show audits related to the user's own actions
        // where.user = currentUser; // Uncomment and implement as needed
      }
    }

    const [audits, total] = await this.auditRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' }
    });

    return {
      data: audits,
      meta: { total, page, limit }
    };
  }
}

export default GetAuditsUseCase;
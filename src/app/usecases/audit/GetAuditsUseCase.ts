import { IAuditRepository } from '../../../domain/repositories/IAuditRepositiory';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepositiory';
import { Audit } from '../../../domain/entities/Audit';
import { ILike } from 'typeorm';

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

    let where: any = {};

    // Handle search with specific column
    if (query.searchColumn && query.searchTerm && query.searchTerm.trim() && this.validSearchColumns.includes(query.searchColumn)) {
      // Use ILike for case-insensitive partial matching
      where[query.searchColumn] = ILike(`%${query.searchTerm.trim()}%`);
    } 
    // Handle search across all columns when no specific column selected or 'all' is passed
    else if (query.searchTerm && query.searchTerm.trim() && (!query.searchColumn || query.searchColumn === 'all')) {
      where = [
        { user: ILike(`%${query.searchTerm.trim()}%`) },
        { action: ILike(`%${query.searchTerm.trim()}%`) },
        { resource: ILike(`%${query.searchTerm.trim()}%`) },
      ];
    }

    // Apply role-based filter if userRoleId is provided
    // This prevents non-admin users from seeing all audit logs
    if (userRoleId) {
      const userRole = await this.roleRepository.findById(userRoleId);
      // If user is not SUPER_ADMIN or ADMIN, only show their own audit logs
      if (userRole && userRole.keyValue !== 'SUPER_ADMIN' && userRole.keyValue !== 'ADMIN') {
        // Add filter to only show audits related to the user's own actions
        // You can modify this based on your requirements
        if (where.length) {
          // If where is already an array of conditions, add user filter to each
          where = (where as any[]).map((condition: any) => ({
            ...condition,
            user: ILike(`%${query.searchTerm?.trim() || ''}%`)
          }));
        } else {
          where.user = ILike(`%${query.searchTerm?.trim() || ''}%`);
        }
      }
    }

    // Fetch audits with proper ordering (newest first)
    const [audits, total] = await this.auditRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' } as any
    });

    return {
      data: audits,
      meta: { 
        total, 
        page, 
        limit 
      }
    };
  }
}

export default GetAuditsUseCase;
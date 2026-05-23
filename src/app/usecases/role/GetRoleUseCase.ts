import { IRoleRepository } from '../../../domain/repositories/IRoleRepositiory';
import { Role } from '../../../domain/entities/Role';

interface GetRolesQuery {
  page?: number;
  limit?: number;
  searchColumn?: string;
  searchTerm?: string;
}

interface PaginatedRolesResponse {
  data: Role[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export class GetRolesUseCase {
  private validSearchColumns = ['name', 'keyValue'];

  constructor(private roleRepository: IRoleRepository) {}

  async execute(query: GetRolesQuery, userRoleKeyValue?: string): Promise<PaginatedRolesResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { is_delete: false };
    
    if (userRoleKeyValue && userRoleKeyValue !== 'SUPER_ADMIN' && userRoleKeyValue !== 'ADMIN') {
      const userRole = await this.roleRepository.findByKeyValue(userRoleKeyValue);
      if (userRole) {
        where.id = userRole.id;
      }
    }

    if (query.searchColumn && query.searchTerm && this.validSearchColumns.includes(query.searchColumn)) {
      where[query.searchColumn] = query.searchTerm;
    }

    const [roles, total] = await this.roleRepository.findAndCount({
      where,
      skip,
      take: limit
    });

    return {
      data: roles,
      meta: { total, page, limit }
    };
  }
}

export default GetRolesUseCase;
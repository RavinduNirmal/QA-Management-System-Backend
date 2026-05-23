import { IUserRepository } from '../../../domain/repositories/IUserRepositiory';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepositiory';
import { UserResponseDTO, PaginatedResponse } from '../../dtos/user/UserDTOs';

interface GetUsersQuery {
  page?: number;
  limit?: number;
  searchColumn?: string;
  searchTerm?: string;
}

export class GetUsersUseCase {
  private validSearchColumns = ['name', 'user_name', 'contact_no', 'email'];

  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository
  ) {}

  async execute(query: GetUsersQuery): Promise<PaginatedResponse<UserResponseDTO>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build where conditions
    const where: any = { is_delete: false };
    
    if (query.searchColumn && query.searchTerm && this.validSearchColumns.includes(query.searchColumn)) {
      where[query.searchColumn] = query.searchTerm;
    }

    // Fetch users
    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: limit
    });

    // Enrich with role names
    const enrichedUsers: UserResponseDTO[] = [];
    for (const user of users) {
      const role = await this.roleRepository.findById(user.role_id);
      enrichedUsers.push({
        id: user.id!,
        name: user.name,
        user_name: user.user_name,
        email: user.email,
        contact_no: user.contact_no,
        role_id: user.role_id,
        role: role?.name || 'Unknown',
        roleKeyValue: role?.keyValue || 'Unknown'
      });
    }

    return {
      data: enrichedUsers,
      meta: {
        total,
        page,
        limit
      }
    };
  }
}
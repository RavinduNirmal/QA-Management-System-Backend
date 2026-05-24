import { IUserRepository } from '../../../domain/repositories/IUserRepositiory';
import { IRoleRepository } from '../../../domain/repositories/IRoleRepositiory';
import { UserResponseDTO, PaginatedResponse } from '../../dtos/user/UserDTOs';
import { ILike } from 'typeorm';

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

    let where: any = { is_delete: false };
    
    // Handle search with specific column
    if (query.searchColumn && query.searchTerm && query.searchTerm.trim() && this.validSearchColumns.includes(query.searchColumn)) {
      // Use ILike for case-insensitive partial matching
      where[query.searchColumn] = ILike(`%${query.searchTerm.trim()}%`);
    } 
    // Handle search across all columns when no specific column selected
    else if (query.searchTerm && query.searchTerm.trim() && (!query.searchColumn || query.searchColumn === 'all')) {
      where = [
        { is_delete: false, name: ILike(`%${query.searchTerm.trim()}%`) },
        { is_delete: false, user_name: ILike(`%${query.searchTerm.trim()}%`) },
        { is_delete: false, email: ILike(`%${query.searchTerm.trim()}%`) },
        { is_delete: false, contact_no: ILike(`%${query.searchTerm.trim()}%`) },
      ];
    }

    // Fetch users with proper ordering
    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { id: 'DESC' } as any
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
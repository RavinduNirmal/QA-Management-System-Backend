import { getRepository, Repository, FindManyOptions } from 'typeorm';
import { User as UserEntity } from '../types/user';
import { IUserRepository, FindUsersOptions } from '../../../domain/repositories/IUserRepositiory';
import { User } from '../../../domain/entities/User';

export class UserRepository implements IUserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = getRepository(UserEntity);
  }

  async findById(id: number): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { id } });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findOne(options: any): Promise<User | null> {
    const userEntity = await this.repository.findOne(options);
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findAndCount(options: FindUsersOptions): Promise<[User[], number]> {
    const [userEntities, total] = await this.repository.findAndCount(options as FindManyOptions<UserEntity>);
    const users = userEntities.map(entity => this.toDomain(entity));
    return [users, total];
  }

  async save(user: User): Promise<User> {
    const userEntity = this.toEntity(user);
    const savedEntity = await this.repository.save(userEntity);
    return this.toDomain(savedEntity);
  }

  async update(id: number, userData: Partial<User>): Promise<void> {
    await this.repository.update(id, userData);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(conditions: Partial<User>): Promise<boolean> {
    const count = await this.repository.count({ where: conditions });
    return count > 0;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { email } });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { user_name: username } });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  private toDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      name: entity.name,
      user_name: entity.user_name,
      password: entity.password,
      contact_no: entity.contact_no,
      email: entity.email,
      is_delete: entity.is_delete,
      role_id: entity.role_id,
      created_at: entity.created_at,
      updated_at: entity.updated_at
    });
  }

  private toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.user_name = domain.user_name;
    entity.password = domain.password;
    entity.contact_no = domain.contact_no;
    entity.email = domain.email;
    entity.is_delete = domain.is_delete;
    entity.role_id = domain.role_id;
    entity.created_at = domain.created_at;
    entity.updated_at = domain.updated_at;
    return entity;
  }
}
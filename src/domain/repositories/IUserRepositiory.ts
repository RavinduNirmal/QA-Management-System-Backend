import { User } from '../entities/User';

export interface FindUsersOptions {
  where?: any;
  skip?: number;
  take?: number;
  order?: any;
}

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findOne(options: any): Promise<User | null>;
  findAndCount(options: FindUsersOptions): Promise<[User[], number]>;
  save(user: User): Promise<User>;
  update(id: number, user: Partial<User>): Promise<void>;
  delete(id: number): Promise<void>;
  exists(conditions: Partial<User>): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}
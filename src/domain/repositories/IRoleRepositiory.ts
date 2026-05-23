import { Role } from '../entities/Role';

export interface IRoleRepository {
  findById(id: number): Promise<Role | null>;
  findOne(options: any): Promise<Role | null>;
  findAndCount(options: any): Promise<[Role[], number]>;
  save(role: Role): Promise<Role>;
  update(id: number, role: Partial<Role>): Promise<void>;
  delete(id: number): Promise<void>;
  findByName(name: string): Promise<Role | null>;
  findByKeyValue(keyValue: string): Promise<Role | null>;
}
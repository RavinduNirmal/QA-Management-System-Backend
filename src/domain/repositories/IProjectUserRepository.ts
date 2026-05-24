import { ProjectUser, ProjectPermission } from "../entities/ProjectUser";

export interface FindProjectUsersOptions {
  where?: any;
  skip?: number;
  take?: number;
  order?: any;
}

export interface IProjectUserRepository {
  findById(id: number): Promise<ProjectUser | null>;
  findOne(options: any): Promise<ProjectUser | null>;
  findAndCount(options: FindProjectUsersOptions): Promise<[ProjectUser[], number]>;
  save(projectUser: ProjectUser): Promise<ProjectUser>;
  update(id: number, projectUser: Partial<ProjectUser>): Promise<void>;
  delete(id: number): Promise<void>;
  findByUserAndProject(userId: number, projectId: number): Promise<ProjectUser | null>;
  findByUser(userId: number): Promise<ProjectUser[]>;
  findByProject(projectId: number): Promise<ProjectUser[]>;
  deleteByUserAndProject(userId: number, projectId: number): Promise<void>;
  hasPermission(userId: number, projectId: number, permission: ProjectPermission): Promise<boolean>;
}
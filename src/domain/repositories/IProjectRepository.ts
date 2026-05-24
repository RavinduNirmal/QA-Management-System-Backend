import { Project } from "../entities/Project";

export interface FindProjectsOptions {
  where?: any;
  skip?: number;
  take?: number;
  order?: any;
}

export interface IProjectRepository {
  findById(id: number): Promise<Project | null>;
  findOne(options: any): Promise<Project | null>;
  findAndCount(options: FindProjectsOptions): Promise<[Project[], number]>;
  save(project: Project): Promise<Project>;
  update(id: number, project: Partial<Project>): Promise<void>;
  delete(id: number): Promise<void>;
  findByName(name: string): Promise<Project | null>;
  count(where?: any): Promise<number>;
}
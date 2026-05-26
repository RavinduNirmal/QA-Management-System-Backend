import { Milestone } from "../entities/Milestone";
import { MilestoneStatus } from "../../infras/database/types/milestone";

export interface FindMilestonesOptions {
  where?: any;
  skip?: number;
  take?: number;
  order?: any;
}

export interface IMilestoneRepository {
  findById(id: number): Promise<Milestone | null>;
  findOne(options: any): Promise<Milestone | null>;
  findAndCount(options: FindMilestonesOptions): Promise<[Milestone[], number]>;
  save(milestone: Milestone): Promise<Milestone>;
  update(id: number, milestone: Partial<Milestone>): Promise<void>;
  delete(id: number): Promise<void>;
  findByProject(projectId: number): Promise<Milestone[]>;
  findByStatus(status: MilestoneStatus): Promise<Milestone[]>;
  getReleaseReadiness(milestoneId: number): Promise<{
    readiness_score: number;
    blocking_issues: string[];
    recommendation: string;
  }>;
}
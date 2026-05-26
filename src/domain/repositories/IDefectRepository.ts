import { Defect } from "../entities/Defect";
import { DefectQAStatus, DefectDevStatus } from "../../infras/database/types/defect";

export interface FindDefectsOptions {
  where?: any;
  skip?: number;
  take?: number;
  order?: any;
}

export interface IDefectRepository {
  findById(id: number): Promise<Defect | null>;
  findOne(options: any): Promise<Defect | null>;
  findAndCount(options: FindDefectsOptions): Promise<[Defect[], number]>;
  save(defect: Defect): Promise<Defect>;
  update(id: number, defect: Partial<Defect>): Promise<void>;
  delete(id: number): Promise<void>;
  findByProject(projectId: number): Promise<Defect[]>;
  findByAssignee(userId: number): Promise<Defect[]>;
  findByReporter(userId: number): Promise<Defect[]>;
  findByQAStatus(status: DefectQAStatus): Promise<Defect[]>;
  findByDevStatus(status: DefectDevStatus): Promise<Defect[]>;
  findByTestExecution(executionId: number): Promise<Defect[]>;
  getDefectStats(projectId: number): Promise<{
    total: number;
    by_qa_status: Record<string, number>;
    by_dev_status: Record<string, number>;
    by_severity: Record<string, number>;
    by_priority: Record<string, number>;
    avg_resolution_time: number;
    reopen_rate: number;
    defect_density: number;
  }>;
  addComment(defectId: number, userId: number, userName: string, userRole: string, comment: string): Promise<void>;
  addHistory(defectId: number, field: string, oldValue: string, newValue: string, changedBy: number, changedByName: string, changedByRole: string): Promise<void>;
  getDefectsForVerification(projectId: number, buildVersion?: string): Promise<Defect[]>;
}
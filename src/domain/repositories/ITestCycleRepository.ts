// import { TestCycle } from "../../infras/database/types/testCycle";
// import { TestCycleStatus } from "../../infras/database/types/testCycle";

// export interface FindTestCyclesOptions {
//   where?: any;
//   skip?: number;
//   take?: number;
//   order?: any;
// }

// export interface ITestCycleRepository {
//   findById(id: number): Promise<TestCycle | null>;
//   findOne(options: any): Promise<TestCycle | null>;
//   findAndCount(options: FindTestCyclesOptions): Promise<[TestCycle[], number]>;
//   save(testCycle: TestCycle): Promise<TestCycle>;
//   update(id: number, testCycle: Partial<TestCycle>): Promise<void>;
//   delete(id: number): Promise<void>;
//   findByProject(projectId: number): Promise<TestCycle[]>;
//   findByMilestone(milestoneId: number): Promise<TestCycle[]>;
//   findByStatus(status: TestCycleStatus): Promise<TestCycle[]>;
//   getCycleSummary(cycleId: number): Promise<{
//     total_test_cases: number;
//     executed: number;
//     passed: number;
//     failed: number;
//     blocked: number;
//     skipped: number;
//     pass_rate: number;
//     bugs_created: number;
//   }>;
//   updateProgress(cycleId: number): Promise<void>;
// }

import { TestCycle } from "../entities/TestCycle";
import { TestCycleStatus } from "../../infras/database/types/testCycle";

export interface FindTestCyclesOptions {
  where?: any;
  skip?: number;
  take?: number;
  order?: any;
}

export interface ITestCycleRepository {
  findById(id: number): Promise<TestCycle | null>;
  findOne(options: any): Promise<TestCycle | null>;
  findAndCount(options: FindTestCyclesOptions): Promise<[TestCycle[], number]>;
  save(testCycle: TestCycle): Promise<TestCycle>;
  update(id: number, testCycle: Partial<TestCycle>): Promise<void>;
  delete(id: number): Promise<void>;
  findByProject(projectId: number): Promise<TestCycle[]>;
  findByMilestone(milestoneId: number): Promise<TestCycle[]>;
  findByStatus(status: TestCycleStatus): Promise<TestCycle[]>;
  getCycleSummary(cycleId: number): Promise<{
    total_test_cases: number;
    executed: number;
    passed: number;
    failed: number;
    blocked: number;
    skipped: number;
    pass_rate: number;
    bugs_created: number;
  }>;
  updateProgress(cycleId: number): Promise<void>;
}
import { TestExecution } from "../entities/TestExecution";

export interface FindTestExecutionsOptions {
  where?: any;
  skip?: number;
  take?: number;
  order?: any;
}

export interface ITestExecutionRepository {
  findById(id: number): Promise<TestExecution | null>;
  findOne(options: any): Promise<TestExecution | null>;
  findAndCount(options: FindTestExecutionsOptions): Promise<[TestExecution[], number]>;
  save(execution: TestExecution): Promise<TestExecution>;
  update(id: number, execution: Partial<TestExecution>): Promise<void>;
  delete(id: number): Promise<void>;
  findByTestCase(testCaseId: number): Promise<TestExecution[]>;
  findByTestSuite(suiteId: number): Promise<TestExecution[]>;
  findByProject(projectId: number): Promise<TestExecution[]>;
  findByExecutor(userId: number): Promise<TestExecution[]>;
  getLatestExecution(testCaseId: number): Promise<TestExecution | null>;
  getExecutionStats(projectId: number): Promise<{
    total: number;
    passed: number;
    failed: number;
    blocked: number;
    skipped: number;
    passRate: number;
  }>;
}
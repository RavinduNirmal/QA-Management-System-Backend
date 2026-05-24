import { TestCase } from "../entities/TestCase";

export interface FindTestCasesOptions {
  where?: any;
  skip?: number;
  take?: number;
  order?: any;
}

export interface ITestCaseRepository {
  findById(id: number): Promise<TestCase | null>;
  findOne(options: any): Promise<TestCase | null>;
  findAndCount(options: FindTestCasesOptions): Promise<[TestCase[], number]>;
  save(testCase: TestCase): Promise<TestCase>;
  update(id: number, testCase: Partial<TestCase>): Promise<void>;
  delete(id: number): Promise<void>;
  findByProject(projectId: number): Promise<TestCase[]>;
  findBySuite(suiteId: number): Promise<TestCase[]>;
  findByAssignee(userId: number): Promise<TestCase[]>;
  getSharedTestCases(): Promise<TestCase[]>;
  copyTestCase(testCaseId: number, targetProjectId: number, targetSuiteId?: number): Promise<TestCase>;
}
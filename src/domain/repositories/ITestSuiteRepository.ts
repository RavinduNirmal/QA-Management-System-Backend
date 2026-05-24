import { TestSuite } from "../entities/TestSuite";

export interface FindTestSuitesOptions {
  where?: any;
  skip?: number;
  take?: number;
  order?: any;
}

export interface ITestSuiteRepository {
  findById(id: number): Promise<TestSuite | null>;
  findOne(options: any): Promise<TestSuite | null>;
  findAndCount(options: FindTestSuitesOptions): Promise<[TestSuite[], number]>;
  save(testSuite: TestSuite): Promise<TestSuite>;
  update(id: number, testSuite: Partial<TestSuite>): Promise<void>;
  delete(id: number): Promise<void>;
  findByProject(projectId: number): Promise<TestSuite[]>;
  findByType(suiteType: string): Promise<TestSuite[]>;
  getTemplates(): Promise<TestSuite[]>;
  updateTestCaseCount(suiteId: number, count: number): Promise<void>;
}
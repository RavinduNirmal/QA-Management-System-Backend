// export enum ExecutionStatus {
//   PASS = "pass",
//   FAIL = "fail",
//   BLOCKED = "blocked",
//   SKIPPED = "skipped",
//   IN_PROGRESS = "in_progress",
//   NOT_EXECUTED = "not_executed",
// }

// export class TestExecution {
//   public readonly id?: number;
//   public test_case_id: number;
//   public test_suite_id: number;
//   public project_id: number;
//   public executed_by: number;
//   public status: ExecutionStatus;
//   public actual_result: string | null;
//   public comments: string | null;
//   public execution_time: number | null;
//   public environment: string | null;
//   public browser: string | null;
//   public device: string | null;
//   public screenshots: string[] | null;
//   public logs: string[] | null;
//   public execution_date: Date | null;
//   public created_at?: Date;
//   public updated_at?: Date;

//   constructor(props: {
//     id?: number;
//     test_case_id: number;
//     test_suite_id: number;
//     project_id: number;
//     executed_by: number;
//     status?: ExecutionStatus;
//     actual_result?: string | null;
//     comments?: string | null;
//     execution_time?: number | null;
//     environment?: string | null;
//     browser?: string | null;
//     device?: string | null;
//     screenshots?: string[] | null;
//     logs?: string[] | null;
//     execution_date?: Date | null;
//     created_at?: Date;
//     updated_at?: Date;
//   }) {
//     this.id = props.id;
//     this.test_case_id = props.test_case_id;
//     this.test_suite_id = props.test_suite_id;
//     this.project_id = props.project_id;
//     this.executed_by = props.executed_by;
//     this.status = props.status ?? ExecutionStatus.NOT_EXECUTED;
//     this.actual_result = props.actual_result ?? null;
//     this.comments = props.comments ?? null;
//     this.execution_time = props.execution_time ?? null;
//     this.environment = props.environment ?? null;
//     this.browser = props.browser ?? null;
//     this.device = props.device ?? null;
//     this.screenshots = props.screenshots ?? null;
//     this.logs = props.logs ?? null;
//     this.execution_date = props.execution_date ?? null;
//     this.created_at = props.created_at;
//     this.updated_at = props.updated_at;
//   }

//   isPassed(): boolean {
//     return this.status === ExecutionStatus.PASS;
//   }

//   isFailed(): boolean {
//     return this.status === ExecutionStatus.FAIL;
//   }

//   getStatusColor(): string {
//     const colors = {
//       [ExecutionStatus.PASS]: "#10b981",
//       [ExecutionStatus.FAIL]: "#dc2626",
//       [ExecutionStatus.BLOCKED]: "#f59e0b",
//       [ExecutionStatus.SKIPPED]: "#6b7280",
//       [ExecutionStatus.IN_PROGRESS]: "#3b82f6",
//       [ExecutionStatus.NOT_EXECUTED]: "#9ca3af",
//     };
//     return colors[this.status];
//   }

//   getStatusLabel(): string {
//     const labels = {
//       [ExecutionStatus.PASS]: "Passed",
//       [ExecutionStatus.FAIL]: "Failed",
//       [ExecutionStatus.BLOCKED]: "Blocked",
//       [ExecutionStatus.SKIPPED]: "Skipped",
//       [ExecutionStatus.IN_PROGRESS]: "In Progress",
//       [ExecutionStatus.NOT_EXECUTED]: "Not Executed",
//     };
//     return labels[this.status];
//   }

export enum ExecutionStatus {
  PASS = "pass",
  FAIL = "fail",
  BLOCKED = "blocked",
  SKIPPED = "skipped",
  IN_PROGRESS = "in_progress",
  NOT_EXECUTED = "not_executed",
}

export class TestExecution {
  public readonly id?: number;
  public test_case_id: number;
  public test_suite_id: number;
  public test_cycle_id: number;
  public project_id: number;
  public executed_by: number;
  public status: ExecutionStatus;
  public actual_result: string | null;
  public comments: string | null;
  public execution_time: number | null;
  public environment: string | null;
  public browser: string | null;
  public device: string | null;
  public screenshots: string[] | null;
  public logs: string[] | null;
  public execution_date: Date | null;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(props: {
    id?: number;
    test_case_id: number;
    test_suite_id: number;
    test_cycle_id: number;
    project_id: number;
    executed_by: number;
    status?: ExecutionStatus;
    actual_result?: string | null;
    comments?: string | null;
    execution_time?: number | null;
    environment?: string | null;
    browser?: string | null;
    device?: string | null;
    screenshots?: string[] | null;
    logs?: string[] | null;
    execution_date?: Date | null;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = props.id;
    this.test_case_id = props.test_case_id;
    this.test_suite_id = props.test_suite_id;
    this.test_cycle_id = props.test_cycle_id;
    this.project_id = props.project_id;
    this.executed_by = props.executed_by;
    this.status = props.status ?? ExecutionStatus.NOT_EXECUTED;
    this.actual_result = props.actual_result ?? null;
    this.comments = props.comments ?? null;
    this.execution_time = props.execution_time ?? null;
    this.environment = props.environment ?? null;
    this.browser = props.browser ?? null;
    this.device = props.device ?? null;
    this.screenshots = props.screenshots ?? null;
    this.logs = props.logs ?? null;
    this.execution_date = props.execution_date ?? null;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  isPassed(): boolean {
    return this.status === ExecutionStatus.PASS;
  }

  isFailed(): boolean {
    return this.status === ExecutionStatus.FAIL;
  }

  getStatusColor(): string {
    const colors = {
      [ExecutionStatus.PASS]: "#10b981",
      [ExecutionStatus.FAIL]: "#dc2626",
      [ExecutionStatus.BLOCKED]: "#f59e0b",
      [ExecutionStatus.SKIPPED]: "#6b7280",
      [ExecutionStatus.IN_PROGRESS]: "#3b82f6",
      [ExecutionStatus.NOT_EXECUTED]: "#9ca3af",
    };
    return colors[this.status];
  }

  getStatusLabel(): string {
    const labels = {
      [ExecutionStatus.PASS]: "Passed",
      [ExecutionStatus.FAIL]: "Failed",
      [ExecutionStatus.BLOCKED]: "Blocked",
      [ExecutionStatus.SKIPPED]: "Skipped",
      [ExecutionStatus.IN_PROGRESS]: "In Progress",
      [ExecutionStatus.NOT_EXECUTED]: "Not Executed",
    };
    return labels[this.status];
  }
}
// import { TestCycleType, TestCycleStatus } from "../../infras/database/types/testCycle";

// export class TestCycle {
//   public readonly id?: number;
//   public name: string;
//   public description: string | null;
//   public project_id: number;
//   public milestone_id: number | null;
//   public round_number: number;
//   public cycle_type: TestCycleType;
//   public status: TestCycleStatus;
//   public planned_start_date: Date | null;
//   public planned_end_date: Date | null;
//   public actual_start_date: Date | null;
//   public actual_end_date: Date | null;
//   public test_suite_ids: number[] | null;
//   public test_case_ids: number[] | null;
//   public bug_ids: number[] | null;
//   public environment_config: any | null;
//   public assignees: any[] | null;
//   public created_by: number | null;
//   public created_at?: Date;
//   public updated_at?: Date;

//   constructor(props: {
//     id?: number;
//     name: string;
//     description?: string | null;
//     project_id: number;
//     milestone_id?: number | null;
//     round_number?: number;
//     cycle_type?: TestCycleType;
//     status?: TestCycleStatus;
//     planned_start_date?: Date | null;
//     planned_end_date?: Date | null;
//     actual_start_date?: Date | null;
//     actual_end_date?: Date | null;
//     test_suite_ids?: number[] | null;
//     test_case_ids?: number[] | null;
//     bug_ids?: number[] | null;
//     environment_config?: any | null;
//     assignees?: any[] | null;
//     created_by?: number | null;
//     created_at?: Date;
//     updated_at?: Date;
//   }) {
//     this.id = props.id;
//     this.name = props.name;
//     this.description = props.description ?? null;
//     this.project_id = props.project_id;
//     this.milestone_id = props.milestone_id ?? null;
//     this.round_number = props.round_number ?? 1;
//     this.cycle_type = props.cycle_type ?? TestCycleType.INITIAL;
//     this.status = props.status ?? TestCycleStatus.PLANNED;
//     this.planned_start_date = props.planned_start_date ?? null;
//     this.planned_end_date = props.planned_end_date ?? null;
//     this.actual_start_date = props.actual_start_date ?? null;
//     this.actual_end_date = props.actual_end_date ?? null;
//     this.test_suite_ids = props.test_suite_ids ?? null;
//     this.test_case_ids = props.test_case_ids ?? null;
//     this.bug_ids = props.bug_ids ?? null;
//     this.environment_config = props.environment_config ?? null;
//     this.assignees = props.assignees ?? null;
//     this.created_by = props.created_by ?? null;
//     this.created_at = props.created_at;
//     this.updated_at = props.updated_at;
//   }

//   getCycleTypeLabel(): string {
//     const labels = {
//       [TestCycleType.INITIAL]: "Initial Testing",
//       [TestCycleType.REGRESSION]: "Regression Testing",
//       [TestCycleType.VERIFICATION]: "Bug Verification",
//       [TestCycleType.SMOKE]: "Smoke Testing",
//       [TestCycleType.SANITY]: "Sanity Testing",
//       [TestCycleType.FULL_ROUND]: "Full Round Testing",
//       [TestCycleType.UAT]: "User Acceptance Testing",
//       [TestCycleType.PERFORMANCE]: "Performance Testing",
//       [TestCycleType.SECURITY]: "Security Testing",
//     };
//     return labels[this.cycle_type];
//   }

//   getStatusLabel(): string {
//     const labels = {
//       [TestCycleStatus.PLANNED]: "Planned",
//       [TestCycleStatus.IN_PROGRESS]: "In Progress",
//       [TestCycleStatus.PENDING_REVIEW]: "Pending Review",
//       [TestCycleStatus.COMPLETED]: "Completed",
//       [TestCycleStatus.CANCELLED]: "Cancelled",
//     };
//     return labels[this.status];
//   }

//   getStatusColor(): string {
//     const colors = {
//       [TestCycleStatus.PLANNED]: "#3b82f6",
//       [TestCycleStatus.IN_PROGRESS]: "#f59e0b",
//       [TestCycleStatus.PENDING_REVIEW]: "#8b5cf6",
//       [TestCycleStatus.COMPLETED]: "#10b981",
//       [TestCycleStatus.CANCELLED]: "#6b7280",
//     };
//     return colors[this.status];
//   }

//   start(): void {
//     if (this.status === TestCycleStatus.PLANNED) {
//       this.status = TestCycleStatus.IN_PROGRESS;
//       this.actual_start_date = new Date();
//     }
//   }

//   complete(): void {
//     if (this.status === TestCycleStatus.IN_PROGRESS || this.status === TestCycleStatus.PENDING_REVIEW) {
//       this.status = TestCycleStatus.COMPLETED;
//       this.actual_end_date = new Date();
//     }
//   }
// }


// import { TestCycleType, TestCycleStatus } from "../../infras/database/types/testCycle";

// // Re-export the enums so they can be imported from this file
// export { TestCycleType, TestCycleStatus };

// export class TestCycle {
//   public readonly id?: number;
//   public name: string;
//   public description: string | null;
//   public project_id: number;
//   public milestone_id: number | null;
//   public round_number: number;
//   public cycle_type: TestCycleType;
//   public status: TestCycleStatus;
//   public planned_start_date: Date | null;
//   public planned_end_date: Date | null;
//   public actual_start_date: Date | null;
//   public actual_end_date: Date | null;
//   public test_suite_ids: number[] | null;
//   public test_case_ids: number[] | null;
//   public bug_ids: number[] | null;
//   public environment_config: any | null;
//   public assignees: any[] | null;
//   public created_by: number | null;
//   public created_at?: Date;
//   public updated_at?: Date;

//   constructor(props: {
//     id?: number;
//     name: string;
//     description?: string | null;
//     project_id: number;
//     milestone_id?: number | null;
//     round_number?: number;
//     cycle_type?: TestCycleType;
//     status?: TestCycleStatus;
//     planned_start_date?: Date | null;
//     planned_end_date?: Date | null;
//     actual_start_date?: Date | null;
//     actual_end_date?: Date | null;
//     test_suite_ids?: number[] | null;
//     test_case_ids?: number[] | null;
//     bug_ids?: number[] | null;
//     environment_config?: any | null;
//     assignees?: any[] | null;
//     created_by?: number | null;
//     created_at?: Date;
//     updated_at?: Date;
//   }) {
//     this.id = props.id;
//     this.name = props.name;
//     this.description = props.description ?? null;
//     this.project_id = props.project_id;
//     this.milestone_id = props.milestone_id ?? null;
//     this.round_number = props.round_number ?? 1;
//     this.cycle_type = props.cycle_type ?? TestCycleType.INITIAL;
//     this.status = props.status ?? TestCycleStatus.PLANNED;
//     this.planned_start_date = props.planned_start_date ?? null;
//     this.planned_end_date = props.planned_end_date ?? null;
//     this.actual_start_date = props.actual_start_date ?? null;
//     this.actual_end_date = props.actual_end_date ?? null;
//     this.test_suite_ids = props.test_suite_ids ?? null;
//     this.test_case_ids = props.test_case_ids ?? null;
//     this.bug_ids = props.bug_ids ?? null;
//     this.environment_config = props.environment_config ?? null;
//     this.assignees = props.assignees ?? null;
//     this.created_by = props.created_by ?? null;
//     this.created_at = props.created_at;
//     this.updated_at = props.updated_at;
//   }

//   getCycleTypeLabel(): string {
//     const labels = {
//       [TestCycleType.INITIAL]: "Initial Testing",
//       [TestCycleType.REGRESSION]: "Regression Testing",
//       [TestCycleType.VERIFICATION]: "Bug Verification",
//       [TestCycleType.SMOKE]: "Smoke Testing",
//       [TestCycleType.SANITY]: "Sanity Testing",
//       [TestCycleType.FULL_ROUND]: "Full Round Testing",
//       [TestCycleType.UAT]: "User Acceptance Testing",
//       [TestCycleType.PERFORMANCE]: "Performance Testing",
//       [TestCycleType.SECURITY]: "Security Testing",
//     };
//     return labels[this.cycle_type];
//   }

//   getStatusLabel(): string {
//     const labels = {
//       [TestCycleStatus.PLANNED]: "Planned",
//       [TestCycleStatus.IN_PROGRESS]: "In Progress",
//       [TestCycleStatus.PENDING_REVIEW]: "Pending Review",
//       [TestCycleStatus.COMPLETED]: "Completed",
//       [TestCycleStatus.CANCELLED]: "Cancelled",
//     };
//     return labels[this.status];
//   }

//   getStatusColor(): string {
//     const colors = {
//       [TestCycleStatus.PLANNED]: "#3b82f6",
//       [TestCycleStatus.IN_PROGRESS]: "#f59e0b",
//       [TestCycleStatus.PENDING_REVIEW]: "#8b5cf6",
//       [TestCycleStatus.COMPLETED]: "#10b981",
//       [TestCycleStatus.CANCELLED]: "#6b7280",
//     };
//     return colors[this.status];
//   }

//   start(): void {
//     if (this.status === TestCycleStatus.PLANNED) {
//       this.status = TestCycleStatus.IN_PROGRESS;
//       this.actual_start_date = new Date();
//     }
//   }

//   complete(): void {
//     if (this.status === TestCycleStatus.IN_PROGRESS || this.status === TestCycleStatus.PENDING_REVIEW) {
//       this.status = TestCycleStatus.COMPLETED;
//       this.actual_end_date = new Date();
//     }
//   }
// }




import { TestCycleType, TestCycleStatus } from "../../infras/database/types/testCycle";

// Re-export the enums so they can be imported from this file
export { TestCycleType, TestCycleStatus };

export class TestCycle {
  public readonly id?: number;
  public name: string;
  public description: string | null;
  public project_id: number;
  public milestone_id: number | null;
  public round_number: number;
  public cycle_type: TestCycleType;
  public status: TestCycleStatus;
  public planned_start_date: Date | null;
  public planned_end_date: Date | null;
  public actual_start_date: Date | null;
  public actual_end_date: Date | null;
  public test_suite_ids: number[] | null;
  public test_case_ids: number[] | null;
  public bug_ids: number[] | null;
  public environment_config: any | null;
  public assignees: any[] | null;
  public created_by: number | null;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(props: {
    id?: number;
    name: string;
    description?: string | null;
    project_id: number;
    milestone_id?: number | null;
    round_number?: number;
    cycle_type?: TestCycleType;
    status?: TestCycleStatus;
    planned_start_date?: Date | null;
    planned_end_date?: Date | null;
    actual_start_date?: Date | null;
    actual_end_date?: Date | null;
    test_suite_ids?: number[] | null;
    test_case_ids?: number[] | null;
    bug_ids?: number[] | null;
    environment_config?: any | null;
    assignees?: any[] | null;
    created_by?: number | null;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.project_id = props.project_id;
    this.milestone_id = props.milestone_id ?? null;
    this.round_number = props.round_number ?? 1;
    this.cycle_type = props.cycle_type ?? TestCycleType.INITIAL;
    this.status = props.status ?? TestCycleStatus.PLANNED;
    this.planned_start_date = props.planned_start_date ?? null;
    this.planned_end_date = props.planned_end_date ?? null;
    this.actual_start_date = props.actual_start_date ?? null;
    this.actual_end_date = props.actual_end_date ?? null;
    this.test_suite_ids = props.test_suite_ids ?? null;
    this.test_case_ids = props.test_case_ids ?? null;
    this.bug_ids = props.bug_ids ?? null;
    this.environment_config = props.environment_config ?? null;
    this.assignees = props.assignees ?? null;
    this.created_by = props.created_by ?? null;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  getCycleTypeLabel(): string {
    const labels = {
      [TestCycleType.INITIAL]: "Initial Testing",
      [TestCycleType.REGRESSION]: "Regression Testing",
      [TestCycleType.VERIFICATION]: "Bug Verification",
      [TestCycleType.SMOKE]: "Smoke Testing",
      [TestCycleType.SANITY]: "Sanity Testing",
      [TestCycleType.FULL_ROUND]: "Full Round Testing",
      [TestCycleType.UAT]: "User Acceptance Testing",
      [TestCycleType.PERFORMANCE]: "Performance Testing",
      [TestCycleType.SECURITY]: "Security Testing",
    };
    return labels[this.cycle_type];
  }

  getStatusLabel(): string {
    const labels = {
      [TestCycleStatus.PLANNED]: "Planned",
      [TestCycleStatus.IN_PROGRESS]: "In Progress",
      [TestCycleStatus.PENDING_REVIEW]: "Pending Review",
      [TestCycleStatus.COMPLETED]: "Completed",
      [TestCycleStatus.CANCELLED]: "Cancelled",
    };
    return labels[this.status];
  }

  getStatusColor(): string {
    const colors = {
      [TestCycleStatus.PLANNED]: "#3b82f6",
      [TestCycleStatus.IN_PROGRESS]: "#f59e0b",
      [TestCycleStatus.PENDING_REVIEW]: "#8b5cf6",
      [TestCycleStatus.COMPLETED]: "#10b981",
      [TestCycleStatus.CANCELLED]: "#6b7280",
    };
    return colors[this.status];
  }

  start(): void {
    if (this.status === TestCycleStatus.PLANNED) {
      this.status = TestCycleStatus.IN_PROGRESS;
      this.actual_start_date = new Date();
    }
  }

  complete(): void {
    if (this.status === TestCycleStatus.IN_PROGRESS || this.status === TestCycleStatus.PENDING_REVIEW) {
      this.status = TestCycleStatus.COMPLETED;
      this.actual_end_date = new Date();
    }
  }
}
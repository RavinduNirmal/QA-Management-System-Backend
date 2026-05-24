export enum TestPriority {
  CRITICAL = "critical",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum TestType {
  FUNCTIONAL = "functional",
  PERFORMANCE = "performance",
  SECURITY = "security",
  USABILITY = "usability",
  COMPATIBILITY = "compatibility",
  API = "api",
  UI = "ui",
  INTEGRATION = "integration",
}

export enum TestStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  DEPRECATED = "deprecated",
  REVIEW = "review",
}

export enum AutomationStatus {
  MANUAL = "manual",
  AUTOMATED = "automated",
  IN_PROGRESS = "in_progress",
  NOT_APPLICABLE = "not_applicable",
}

export interface TestStep {
  step_number: number;
  action: string;
  expected_result: string;
  actual_result?: string;
}

export class TestCase {
  public readonly id?: number;
  public title: string;
  public description: string | null;
  public preconditions: string | null;
  public test_data: string | null;
  public steps: TestStep[] | null;
  public expected_result: string | null;
  public actual_result: string | null;
  public priority: TestPriority;
  public test_type: TestType;
  public status: TestStatus;
  public automation_status: AutomationStatus;
  public automation_script_path: string | null;
  public is_shared: boolean;
  public source_project_id: number | null;
  public original_test_case_id: number | null;
  public project_id: number;
  public test_suite_id: number | null;
  public assigned_to: number | null;
  public created_by: number | null;
  public reviewed_by: number | null;
  public tags: string[] | null;
  public estimated_duration: number | null;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(props: {
    id?: number;
    title: string;
    description?: string | null;
    preconditions?: string | null;
    test_data?: string | null;
    steps?: TestStep[] | null;
    expected_result?: string | null;
    actual_result?: string | null;
    priority?: TestPriority;
    test_type?: TestType;
    status?: TestStatus;
    automation_status?: AutomationStatus;
    automation_script_path?: string | null;
    is_shared?: boolean;
    source_project_id?: number | null;
    original_test_case_id?: number | null;
    project_id: number;
    test_suite_id?: number | null;
    assigned_to?: number | null;
    created_by?: number | null;
    reviewed_by?: number | null;
    tags?: string[] | null;
    estimated_duration?: number | null;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description ?? null;
    this.preconditions = props.preconditions ?? null;
    this.test_data = props.test_data ?? null;
    this.steps = props.steps ?? null;
    this.expected_result = props.expected_result ?? null;
    this.actual_result = props.actual_result ?? null;
    this.priority = props.priority ?? TestPriority.MEDIUM;
    this.test_type = props.test_type ?? TestType.FUNCTIONAL;
    this.status = props.status ?? TestStatus.DRAFT;
    this.automation_status = props.automation_status ?? AutomationStatus.MANUAL;
    this.automation_script_path = props.automation_script_path ?? null;
    this.is_shared = props.is_shared ?? false;
    this.source_project_id = props.source_project_id ?? null;
    this.original_test_case_id = props.original_test_case_id ?? null;
    this.project_id = props.project_id;
    this.test_suite_id = props.test_suite_id ?? null;
    this.assigned_to = props.assigned_to ?? null;
    this.created_by = props.created_by ?? null;
    this.reviewed_by = props.reviewed_by ?? null;
    this.tags = props.tags ?? null;
    this.estimated_duration = props.estimated_duration ?? null;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  isDraft(): boolean {
    return this.status === TestStatus.DRAFT;
  }

  isActive(): boolean {
    return this.status === TestStatus.ACTIVE;
  }

  canExecute(): boolean {
    return this.status === TestStatus.ACTIVE && this.steps && this.steps.length > 0;
  }

  getPriorityLabel(): string {
    const labels = {
      [TestPriority.CRITICAL]: "Critical",
      [TestPriority.HIGH]: "High",
      [TestPriority.MEDIUM]: "Medium",
      [TestPriority.LOW]: "Low",
    };
    return labels[this.priority];
  }

  getPriorityColor(): string {
    const colors = {
      [TestPriority.CRITICAL]: "#dc2626",
      [TestPriority.HIGH]: "#f59e0b",
      [TestPriority.MEDIUM]: "#3b82f6",
      [TestPriority.LOW]: "#10b981",
    };
    return colors[this.priority];
  }

  getStatusLabel(): string {
    const labels = {
      [TestStatus.DRAFT]: "Draft",
      [TestStatus.ACTIVE]: "Active",
      [TestStatus.DEPRECATED]: "Deprecated",
      [TestStatus.REVIEW]: "Under Review",
    };
    return labels[this.status];
  }

  getStatusColor(): string {
    const colors = {
      [TestStatus.DRAFT]: "#9ca3af",
      [TestStatus.ACTIVE]: "#10b981",
      [TestStatus.DEPRECATED]: "#6b7280",
      [TestStatus.REVIEW]: "#f59e0b",
    };
    return colors[this.status];
  }
}
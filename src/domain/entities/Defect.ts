import { 
  DefectQAStatus, 
  DefectDevStatus, 
  DefectSeverity, 
  DefectPriority, 
  DefectResolution 
} from "../../infras/database/types/defect";

// Re-export the enums
export { DefectQAStatus, DefectDevStatus, DefectSeverity, DefectPriority, DefectResolution };

export class Defect {
  public readonly id?: number;
  public title: string;
  public description: string;
  public steps_to_reproduce: string | null;
  public actual_result: string | null;
  public expected_result: string | null;
  public severity: DefectSeverity;
  public priority: DefectPriority;
  public qa_status: DefectQAStatus;
  public dev_status: DefectDevStatus;
  public resolution: DefectResolution | null;
  public environment: string | null;
  public browser: string | null;
  public device: string | null;
  public os: string | null;
  public build_version: string | null;
  public is_common_bug: boolean;
  public affected_projects: number[] | null;
  public affected_versions: string[] | null;
  public fixed_in_version: string | null;
  public project_id: number;
  public test_case_id: number | null;
  public test_execution_id: number | null;
  public test_cycle_id: number | null;
  public reported_by: number;
  public assigned_to: number | null;
  public fixed_by: number | null;
  public verified_by: number | null;
  public closed_by: number | null;
  public reported_date: Date | null;
  public assigned_date: Date | null;
  public fixed_date: Date | null;
  public verified_date: Date | null;
  public closed_date: Date | null;
  public attachments: any[] | null;
  public comments: any[] | null;
  public history: any[] | null;
  public tags: string[] | null;
  public estimated_fix_time: number | null;
  public actual_fix_time: number | null;
  public duplicate_of: number | null;
  public related_bugs: number[] | null;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(props: {
    id?: number;
    title: string;
    description: string;
    steps_to_reproduce?: string | null;
    actual_result?: string | null;
    expected_result?: string | null;
    severity?: DefectSeverity;
    priority?: DefectPriority;
    qa_status?: DefectQAStatus;
    dev_status?: DefectDevStatus;
    resolution?: DefectResolution | null;
    environment?: string | null;
    browser?: string | null;
    device?: string | null;
    os?: string | null;
    build_version?: string | null;
    is_common_bug?: boolean;
    affected_projects?: number[] | null;
    affected_versions?: string[] | null;
    fixed_in_version?: string | null;
    project_id: number;
    test_case_id?: number | null;
    test_execution_id?: number | null;
    test_cycle_id?: number | null;
    reported_by: number;
    assigned_to?: number | null;
    fixed_by?: number | null;
    verified_by?: number | null;
    closed_by?: number | null;
    reported_date?: Date | null;
    assigned_date?: Date | null;
    fixed_date?: Date | null;
    verified_date?: Date | null;
    closed_date?: Date | null;
    attachments?: any[] | null;
    comments?: any[] | null;
    history?: any[] | null;
    tags?: string[] | null;
    estimated_fix_time?: number | null;
    actual_fix_time?: number | null;
    duplicate_of?: number | null;
    related_bugs?: number[] | null;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.steps_to_reproduce = props.steps_to_reproduce ?? null;
    this.actual_result = props.actual_result ?? null;
    this.expected_result = props.expected_result ?? null;
    this.severity = props.severity ?? DefectSeverity.MAJOR;
    this.priority = props.priority ?? DefectPriority.MEDIUM;
    this.qa_status = props.qa_status ?? DefectQAStatus.NEW;
    this.dev_status = props.dev_status ?? DefectDevStatus.NOT_ASSIGNED;
    this.resolution = props.resolution ?? null;
    this.environment = props.environment ?? null;
    this.browser = props.browser ?? null;
    this.device = props.device ?? null;
    this.os = props.os ?? null;
    this.build_version = props.build_version ?? null;
    this.is_common_bug = props.is_common_bug ?? false;
    this.affected_projects = props.affected_projects ?? null;
    this.affected_versions = props.affected_versions ?? null;
    this.fixed_in_version = props.fixed_in_version ?? null;
    this.project_id = props.project_id;
    this.test_case_id = props.test_case_id ?? null;
    this.test_execution_id = props.test_execution_id ?? null;
    this.test_cycle_id = props.test_cycle_id ?? null;
    this.reported_by = props.reported_by;
    this.assigned_to = props.assigned_to ?? null;
    this.fixed_by = props.fixed_by ?? null;
    this.verified_by = props.verified_by ?? null;
    this.closed_by = props.closed_by ?? null;
    this.reported_date = props.reported_date ?? null;
    this.assigned_date = props.assigned_date ?? null;
    this.fixed_date = props.fixed_date ?? null;
    this.verified_date = props.verified_date ?? null;
    this.closed_date = props.closed_date ?? null;
    this.attachments = props.attachments ?? null;
    this.comments = props.comments ?? null;
    this.history = props.history ?? null;
    this.tags = props.tags ?? null;
    this.estimated_fix_time = props.estimated_fix_time ?? null;
    this.actual_fix_time = props.actual_fix_time ?? null;
    this.duplicate_of = props.duplicate_of ?? null;
    this.related_bugs = props.related_bugs ?? null;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  // ============ Getters ============
  getSeverityLabel(): string {
    const labels = {
      [DefectSeverity.BLOCKER]: "Blocker",
      [DefectSeverity.CRITICAL]: "Critical",
      [DefectSeverity.MAJOR]: "Major",
      [DefectSeverity.MINOR]: "Minor",
      [DefectSeverity.TRIVIAL]: "Trivial",
    };
    return labels[this.severity];
  }

  getSeverityColor(): string {
    const colors = {
      [DefectSeverity.BLOCKER]: "#dc2626",
      [DefectSeverity.CRITICAL]: "#ef4444",
      [DefectSeverity.MAJOR]: "#f59e0b",
      [DefectSeverity.MINOR]: "#3b82f6",
      [DefectSeverity.TRIVIAL]: "#10b981",
    };
    return colors[this.severity];
  }

  getPriorityLabel(): string {
    const labels = {
      [DefectPriority.URGENT]: "Urgent",
      [DefectPriority.HIGH]: "High",
      [DefectPriority.MEDIUM]: "Medium",
      [DefectPriority.LOW]: "Low",
    };
    return labels[this.priority];
  }

  getQAStatusLabel(): string {
    const labels = {
      [DefectQAStatus.NEW]: "New",
      [DefectQAStatus.TRIAGE]: "Triage",
      [DefectQAStatus.OPEN]: "Open",
      [DefectQAStatus.VERIFIED]: "Verified",
      [DefectQAStatus.CLOSED]: "Closed",
      [DefectQAStatus.REOPENED]: "Reopened",
    };
    return labels[this.qa_status];
  }

  getQAStatusColor(): string {
    const colors = {
      [DefectQAStatus.NEW]: "#6b7280",
      [DefectQAStatus.TRIAGE]: "#3b82f6",
      [DefectQAStatus.OPEN]: "#f59e0b",
      [DefectQAStatus.VERIFIED]: "#10b981",
      [DefectQAStatus.CLOSED]: "#059669",
      [DefectQAStatus.REOPENED]: "#ef4444",
    };
    return colors[this.qa_status];
  }

  getDevStatusLabel(): string {
    const labels = {
      [DefectDevStatus.NOT_ASSIGNED]: "Not Assigned",
      [DefectDevStatus.IN_PROGRESS]: "In Progress",
      [DefectDevStatus.FIXED]: "Fixed",
      [DefectDevStatus.REJECTED]: "Rejected",
      [DefectDevStatus.DUPLICATE]: "Duplicate",
      [DefectDevStatus.DEFERRED]: "Deferred",
      [DefectDevStatus.NEEDS_INFO]: "Needs Info",
    };
    return labels[this.dev_status];
  }

  getDevStatusColor(): string {
    const colors = {
      [DefectDevStatus.NOT_ASSIGNED]: "#9ca3af",
      [DefectDevStatus.IN_PROGRESS]: "#8b5cf6",
      [DefectDevStatus.FIXED]: "#10b981",
      [DefectDevStatus.REJECTED]: "#dc2626",
      [DefectDevStatus.DUPLICATE]: "#6b7280",
      [DefectDevStatus.DEFERRED]: "#78716c",
      [DefectDevStatus.NEEDS_INFO]: "#f59e0b",
    };
    return colors[this.dev_status];
  }

  // ============ Status Transition Validations ============
  canTransitionQA(newStatus: DefectQAStatus): boolean {
    const validTransitions: Record<DefectQAStatus, DefectQAStatus[]> = {
      [DefectQAStatus.NEW]: [DefectQAStatus.TRIAGE, DefectQAStatus.REOPENED],
      [DefectQAStatus.TRIAGE]: [DefectQAStatus.OPEN, DefectQAStatus.CLOSED],
      [DefectQAStatus.OPEN]: [DefectQAStatus.VERIFIED, DefectQAStatus.REOPENED],
      [DefectQAStatus.VERIFIED]: [DefectQAStatus.CLOSED, DefectQAStatus.REOPENED],
      [DefectQAStatus.CLOSED]: [],
      [DefectQAStatus.REOPENED]: [DefectQAStatus.OPEN],
    };
    return validTransitions[this.qa_status]?.includes(newStatus) || false;
  }

  canTransitionDev(newStatus: DefectDevStatus): boolean {
    const validTransitions: Record<DefectDevStatus, DefectDevStatus[]> = {
      [DefectDevStatus.NOT_ASSIGNED]: [DefectDevStatus.IN_PROGRESS, DefectDevStatus.REJECTED, DefectDevStatus.DUPLICATE, DefectDevStatus.DEFERRED],
      [DefectDevStatus.IN_PROGRESS]: [DefectDevStatus.FIXED, DefectDevStatus.NEEDS_INFO],
      [DefectDevStatus.FIXED]: [DefectDevStatus.NOT_ASSIGNED, DefectDevStatus.REJECTED],
      [DefectDevStatus.REJECTED]: [],
      [DefectDevStatus.DUPLICATE]: [],
      [DefectDevStatus.DEFERRED]: [DefectDevStatus.IN_PROGRESS],
      [DefectDevStatus.NEEDS_INFO]: [DefectDevStatus.IN_PROGRESS],
    };
    return validTransitions[this.dev_status]?.includes(newStatus) || false;
  }
}
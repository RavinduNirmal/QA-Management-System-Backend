export enum SuiteType {
  FULL_ROUND = "FULL_ROUND",
  SMOKE = "SMOKE",
  REGRESSION = "REGRESSION",
  SANITY = "SANITY",
  CUSTOM = "CUSTOM",
}

export class TestSuite {
  public readonly id?: number;
  public name: string;
  public description: string | null;
  public suite_type: SuiteType;
  public project_id: number;
  public is_template: boolean;
  public source_project_id: number | null;
  public is_active: boolean;
  public version: string | null;
  public preconditions: string | null;
  public test_case_count: number;
  public created_by: number | null;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(props: {
    id?: number;
    name: string;
    description?: string | null;
    suite_type?: SuiteType;
    project_id: number;
    is_template?: boolean;
    source_project_id?: number | null;
    is_active?: boolean;
    version?: string | null;
    preconditions?: string | null;
    test_case_count?: number;
    created_by?: number | null;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.suite_type = props.suite_type ?? SuiteType.CUSTOM;
    this.project_id = props.project_id;
    this.is_template = props.is_template ?? false;
    this.source_project_id = props.source_project_id ?? null;
    this.is_active = props.is_active ?? true;
    this.version = props.version ?? null;
    this.preconditions = props.preconditions ?? null;
    this.test_case_count = props.test_case_count ?? 0;
    this.created_by = props.created_by ?? null;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  incrementTestCaseCount(): void {
    this.test_case_count++;
  }

  decrementTestCaseCount(): void {
    if (this.test_case_count > 0) this.test_case_count--;
  }

  getSuiteTypeLabel(): string {
    const labels = {
      [SuiteType.FULL_ROUND]: "Full Round Testing",
      [SuiteType.SMOKE]: "Smoke Testing",
      [SuiteType.REGRESSION]: "Regression Testing",
      [SuiteType.SANITY]: "Sanity Testing",
      [SuiteType.CUSTOM]: "Custom Suite",
    };
    return labels[this.suite_type];
  }

  getSuiteTypeColor(): string {
    const colors = {
      [SuiteType.FULL_ROUND]: "#3b82f6",
      [SuiteType.SMOKE]: "#10b981",
      [SuiteType.REGRESSION]: "#f59e0b",
      [SuiteType.SANITY]: "#8b5cf6",
      [SuiteType.CUSTOM]: "#6b7280",
    };
    return colors[this.suite_type];
  }
}
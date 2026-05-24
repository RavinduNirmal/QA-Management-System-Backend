export class Project {
  public readonly id?: number;
  public name: string;
  public description: string | null;
  public code: string | null;
  public is_active: boolean;
  public is_archived: boolean;
  public start_date: Date | null;
  public end_date: Date | null;
  public project_lead_id: number | null;
  public qa_lead_id: number | null;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(props: {
    id?: number;
    name: string;
    description?: string | null;
    code?: string | null;
    is_active?: boolean;
    is_archived?: boolean;
    start_date?: Date | null;
    end_date?: Date | null;
    project_lead_id?: number | null;
    qa_lead_id?: number | null;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.code = props.code ?? null;
    this.is_active = props.is_active ?? true;
    this.is_archived = props.is_archived ?? false;
    this.start_date = props.start_date ?? null;
    this.end_date = props.end_date ?? null;
    this.project_lead_id = props.project_lead_id ?? null;
    this.qa_lead_id = props.qa_lead_id ?? null;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  isActive(): boolean {
    return this.is_active && !this.is_archived;
  }
}
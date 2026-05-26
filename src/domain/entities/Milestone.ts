// import { MilestoneStatus } from "../../infras/database/types/milestone";

// export class Milestone {
//   public readonly id?: number;
//   public name: string;
//   public description: string | null;
//   public project_id: number;
//   public release_version: string | null;
//   public status: MilestoneStatus;
//   public start_date: Date | null;
//   public end_date: Date | null;
//   public assigned_to: number | null;
//   public is_template: boolean;
//   public template_config: any | null;
//   public created_at?: Date;
//   public updated_at?: Date;

//   constructor(props: {
//     id?: number;
//     name: string;
//     description?: string | null;
//     project_id: number;
//     release_version?: string | null;
//     status?: MilestoneStatus;
//     start_date?: Date | null;
//     end_date?: Date | null;
//     assigned_to?: number | null;
//     is_template?: boolean;
//     template_config?: any | null;
//     created_at?: Date;
//     updated_at?: Date;
//   }) {
//     this.id = props.id;
//     this.name = props.name;
//     this.description = props.description ?? null;
//     this.project_id = props.project_id;
//     this.release_version = props.release_version ?? null;
//     this.status = props.status ?? MilestoneStatus.PLANNED;
//     this.start_date = props.start_date ?? null;
//     this.end_date = props.end_date ?? null;
//     this.assigned_to = props.assigned_to ?? null;
//     this.is_template = props.is_template ?? false;
//     this.template_config = props.template_config ?? null;
//     this.created_at = props.created_at;
//     this.updated_at = props.updated_at;
//   }

//   getStatusLabel(): string {
//     const labels = {
//       [MilestoneStatus.PLANNED]: "Planned",
//       [MilestoneStatus.IN_PROGRESS]: "In Progress",
//       [MilestoneStatus.COMPLETED]: "Completed",
//       [MilestoneStatus.CANCELLED]: "Cancelled",
//       [MilestoneStatus.ON_HOLD]: "On Hold",
//     };
//     return labels[this.status];
//   }

//   isActive(): boolean {
//     return this.status === MilestoneStatus.IN_PROGRESS || this.status === MilestoneStatus.PLANNED;
//   }

//   isCompleted(): boolean {
//     return this.status === MilestoneStatus.COMPLETED;
//   }
// }

// import { MilestoneStatus } from "../../infras/database/types/milestone";

// // Re-export the enum so it can be imported from here
// export { MilestoneStatus };

// export class Milestone {
//   public readonly id?: number;
//   public name: string;
//   public description: string | null;
//   public project_id: number;
//   public release_version: string | null;
//   public status: MilestoneStatus;
//   public start_date: Date | null;
//   public end_date: Date | null;
//   public assigned_to: number | null;
//   public is_template: boolean;
//   public template_config: any | null;
//   public created_at?: Date;
//   public updated_at?: Date;

//   constructor(props: {
//     id?: number;
//     name: string;
//     description?: string | null;
//     project_id: number;
//     release_version?: string | null;
//     status?: MilestoneStatus;
//     start_date?: Date | null;
//     end_date?: Date | null;
//     assigned_to?: number | null;
//     is_template?: boolean;
//     template_config?: any | null;
//     created_at?: Date;
//     updated_at?: Date;
//   }) {
//     this.id = props.id;
//     this.name = props.name;
//     this.description = props.description ?? null;
//     this.project_id = props.project_id;
//     this.release_version = props.release_version ?? null;
//     this.status = props.status ?? MilestoneStatus.PLANNED;
//     this.start_date = props.start_date ?? null;
//     this.end_date = props.end_date ?? null;
//     this.assigned_to = props.assigned_to ?? null;
//     this.is_template = props.is_template ?? false;
//     this.template_config = props.template_config ?? null;
//     this.created_at = props.created_at;
//     this.updated_at = props.updated_at;
//   }

//   getStatusLabel(): string {
//     const labels = {
//       [MilestoneStatus.PLANNED]: "Planned",
//       [MilestoneStatus.IN_PROGRESS]: "In Progress",
//       [MilestoneStatus.COMPLETED]: "Completed",
//       [MilestoneStatus.CANCELLED]: "Cancelled",
//       [MilestoneStatus.ON_HOLD]: "On Hold",
//     };
//     return labels[this.status];
//   }

//   isActive(): boolean {
//     return this.status === MilestoneStatus.IN_PROGRESS || this.status === MilestoneStatus.PLANNED;
//   }

//   isCompleted(): boolean {
//     return this.status === MilestoneStatus.COMPLETED;
//   }
// }


import { MilestoneStatus } from "../../infras/database/types/milestone";

// Re-export the enum so it can be imported from this file
export { MilestoneStatus };

export class Milestone {
  public readonly id?: number;
  public name: string;
  public description: string | null;
  public project_id: number;
  public release_version: string | null;
  public status: MilestoneStatus;
  public start_date: Date | null;
  public end_date: Date | null;
  public assigned_to: number | null;
  public is_template: boolean;
  public template_config: any | null;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(props: {
    id?: number;
    name: string;
    description?: string | null;
    project_id: number;
    release_version?: string | null;
    status?: MilestoneStatus;
    start_date?: Date | null;
    end_date?: Date | null;
    assigned_to?: number | null;
    is_template?: boolean;
    template_config?: any | null;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.project_id = props.project_id;
    this.release_version = props.release_version ?? null;
    this.status = props.status ?? MilestoneStatus.PLANNED;
    this.start_date = props.start_date ?? null;
    this.end_date = props.end_date ?? null;
    this.assigned_to = props.assigned_to ?? null;
    this.is_template = props.is_template ?? false;
    this.template_config = props.template_config ?? null;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  getStatusLabel(): string {
    const labels = {
      [MilestoneStatus.PLANNED]: "Planned",
      [MilestoneStatus.IN_PROGRESS]: "In Progress",
      [MilestoneStatus.COMPLETED]: "Completed",
      [MilestoneStatus.CANCELLED]: "Cancelled",
      [MilestoneStatus.ON_HOLD]: "On Hold",
    };
    return labels[this.status];
  }

  isActive(): boolean {
    return this.status === MilestoneStatus.IN_PROGRESS || this.status === MilestoneStatus.PLANNED;
  }

  isCompleted(): boolean {
    return this.status === MilestoneStatus.COMPLETED;
  }
}
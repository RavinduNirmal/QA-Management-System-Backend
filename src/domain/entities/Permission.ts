export class Permission {
  public readonly id?: number;
  public create_s: boolean;
  public update_s: boolean;
  public delete_s: boolean;
  public view: boolean;
  public resource_id: number;
  public role_id: number;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(props: {
    id?: number;
    create_s: boolean;
    update_s: boolean;
    delete_s: boolean;
    view: boolean;
    resource_id: number;
    role_id: number;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = props.id;
    this.create_s = props.create_s;
    this.update_s = props.update_s;
    this.delete_s = props.delete_s;
    this.view = props.view;
    this.resource_id = props.resource_id;
    this.role_id = props.role_id;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  // Business logic methods
  hasFullAccess(): boolean {
    return this.create_s && this.update_s && this.delete_s && this.view;
  }

  hasReadAccess(): boolean {
    return this.view;
  }

  hasWriteAccess(): boolean {
    return this.create_s || this.update_s;
  }

  canDelete(): boolean {
    return this.delete_s;
  }
}

export default Permission;
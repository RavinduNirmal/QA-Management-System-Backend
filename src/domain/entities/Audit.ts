export class Audit {
  public readonly id?: number;
  public user: string;
  public action: string;
  public resource: string;
  public description: string;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(props: {
    id?: number;
    user: string;
    action: string;
    resource: string;
    description: string;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = props.id;
    this.user = props.user;
    this.action = props.action;
    this.resource = props.resource;
    this.description = props.description;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
export class Role {
  public readonly id?: number;
  public name: string;
  public keyValue: string;
  public is_delete: boolean;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(props: {
    id?: number;
    name: string;
    keyValue: string;
    is_delete?: boolean;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.keyValue = props.keyValue;
    this.is_delete = props.is_delete ?? false;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
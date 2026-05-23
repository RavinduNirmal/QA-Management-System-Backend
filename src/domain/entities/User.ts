export class User {
  public readonly id?: number;
  public name: string;
  public user_name: string;
  public password: string;
  public contact_no: string;
  public email: string;
  public is_delete: boolean;
  public role_id: number;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(props: {
    id?: number;
    name: string;
    user_name: string;
    password: string;
    contact_no: string;
    email: string;
    is_delete?: boolean;
    role_id: number;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.user_name = props.user_name;
    this.password = props.password;
    this.contact_no = props.contact_no;
    this.email = props.email;
    this.is_delete = props.is_delete ?? false;
    this.role_id = props.role_id;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
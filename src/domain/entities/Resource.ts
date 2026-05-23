export class Resource {
  public readonly id?: number;
  public name: string;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(props: {
    id?: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  // Business logic methods
  isValidResource(): boolean {
    return this.name && this.name.trim().length > 0;
  }

  getResourceKey(): string {
    return this.name.toUpperCase().replace(/\s/g, '_');
  }
}

export default Resource;
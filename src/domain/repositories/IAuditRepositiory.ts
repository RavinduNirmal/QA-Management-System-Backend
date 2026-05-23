import { Audit } from '../entities/Audit';

export interface FindAuditsOptions {
  where?: any;
  skip?: number;
  take?: number;
  order?: any;
}

export interface IAuditRepository {
  findAndCount(options: FindAuditsOptions): Promise<[Audit[], number]>;
  save(audit: Audit): Promise<Audit>;
}
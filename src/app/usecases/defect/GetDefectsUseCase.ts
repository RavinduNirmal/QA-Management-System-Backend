import { IDefectRepository } from "../../../domain/repositories/IDefectRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepositiory";
import { DefectResponseDTO, PaginatedDefectsResponse, DefectStatsDTO } from "../../dtos/defect/DefectDTOs";

interface GetDefectsQuery {
  page?: number;
  limit?: number;
  project_id?: number;
  qa_status?: string;
  dev_status?: string;
  assigned_to?: number;
  severity?: string;
  priority?: string;
}

export class GetDefectsUseCase {
  constructor(
    private defectRepository: IDefectRepository,
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(query: GetDefectsQuery): Promise<PaginatedDefectsResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.project_id) {
      where.project_id = query.project_id;
    }
    if (query.qa_status) {
      where.qa_status = query.qa_status;
    }
    if (query.dev_status) {
      where.dev_status = query.dev_status;
    }
    if (query.assigned_to) {
      where.assigned_to = query.assigned_to;
    }
    if (query.severity) {
      where.severity = query.severity;
    }
    if (query.priority) {
      where.priority = query.priority;
    }

    const [defects, total] = await this.defectRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });

    const enrichedDefects: DefectResponseDTO[] = await Promise.all(
      defects.map(async (defect) => {
        const project = await this.projectRepository.findById(defect.project_id);
        let assigneeName = null;
        if (defect.assigned_to) {
          const assignee = await this.userRepository.findById(defect.assigned_to);
          assigneeName = assignee?.name || null;
        }
        let reporterName = null;
        if (defect.reported_by) {
          const reporter = await this.userRepository.findById(defect.reported_by);
          reporterName = reporter?.name || null;
        }
        let fixedByName = null;
        if (defect.fixed_by) {
          const fixedBy = await this.userRepository.findById(defect.fixed_by);
          fixedByName = fixedBy?.name || null;
        }
        let verifiedByName = null;
        if (defect.verified_by) {
          const verifiedBy = await this.userRepository.findById(defect.verified_by);
          verifiedByName = verifiedBy?.name || null;
        }
        let closedByName = null;
        if (defect.closed_by) {
          const closedBy = await this.userRepository.findById(defect.closed_by);
          closedByName = closedBy?.name || null;
        }

        return {
          id: defect.id!,
          title: defect.title,
          description: defect.description,
          steps_to_reproduce: defect.steps_to_reproduce,
          actual_result: defect.actual_result,
          expected_result: defect.expected_result,
          severity: defect.severity,
          severity_label: defect.getSeverityLabel(),
          severity_color: defect.getSeverityColor(),
          priority: defect.priority,
          priority_label: defect.getPriorityLabel(),
          qa_status: defect.qa_status,
          qa_status_label: defect.getQAStatusLabel(),
          qa_status_color: defect.getQAStatusColor(),
          dev_status: defect.dev_status,
          dev_status_label: defect.getDevStatusLabel(),
          dev_status_color: defect.getDevStatusColor(),
          resolution: defect.resolution,
          environment: defect.environment,
          browser: defect.browser,
          device: defect.device,
          os: defect.os,
          build_version: defect.build_version,
          is_common_bug: defect.is_common_bug,
          affected_projects: defect.affected_projects,
          affected_versions: defect.affected_versions,
          fixed_in_version: defect.fixed_in_version,
          project_id: defect.project_id,
          project_name: project?.name || null,
          test_case_id: defect.test_case_id,
          test_execution_id: defect.test_execution_id,
          test_cycle_id: defect.test_cycle_id,
          reported_by: defect.reported_by,
          reported_by_name: reporterName,
          assigned_to: defect.assigned_to,
          assigned_to_name: assigneeName,
          assigned_date: defect.assigned_date || null,
          fixed_by: defect.fixed_by,
          fixed_by_name: fixedByName,
          fixed_date: defect.fixed_date || null,
          verified_by: defect.verified_by,
          verified_by_name: verifiedByName,
          verified_date: defect.verified_date || null,
          closed_by: defect.closed_by,
          closed_by_name: closedByName,
          closed_date: defect.closed_date || null,
          reported_date: defect.reported_date,
          attachments: defect.attachments,
          comments: defect.comments,
          tags: defect.tags,
          estimated_fix_time: defect.estimated_fix_time,
          actual_fix_time: defect.actual_fix_time,
          duplicate_of: defect.duplicate_of,
          related_bugs: defect.related_bugs,
          created_at: defect.created_at!,
          updated_at: defect.updated_at!,
        };
      })
    );

    return {
      data: enrichedDefects,
      meta: { total, page, limit },
    };
  }

  async getStats(projectId: number): Promise<DefectStatsDTO> {
    const stats = await this.defectRepository.getDefectStats(projectId);
    return {
      total: stats.total,
      by_qa_status: stats.by_qa_status,
      by_dev_status: stats.by_dev_status,
      by_severity: stats.by_severity,
      by_priority: stats.by_priority,
      avg_resolution_time: stats.avg_resolution_time,
      reopen_rate: stats.reopen_rate,
      defect_density: stats.defect_density,
    };
  }
}
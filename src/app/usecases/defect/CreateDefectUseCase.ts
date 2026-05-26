import { Defect, DefectQAStatus, DefectDevStatus } from "../../../domain/entities/Defect";
import { IDefectRepository } from "../../../domain/repositories/IDefectRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ITestCaseRepository } from "../../../domain/repositories/ITestCaseRepository";
import { IAuditRepository } from "../../../domain/repositories/IAuditRepositiory";
import { Audit } from "../../../domain/entities/Audit";
import { CreateDefectDTO, DefectResponseDTO } from "../../dtos/defect/DefectDTOs";
import { BadRequest, NotFound } from "../../../shared/errors/baseError";
import { DefectSeverity, DefectPriority } from "../../../infras/database/types/defect";

export class CreateDefectUseCase {
  constructor(
    private defectRepository: IDefectRepository,
    private projectRepository: IProjectRepository,
    private testCaseRepository: ITestCaseRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(dto: CreateDefectDTO, createdBy: string = "System"): Promise<DefectResponseDTO> {
    if (!dto.title || dto.title.trim().length === 0) {
      throw new BadRequest("Defect title is required");
    }

    const project = await this.projectRepository.findById(dto.project_id);
    if (!project) {
      throw new NotFound(`Project with ID ${dto.project_id} not found`);
    }

    if (dto.test_case_id) {
      const testCase = await this.testCaseRepository.findById(dto.test_case_id);
      if (!testCase) {
        throw new NotFound(`Test case with ID ${dto.test_case_id} not found`);
      }
    }

    const defect = new Defect({
      title: dto.title.trim(),
      description: dto.description,
      steps_to_reproduce: dto.steps_to_reproduce,
      actual_result: dto.actual_result,
      expected_result: dto.expected_result,
      severity: dto.severity || DefectSeverity.MAJOR,
      priority: dto.priority || DefectPriority.MEDIUM,
      environment: dto.environment,
      browser: dto.browser,
      device: dto.device,
      os: dto.os,
      build_version: dto.build_version,
      project_id: dto.project_id,
      test_case_id: dto.test_case_id,
      test_execution_id: dto.test_execution_id,
      test_cycle_id: dto.test_cycle_id,
      reported_by: dto.assigned_to || 0,
      assigned_to: dto.assigned_to,
      is_common_bug: dto.is_common_bug || false,
      affected_projects: dto.affected_projects,
      affected_versions: dto.affected_versions,
      tags: dto.tags,
      estimated_fix_time: dto.estimated_fix_time,
      related_bugs: dto.related_bugs,
      reported_date: new Date(),
      qa_status: DefectQAStatus.NEW,
      dev_status: DefectDevStatus.NOT_ASSIGNED,
    });

    const savedDefect = await this.defectRepository.save(defect);

    const audit = new Audit({
      user: createdBy,
      action: "Create",
      resource: "Defect",
      description: `Defect created: ${savedDefect.title} for project ${project.name}`,
    });
    await this.auditRepository.save(audit);

    return {
      id: savedDefect.id!,
      title: savedDefect.title,
      description: savedDefect.description,
      steps_to_reproduce: savedDefect.steps_to_reproduce,
      actual_result: savedDefect.actual_result,
      expected_result: savedDefect.expected_result,
      severity: savedDefect.severity,
      severity_label: savedDefect.getSeverityLabel(),
      severity_color: savedDefect.getSeverityColor(),
      priority: savedDefect.priority,
      priority_label: savedDefect.getPriorityLabel(),
      qa_status: savedDefect.qa_status,
      qa_status_label: savedDefect.getQAStatusLabel(),
      qa_status_color: savedDefect.getQAStatusColor(),
      dev_status: savedDefect.dev_status,
      dev_status_label: savedDefect.getDevStatusLabel(),
      dev_status_color: savedDefect.getDevStatusColor(),
      resolution: savedDefect.resolution,
      environment: savedDefect.environment,
      browser: savedDefect.browser,
      device: savedDefect.device,
      os: savedDefect.os,
      build_version: savedDefect.build_version,
      is_common_bug: savedDefect.is_common_bug,
      affected_projects: savedDefect.affected_projects,
      affected_versions: savedDefect.affected_versions,
      fixed_in_version: savedDefect.fixed_in_version,
      project_id: savedDefect.project_id,
      project_name: project.name,
      test_case_id: savedDefect.test_case_id,
      test_execution_id: savedDefect.test_execution_id,
      test_cycle_id: savedDefect.test_cycle_id,
      reported_by: savedDefect.reported_by,
      assigned_to: savedDefect.assigned_to,
      assigned_date: null,
      fixed_by: null,
      fixed_date: null,
      verified_by: null,
      verified_date: null,
      closed_by: null,
      closed_date: null,
      reported_date: savedDefect.reported_date,
      attachments: savedDefect.attachments,
      comments: savedDefect.comments,
      tags: savedDefect.tags,
      estimated_fix_time: savedDefect.estimated_fix_time,
      actual_fix_time: savedDefect.actual_fix_time,
      duplicate_of: savedDefect.duplicate_of,
      related_bugs: savedDefect.related_bugs,
      created_at: savedDefect.created_at!,
      updated_at: savedDefect.updated_at!,
    };
  }
}
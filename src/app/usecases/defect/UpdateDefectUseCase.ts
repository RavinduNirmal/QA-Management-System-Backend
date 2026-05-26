import { IDefectRepository } from "../../../domain/repositories/IDefectRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IAuditRepository } from "../../../domain/repositories/IAuditRepositiory";
import { Audit } from "../../../domain/entities/Audit";
import { UpdateDefectDTO, DefectResponseDTO } from "../../dtos/defect/DefectDTOs";
import { DefectQAStatus, DefectDevStatus } from "../../../infras/database/types/defect";
import { NotFound, BadRequest } from "../../../shared/errors/baseError";

export class UpdateDefectUseCase {
  constructor(
    private defectRepository: IDefectRepository,
    private projectRepository: IProjectRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(defectId: number, dto: UpdateDefectDTO, updatedBy: string = "System", updatedByRole: string = "User"): Promise<DefectResponseDTO> {
    const existingDefect = await this.defectRepository.findById(defectId);
    if (!existingDefect) {
      throw new NotFound(`Defect with ID ${defectId} not found`);
    }

    // Handle QA status transition
    if (dto.qa_status && dto.qa_status !== existingDefect.qa_status) {
      if (!existingDefect.canTransitionQA(dto.qa_status)) {
        throw new BadRequest(`Cannot transition QA status from ${existingDefect.qa_status} to ${dto.qa_status}`);
      }
      
      // Update dates based on status
      if (dto.qa_status === DefectQAStatus.VERIFIED) {
        dto.verified_date = new Date();
        dto.verified_by = parseInt(updatedBy);
      }
      if (dto.qa_status === DefectQAStatus.CLOSED) {
        dto.closed_date = new Date();
        dto.closed_by = parseInt(updatedBy);
      }
      
      await this.defectRepository.addHistory(
        defectId,
        "qa_status",
        existingDefect.qa_status,
        dto.qa_status,
        parseInt(updatedBy),
        updatedBy,
        updatedByRole
      );
    }

    // Handle Dev status transition
    if (dto.dev_status && dto.dev_status !== existingDefect.dev_status) {
      if (!existingDefect.canTransitionDev(dto.dev_status)) {
        throw new BadRequest(`Cannot transition Dev status from ${existingDefect.dev_status} to ${dto.dev_status}`);
      }
      
      // Update dates based on status
      if (dto.dev_status === DefectDevStatus.IN_PROGRESS && !existingDefect.assigned_date) {
        dto.assigned_date = new Date();
      }
      if (dto.dev_status === DefectDevStatus.FIXED) {
        dto.fixed_date = new Date();
        dto.fixed_by = parseInt(updatedBy);
      }
      
      await this.defectRepository.addHistory(
        defectId,
        "dev_status",
        existingDefect.dev_status,
        dto.dev_status,
        parseInt(updatedBy),
        updatedBy,
        updatedByRole
      );
    }

    // Handle other field changes
    if (dto.assigned_to && dto.assigned_to !== existingDefect.assigned_to) {
      await this.defectRepository.addHistory(
        defectId,
        "assigned_to",
        existingDefect.assigned_to?.toString() || "unassigned",
        dto.assigned_to.toString(),
        parseInt(updatedBy),
        updatedBy,
        updatedByRole
      );
    }

    await this.defectRepository.update(defectId, dto);

    const audit = new Audit({
      user: updatedBy,
      action: "Update",
      resource: "Defect",
      description: `Defect ${defectId} updated`,
    });
    await this.auditRepository.save(audit);

    const updatedDefect = await this.defectRepository.findById(defectId);
    if (!updatedDefect) {
      throw new NotFound(`Defect with ID ${defectId} not found after update`);
    }

    const project = await this.projectRepository.findById(updatedDefect.project_id);
    
    return {
      id: updatedDefect.id!,
      title: updatedDefect.title,
      description: updatedDefect.description,
      steps_to_reproduce: updatedDefect.steps_to_reproduce,
      actual_result: updatedDefect.actual_result,
      expected_result: updatedDefect.expected_result,
      severity: updatedDefect.severity,
      severity_label: updatedDefect.getSeverityLabel(),
      severity_color: updatedDefect.getSeverityColor(),
      priority: updatedDefect.priority,
      priority_label: updatedDefect.getPriorityLabel(),
      qa_status: updatedDefect.qa_status,
      qa_status_label: updatedDefect.getQAStatusLabel(),
      qa_status_color: updatedDefect.getQAStatusColor(),
      dev_status: updatedDefect.dev_status,
      dev_status_label: updatedDefect.getDevStatusLabel(),
      dev_status_color: updatedDefect.getDevStatusColor(),
      resolution: updatedDefect.resolution,
      environment: updatedDefect.environment,
      browser: updatedDefect.browser,
      device: updatedDefect.device,
      os: updatedDefect.os,
      build_version: updatedDefect.build_version,
      is_common_bug: updatedDefect.is_common_bug,
      affected_projects: updatedDefect.affected_projects,
      affected_versions: updatedDefect.affected_versions,
      fixed_in_version: updatedDefect.fixed_in_version,
      project_id: updatedDefect.project_id,
      project_name: project?.name || null,
      test_case_id: updatedDefect.test_case_id,
      test_execution_id: updatedDefect.test_execution_id,
      test_cycle_id: updatedDefect.test_cycle_id,
      reported_by: updatedDefect.reported_by,
      assigned_to: updatedDefect.assigned_to,
      assigned_date: updatedDefect.assigned_date,
      fixed_by: updatedDefect.fixed_by,
      fixed_date: updatedDefect.fixed_date,
      verified_by: updatedDefect.verified_by,
      verified_date: updatedDefect.verified_date,
      closed_by: updatedDefect.closed_by,
      closed_date: updatedDefect.closed_date,
      reported_date: updatedDefect.reported_date,
      attachments: updatedDefect.attachments,
      comments: updatedDefect.comments,
      tags: updatedDefect.tags,
      estimated_fix_time: updatedDefect.estimated_fix_time,
      actual_fix_time: updatedDefect.actual_fix_time,
      duplicate_of: updatedDefect.duplicate_of,
      related_bugs: updatedDefect.related_bugs,
      created_at: updatedDefect.created_at!,
      updated_at: updatedDefect.updated_at!,
    };
  }
}
import { Employee } from './employee.model';
import { Project } from './project.model';

export interface ProjectAssignment {
  id: number;
  project: Project;
  employee: Employee;
  assignedRole: string;
  allocationPercent: number;
  startDate: string;
  endDate?: string;
}

export interface AssignmentRequest {
  projectId: number;
  employeeId: number;
  assignedRole: string;
  allocationPercent: number;
  startDate: string;
  endDate?: string;
}

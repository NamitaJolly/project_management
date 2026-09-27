export type ProjectStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface Project {
  id?: number;
  projectName: string;
  client: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  requiredSkills: string[];
}

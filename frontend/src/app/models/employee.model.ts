export interface Employee {
  id?: number;
  name: string;
  email: string;
  designation: string;
  skills: string[];
  experienceYears: number;
  totalCapacityPercent: number;
  availableCapacityPercent: number;
}

export interface EmployeeSkillMatch {
  employee: Employee;
  matchedSkills: string[];
  missingSkills: string[];
  matchCount: number;
  matchPercentage: number;
}

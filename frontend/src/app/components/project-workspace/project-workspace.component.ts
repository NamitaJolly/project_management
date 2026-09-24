import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project, ProjectStatus } from '../../models/project.model';
import { ProjectAssignment } from '../../models/assignment.model';
import { ProjectService } from '../../services/project.service';
import { AssignmentService } from '../../services/assignment.service';
import { ResourceMappingModalComponent } from '../resource-mapping-modal/resource-mapping-modal.component';

@Component({
  selector: 'app-project-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule, ResourceMappingModalComponent],
  template: `
    <div class="workspace-page">
      
      <!-- Top Actions Bar -->
      <div class="header-bar">
        <div>
          <h1 class="page-title">Project Workspace</h1>
          <p class="page-subtitle">Track project scope, required skillsets, and manage team resource assignments</p>
        </div>

        <div class="header-actions">
          <button class="btn btn-secondary" (click)="openNewProjectModal()">
            <span>+ New Project</span>
          </button>
        </div>
      </div>

      <!-- Project Load Error Banner -->
      <div *ngIf="apiError" class="error-banner-top">
        ⚠️ {{ apiError }}
      </div>

      <!-- Project Selector Ribbon -->
      <div class="projects-ribbon">
        <div *ngFor="let p of projects"
             class="project-tab"
             [class.active]="selectedProject?.id === p.id"
             (click)="selectProject(p)">
          <div class="tab-status-dot" [ngClass]="p.status.toLowerCase()"></div>
          <div class="tab-info">
            <span class="tab-title">{{ p.projectName }}</span>
            <span class="tab-client">{{ p.client }}</span>
          </div>
          <span class="badge badge-sm" [ngClass]="getStatusBadgeClass(p.status)">
            {{ p.status }}
          </span>
        </div>
      </div>

      <!-- Selected Project Content View -->
      <div *ngIf="selectedProject" class="workspace-grid">
        
        <!-- Left: Project Scope & Specs -->
        <div class="project-details-card card">
          <div class="card-header">
            <div class="header-left">
              <div class="status-selector-wrap">
                <label class="status-label">Status:</label>
                <select [ngModel]="selectedProject.status" 
                        (ngModelChange)="updateProjectStatus($event)"
                        class="status-select-btn"
                        [ngClass]="getStatusBadgeClass(selectedProject.status)"
                        title="Click to change project status">
                  <option value="PLANNING">📋 PLANNING</option>
                  <option value="IN_PROGRESS">⚡ IN PROGRESS</option>
                  <option value="COMPLETED">✅ COMPLETED</option>
                </select>
              </div>
              <span class="client-pill">Client: {{ selectedProject.client }}</span>
            </div>
            
            <button class="btn btn-primary" (click)="openResourceModal()">
              <span>⚡ Map &amp; Assign Resources</span>
            </button>
          </div>

          <h2 class="project-title">{{ selectedProject.projectName }}</h2>
          <p class="project-description">{{ selectedProject.description }}</p>

          <div class="project-meta-grid">
            <div class="meta-item">
              <span class="meta-label">Timeline</span>
              <span class="meta-value">
                📅 {{ selectedProject.startDate }} → {{ selectedProject.endDate || 'Ongoing' }}
              </span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Team Headcount</span>
              <span class="meta-value">
                👥 {{ assignedTeam.length }} Members Assigned
              </span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Total Allocated Effort</span>
              <span class="meta-value">
                📊 {{ getTotalAllocation() }}% FTE
              </span>
            </div>
          </div>

          <!-- Required Skills Section -->
          <div class="skills-section">
            <div class="skills-header">
              <h3 class="section-heading">Target Required Skills for this Project</h3>
              <span class="badge badge-neutral">{{ selectedProject.requiredSkills.length }} Skills</span>
            </div>

            <div class="skill-pills">
              <span *ngFor="let skill of selectedProject.requiredSkills" class="skill-badge">
                <span class="badge-dot"></span>
                {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Team Roster & Allocations -->
        <div class="roster-card card">
          <div class="roster-header">
            <div>
              <h3 class="section-heading">Assigned Team Members ({{ assignedTeam.length }})</h3>
              <p class="roster-sub">Allocated talent contributing to this project</p>
            </div>
            
            <button class="btn btn-sm btn-secondary" (click)="loadAssignments(selectedProject.id!)">
              🔄 Refresh Roster
            </button>
          </div>

          <div *ngIf="isLoadingTeam" class="loading-state">
            <div class="spinner"></div>
            <span>Loading team members...</span>
          </div>

          <div *ngIf="!isLoadingTeam && assignedTeam.length === 0" class="empty-roster">
            <div class="empty-icon">👥</div>
            <div class="empty-title">No resources mapped yet</div>
            <p class="empty-desc">Match and assign qualified team members with our automated skill-scoring engine.</p>
            <button class="btn btn-primary btn-sm" (click)="openResourceModal()">
              Map Resources Now
            </button>
          </div>

          <div class="roster-list" *ngIf="!isLoadingTeam && assignedTeam.length > 0">
            <div *ngFor="let assignment of assignedTeam" class="roster-row">
              <div class="member-avatar">
                {{ getInitials(assignment.employee.name) }}
              </div>

              <div class="member-info">
                <div class="member-name-row">
                  <span class="member-name">{{ assignment.employee.name }}</span>
                  <span class="role-badge">{{ assignment.assignedRole }}</span>
                </div>
                <div class="member-meta">
                  {{ assignment.employee.designation }} • {{ assignment.employee.email }}
                </div>
                <div class="assignment-dates">
                  🗓️ {{ assignment.startDate }} to {{ assignment.endDate || 'Open' }}
                </div>
              </div>

              <div class="allocation-col">
                <span class="allocation-percent-badge">
                  Assigned Member
                </span>
              </div>

              <div class="action-col">
                <button class="btn btn-sm btn-danger" 
                        title="Unassign employee and restore their capacity"
                        (click)="removeAssignment(assignment)">
                  ✕ Release
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Resource Mapping Modal Component -->
      <app-resource-mapping-modal
        *ngIf="showResourceModal && selectedProject"
        [project]="selectedProject"
        (closed)="closeResourceModal()"
        (assigned)="onEmployeeAssigned($event)">
      </app-resource-mapping-modal>

      <!-- New Project Modal -->
      <div *ngIf="showNewProjectModal" class="modal-overlay" (click)="closeNewProjectModal()">
        <div class="modal-content card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Create New Project</h3>
            <button class="close-btn" (click)="closeNewProjectModal()">✕</button>
          </div>

          <div class="new-project-form">
            <div class="form-group">
              <label>Project Name *</label>
              <input type="text" [(ngModel)]="newProject.projectName" placeholder="e.g. AI Workflow Platform">
            </div>

            <div class="form-group">
              <label>Client *</label>
              <input type="text" [(ngModel)]="newProject.client" placeholder="e.g. Globex Corp">
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="newProject.description" rows="3" placeholder="Brief project summary..."></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Start Date *</label>
                <input type="date" [(ngModel)]="newProject.startDate">
              </div>
              <div class="form-group">
                <label>End Date</label>
                <input type="date" [(ngModel)]="newProject.endDate">
              </div>
            </div>

            <div class="form-group">
              <label>Status</label>
              <select [(ngModel)]="newProject.status">
                <option value="PLANNING">PLANNING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>

            <div class="form-group">
              <label>Required Skills (comma separated) *</label>
              <input type="text" [(ngModel)]="newProjectSkillsInput" placeholder="Java, Spring Boot, Angular, Docker">
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="closeNewProjectModal()">Cancel</button>
            <button class="btn btn-primary" (click)="saveNewProject()">Create Project</button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .workspace-page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .page-title {
      font-size: 1.8rem;
      font-weight: 800;
      color: #f8fafc;
    }
    .page-subtitle {
      font-size: 0.9rem;
      color: #94a3b8;
    }
    .projects-ribbon {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 6px;
    }
    .project-tab {
      background-color: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 12px 18px;
      min-width: 240px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .project-tab:hover {
      background-color: #26334a;
      border-color: #475569;
    }
    .project-tab.active {
      background-color: rgba(59, 130, 246, 0.12);
      border-color: #3b82f6;
    }
    .tab-status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .tab-status-dot.in_progress { background-color: #3b82f6; box-shadow: 0 0 6px #3b82f6; }
    .tab-status-dot.planning { background-color: #f59e0b; box-shadow: 0 0 6px #f59e0b; }
    .tab-status-dot.completed { background-color: #10b981; box-shadow: 0 0 6px #10b981; }
    .tab-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .tab-title {
      font-weight: 700;
      font-size: 0.92rem;
      color: #f8fafc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tab-client {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .workspace-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    @media (max-width: 1024px) {
      .workspace-grid {
        grid-template-columns: 1fr;
      }
    }
    .project-details-card {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .status-selector-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .status-label {
      font-size: 0.78rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .status-select-btn {
      appearance: none;
      -webkit-appearance: none;
      padding: 6px 30px 6px 14px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.8rem;
      cursor: pointer;
      outline: none;
      transition: all 0.2s;
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 10px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2394a3b8' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    }
    .status-select-btn.badge-primary {
      background-color: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
      border: 1px solid #3b82f6;
    }
    .status-select-btn.badge-warning {
      background-color: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
      border: 1px solid #f59e0b;
    }
    .status-select-btn.badge-success {
      background-color: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid #10b981;
    }
    .status-select-btn option {
      background-color: #1e293b;
      color: #f8fafc;
      font-weight: 600;
    }
    .client-pill {
      font-size: 0.8rem;
      color: #94a3b8;
      background: rgba(255, 255, 255, 0.05);
      padding: 4px 10px;
      border-radius: 6px;
    }
    .project-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #f8fafc;
    }
    .project-description {
      font-size: 0.95rem;
      color: #cbd5e1;
      line-height: 1.6;
    }
    .project-meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      background-color: #182234;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 14px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .meta-label {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 600;
    }
    .meta-value {
      font-size: 0.88rem;
      color: #f8fafc;
      font-weight: 700;
    }
    .skills-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .skills-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-heading {
      font-size: 1.05rem;
      font-weight: 700;
      color: #f8fafc;
    }
    .skill-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .skill-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background-color: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #60a5fa;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #3b82f6;
    }
    .roster-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .roster-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .roster-sub {
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .empty-roster {
      text-align: center;
      padding: 48px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .empty-icon {
      font-size: 2.5rem;
    }
    .empty-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #cbd5e1;
    }
    .empty-desc {
      font-size: 0.85rem;
      color: #94a3b8;
      max-width: 300px;
      margin-bottom: 10px;
    }
    .roster-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 520px;
      overflow-y: auto;
    }
    .roster-row {
      display: flex;
      align-items: center;
      gap: 14px;
      background-color: #182234;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 14px;
      transition: all 0.2s;
    }
    .roster-row:hover {
      border-color: #475569;
      background-color: #202d44;
    }
    .member-avatar {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: #ffffff;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .member-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .member-name-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .member-name {
      font-weight: 700;
      font-size: 0.95rem;
      color: #f8fafc;
    }
    .role-badge {
      font-size: 0.72rem;
      font-weight: 600;
      color: #60a5fa;
      background: rgba(59, 130, 246, 0.15);
      padding: 2px 8px;
      border-radius: 6px;
    }
    .member-meta {
      font-size: 0.78rem;
      color: #94a3b8;
    }
    .assignment-dates {
      font-size: 0.75rem;
      color: #64748b;
    }
    .allocation-col {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }
    .allocation-percent-badge {
      font-size: 0.82rem;
      font-weight: 700;
      color: #34d399;
      background-color: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 4px 8px;
      border-radius: 6px;
    }
    .avail-remaining {
      font-size: 0.7rem;
      color: #94a3b8;
    }
    .new-project-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #94a3b8;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 14px;
    }
    .loading-state {
      padding: 30px;
      text-align: center;
      color: #94a3b8;
    }
    .spinner {
      width: 22px;
      height: 22px;
      border: 3px solid rgba(59, 130, 246, 0.2);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 8px;
    }
    .error-banner-top {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid #ef4444;
      color: #fca5a5;
      border-radius: 10px;
      padding: 14px 18px;
      font-size: 0.9rem;
    }
  `]
})
export class ProjectWorkspaceComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  assignedTeam: ProjectAssignment[] = [];
  apiError: string = '';

  isLoadingTeam: boolean = false;
  showResourceModal: boolean = false;
  showNewProjectModal: boolean = false;

  newProject: Project = {
    projectName: '',
    client: '',
    description: '',
    startDate: new Date().toISOString().substring(0, 10),
    status: 'PLANNING',
    requiredSkills: []
  };
  newProjectSkillsInput: string = '';

  constructor(
    private projectService: ProjectService,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.apiError = '';
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.apiError = '';
        if (projects.length > 0 && !this.selectedProject) {
          this.selectProject(projects[0]);
        }
      },
      error: (err) => {
        console.error('Failed to fetch projects', err);
        const status = err?.status;
        if (status === 401 || status === 403) {
          this.apiError = 'Session expired or unauthorized. Please log out and log back in.';
        } else if (status === 0) {
          this.apiError = 'Cannot reach server. Make sure the backend is running on port 8080.';
        } else {
          this.apiError = `Failed to load projects (Error ${status}). Try refreshing.`;
        }
      }
    });
  }

  selectProject(project: Project): void {
    this.selectedProject = project;
    if (project.id) {
      this.loadAssignments(project.id);
    }
  }

  updateProjectStatus(newStatus: ProjectStatus): void {
    if (!this.selectedProject || !this.selectedProject.id) return;
    const updated: Project = {
      ...this.selectedProject,
      status: newStatus
    };

    this.projectService.update(this.selectedProject.id, updated).subscribe({
      next: (res) => {
        this.selectedProject = res;
        const index = this.projects.findIndex(p => p.id === res.id);
        if (index !== -1) {
          this.projects[index] = res;
        }
      },
      error: (err) => alert('Failed to update project status: ' + (err?.error?.message || err.message))
    });
  }

  loadAssignments(projectId: number): void {
    this.isLoadingTeam = true;
    this.assignmentService.getAll(projectId).subscribe({
      next: (assignments) => {
        this.assignedTeam = assignments;
        this.isLoadingTeam = false;
      },
      error: (err) => {
        console.error('Failed to load assignments', err);
        this.isLoadingTeam = false;
      }
    });
  }

  getTotalAllocation(): number {
    return this.assignedTeam.reduce((sum, a) => sum + (a.allocationPercent || 0), 0);
  }

  openResourceModal(): void {
    this.showResourceModal = true;
  }

  closeResourceModal(): void {
    this.showResourceModal = false;
  }

  onEmployeeAssigned(assignment: ProjectAssignment): void {
    this.closeResourceModal();
    if (this.selectedProject?.id) {
      this.loadAssignments(this.selectedProject.id);
    }
  }

  removeAssignment(assignment: ProjectAssignment): void {
    if (confirm(`Are you sure you want to unassign ${assignment.employee.name} (${assignment.allocationPercent}% effort)? This will restore their available capacity.`)) {
      this.assignmentService.remove(assignment.id).subscribe({
        next: () => {
          if (this.selectedProject?.id) {
            this.loadAssignments(this.selectedProject.id);
          }
        },
        error: (err) => console.error('Failed to release assignment', err)
      });
    }
  }

  openNewProjectModal(): void {
    this.newProject = {
      projectName: '',
      client: '',
      description: '',
      startDate: new Date().toISOString().substring(0, 10),
      status: 'PLANNING',
      requiredSkills: []
    };
    this.newProjectSkillsInput = '';
    this.showNewProjectModal = true;
  }

  closeNewProjectModal(): void {
    this.showNewProjectModal = false;
  }

  saveNewProject(): void {
    if (!this.newProject.projectName.trim() || !this.newProject.client.trim()) {
      alert('Please provide project name and client');
      return;
    }

    const skills = this.newProjectSkillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.newProject.requiredSkills = skills;

    this.projectService.create(this.newProject).subscribe({
      next: (created) => {
        this.showNewProjectModal = false;
        this.projects.push(created);
        this.selectProject(created);
      },
      error: (err) => alert('Failed to create project: ' + err.message)
    });
  }

  getStatusBadgeClass(status: ProjectStatus): string {
    switch (status) {
      case 'IN_PROGRESS': return 'badge-primary';
      case 'PLANNING': return 'badge-warning';
      case 'COMPLETED': return 'badge-success';
      default: return 'badge-neutral';
    }
  }

  getInitials(name: string): string {
    return name ? name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() : '??';
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../../models/project.model';
import { EmployeeSkillMatch } from '../../models/employee.model';
import { AssignmentRequest, ProjectAssignment } from '../../models/assignment.model';
import { EmployeeService } from '../../services/employee.service';
import { AssignmentService } from '../../services/assignment.service';

@Component({
  selector: 'app-resource-mapping-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onBackdropClick($event)">
      <div class="modal-content card" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="modal-header">
          <div>
            <div class="modal-subtitle">TEAM & RESOURCE ASSIGNMENT</div>
            <h2 class="modal-title">Assign Team to: {{ project.projectName }}</h2>
          </div>
          <button class="close-btn" (click)="closeModal()">✕</button>
        </div>

        <!-- Filter Controls -->
        <div class="filter-panel">
          <div class="filter-group skills-group">
            <label class="filter-label">Filter by Required Project Skills:</label>
            <div class="skills-tags">
              <span *ngFor="let skill of project.requiredSkills"
                    class="skill-chip"
                    [class.selected]="isSkillSelected(skill)"
                    (click)="toggleSkill(skill)">
                {{ skill }}
                <span class="chip-check" *ngIf="isSkillSelected(skill)">✓</span>
              </span>
            </div>
          </div>

          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">Min Experience: {{ minExperience }} yrs</label>
              <input type="range" min="0" max="10" step="1" [(ngModel)]="minExperience" (input)="searchCandidates()" class="slider">
            </div>
          </div>
        </div>

        <!-- Matching Candidates List -->
        <div class="results-container">
          <div class="results-header">
            <h3>Matching Candidates Ranked by Skill Match ({{ candidateMatches.length }})</h3>
            <span class="auto-ranked-badge">⚡ Auto-Ranked</span>
          </div>

          <div *ngIf="isLoading" class="loading-state">
            <div class="spinner"></div>
            <span>Analyzing skills and engineers...</span>
          </div>

          <div *ngIf="!isLoading && candidateMatches.length === 0" class="empty-state">
            <span>No employees match the selected criteria. Try lowering the experience filter.</span>
          </div>

          <div class="candidate-list" *ngIf="!isLoading">
            <div *ngFor="let match of candidateMatches" 
                 class="candidate-card"
                 [class.active]="selectedMatch?.employee?.id === match.employee.id"
                 [class.assigned-this]="isAssignedToThisProject(match.employee.id!)"
                 [class.assigned-other]="isAssignedToOtherProject(match.employee.id!)">
              
              <div class="candidate-main">
                <div class="candidate-avatar">
                  {{ getInitials(match.employee.name) }}
                </div>
                
                <div class="candidate-info">
                  <div class="name-row">
                    <span class="candidate-name">{{ match.employee.name }}</span>
                    <span class="badge" 
                          [ngClass]="getScoreBadgeClass(match.matchPercentage)">
                      {{ match.matchPercentage | number:'1.0-0' }}% Match
                    </span>

                    <!-- Assigned to this project badge with release date -->
                    <span *ngIf="isAssignedToThisProject(match.employee.id!)" class="badge badge-assigned-this">
                      ✓ On This Project (Release: {{ getAssignment(match.employee.id!)?.endDate || 'Ongoing' }})
                    </span>

                    <!-- Assigned to other project badge with release date -->
                    <span *ngIf="isAssignedToOtherProject(match.employee.id!)" class="badge badge-assigned-other">
                      💼 Assigned to {{ getAssignment(match.employee.id!)?.project?.projectName }} (Release: {{ getAssignment(match.employee.id!)?.endDate || 'Ongoing' }})
                    </span>

                    <!-- Available badge -->
                    <span *ngIf="!getAssignment(match.employee.id!)" class="badge badge-available">
                      🟢 Available on Bench
                    </span>
                  </div>

                  <div class="candidate-role">{{ match.employee.designation }} • {{ match.employee.experienceYears }} yrs exp</div>
                  
                  <!-- Matched & Missing Skills -->
                  <div class="match-skills-breakdown">
                    <span *ngFor="let s of match.matchedSkills" class="skill-tag matched" title="Matched Skill">
                      ✓ {{ s }}
                    </span>
                    <span *ngFor="let s of match.missingSkills" class="skill-tag missing" title="Missing Required Skill">
                      - {{ s }}
                    </span>
                  </div>
                </div>

                <!-- Action Button Col -->
                <div class="candidate-action-col">
                  <!-- If already assigned to THIS project: show Release button -->
                  <button *ngIf="isAssignedToThisProject(match.employee.id!)"
                          class="btn btn-sm btn-danger"
                          (click)="releaseEmployee(match.employee.id!)">
                    ✕ Release
                  </button>

                  <!-- If not assigned or on another project: show Select / Assign button -->
                  <button *ngIf="!isAssignedToThisProject(match.employee.id!)"
                          class="btn btn-sm"
                          [ngClass]="selectedMatch?.employee?.id === match.employee.id ? 'btn-success' : 'btn-primary'"
                          (click)="selectCandidate(match)">
                    {{ selectedMatch?.employee?.id === match.employee.id ? '✓ Selected' : '+ Assign' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Assignment Form -->
        <div *ngIf="selectedMatch" class="assignment-form-section" id="assignmentForm">
          <div class="form-title">
            <span>Assign <strong>{{ selectedMatch.employee.name }}</strong> to {{ project.projectName }}</span>
            <span *ngIf="isAssignedToOtherProject(selectedMatch.employee.id!)" class="badge-reassign-warning">
              ⚠️ Currently on {{ getAssignment(selectedMatch.employee.id!)?.project?.projectName }} (Release: {{ getAssignment(selectedMatch.employee.id!)?.endDate || 'Ongoing' }})
            </span>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Assigned Role *</label>
              <input type="text" [(ngModel)]="assignedRole" placeholder="e.g. Lead Developer, Cloud Architect, UI Engineer">
            </div>

            <div class="form-group">
              <label>Start Date *</label>
              <input type="date" [(ngModel)]="startDate">
            </div>

            <div class="form-group">
              <label>Release / End Date (Optional)</label>
              <input type="date" [(ngModel)]="endDate">
            </div>
          </div>

          <div *ngIf="errorMessage" class="error-banner">
            ⚠️ {{ errorMessage }}
          </div>

          <div class="assignment-actions">
            <button class="btn btn-secondary" (click)="selectedMatch = null">Cancel Selection</button>
            <button class="btn btn-primary" 
                    [disabled]="isSubmitting || !assignedRole.trim()"
                    (click)="submitAssignment()">
              <span *ngIf="!isSubmitting">⚡ Confirm Assignment to {{ project.projectName }}</span>
              <span *ngIf="isSubmitting">Assigning...</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .modal-content {
      width: 100%;
      max-width: 900px;
      max-height: 90vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
      border: 1px solid #475569;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #334155;
      padding-bottom: 14px;
    }
    .modal-subtitle {
      font-size: 0.75rem;
      font-weight: 700;
      color: #3b82f6;
      letter-spacing: 0.08em;
    }
    .modal-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: #f8fafc;
    }
    .close-btn {
      color: #94a3b8;
      font-size: 1.3rem;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .close-btn:hover {
      color: #f8fafc;
      background-color: rgba(255, 255, 255, 0.1);
    }
    .filter-panel {
      background-color: #182234;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .filter-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 6px;
    }
    .skills-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .skill-chip {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      background-color: #1e293b;
      color: #94a3b8;
      border: 1px solid #334155;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .skill-chip.selected {
      background-color: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
      border-color: #3b82f6;
    }
    .filter-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .slider {
      width: 100%;
      accent-color: #3b82f6;
      cursor: pointer;
    }
    .results-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .results-header h3 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #cbd5e1;
    }
    .auto-ranked-badge {
      font-size: 0.72rem;
      font-weight: 700;
      color: #10b981;
      background: rgba(16, 185, 129, 0.15);
      padding: 2px 8px;
      border-radius: 12px;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .candidate-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 320px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .candidate-card {
      background-color: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 12px 16px;
      transition: all 0.2s;
    }
    .candidate-card:hover {
      background-color: #26334a;
      border-color: #475569;
    }
    .candidate-card.active {
      border-color: #3b82f6;
      background-color: rgba(59, 130, 246, 0.08);
      box-shadow: 0 0 0 1px #3b82f6;
    }
    .candidate-card.assigned-this {
      border-color: rgba(16, 185, 129, 0.35);
      background-color: rgba(16, 185, 129, 0.04);
    }
    .candidate-card.assigned-other {
      border-color: rgba(245, 158, 11, 0.35);
      background-color: rgba(245, 158, 11, 0.04);
    }
    .candidate-main {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .candidate-avatar {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: linear-gradient(135deg, #475569, #334155);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      color: #f8fafc;
      flex-shrink: 0;
    }
    .candidate-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .name-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .candidate-name {
      font-weight: 700;
      font-size: 0.98rem;
      color: #f8fafc;
    }
    .candidate-role {
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .badge-assigned-this {
      background-color: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.35);
      font-size: 0.72rem;
      font-weight: 700;
    }
    .badge-assigned-other {
      background-color: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.35);
      font-size: 0.72rem;
      font-weight: 700;
    }
    .badge-available {
      background-color: rgba(59, 130, 246, 0.12);
      color: #93c5fd;
      border: 1px solid rgba(59, 130, 246, 0.3);
      font-size: 0.72rem;
      font-weight: 600;
    }
    .badge-reassign-warning {
      background-color: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 3px 8px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .match-skills-breakdown {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .skill-tag {
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .skill-tag.matched {
      background-color: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .skill-tag.missing {
      background-color: rgba(100, 116, 139, 0.15);
      color: #64748b;
      border: 1px solid rgba(100, 116, 139, 0.2);
    }
    .candidate-action-col {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    .assignment-form-section {
      background-color: #182234;
      border: 1px solid #3b82f6;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      animation: fadeIn 0.2s ease-out;
    }
    .form-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.95rem;
      color: #cbd5e1;
      flex-wrap: wrap;
      gap: 8px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr;
      gap: 14px;
    }
    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group label {
      font-size: 0.78rem;
      font-weight: 600;
      color: #94a3b8;
    }
    .form-group input {
      padding: 8px 12px;
      background-color: #0f172a;
      border: 1px solid #334155;
      border-radius: 6px;
      color: #f8fafc;
      font-size: 0.9rem;
    }
    .form-group input:focus {
      border-color: #3b82f6;
      outline: none;
    }
    .btn-success {
      background-color: #10b981 !important;
      color: white !important;
      border-color: #10b981 !important;
    }
    .btn-danger {
      background-color: rgba(239, 68, 68, 0.15) !important;
      color: #f87171 !important;
      border: 1px solid rgba(239, 68, 68, 0.3) !important;
    }
    .btn-danger:hover {
      background-color: rgba(239, 68, 68, 0.3) !important;
      color: #fca5a5 !important;
    }
    .error-banner {
      background-color: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 10px;
      border-radius: 8px;
      font-size: 0.85rem;
    }
    .assignment-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .loading-state, .empty-state {
      padding: 28px;
      text-align: center;
      color: #94a3b8;
      font-size: 0.9rem;
    }
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(59, 130, 246, 0.2);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 8px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ResourceMappingModalComponent implements OnInit {
  @Input() project!: Project;
  @Output() closed = new EventEmitter<void>();
  @Output() assigned = new EventEmitter<ProjectAssignment>();

  selectedSkills: string[] = [];
  minExperience: number = 0;

  candidateMatches: EmployeeSkillMatch[] = [];
  selectedMatch: EmployeeSkillMatch | null = null;
  allAssignments: ProjectAssignment[] = [];

  assignedRole: string = '';
  startDate: string = '';
  endDate: string = '';

  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private employeeService: EmployeeService,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit(): void {
    if (this.project) {
      this.selectedSkills = [...(this.project.requiredSkills || [])];
      this.startDate = this.project.startDate || new Date().toISOString().substring(0, 10);
      this.endDate = this.project.endDate || '';
      this.assignedRole = 'Project Contributor';
      this.loadAllAssignments();
      this.searchCandidates();
    }
  }

  loadAllAssignments(): void {
    this.assignmentService.getAll().subscribe({
      next: (assignments) => {
        this.allAssignments = assignments;
      },
      error: (err) => console.error('Failed to load assignments', err)
    });
  }

  getAssignment(employeeId: number): ProjectAssignment | undefined {
    return this.allAssignments.find(a => a.employee?.id === employeeId);
  }

  isAssignedToThisProject(employeeId: number): boolean {
    const ass = this.getAssignment(employeeId);
    return !!ass && ass.project?.id === this.project?.id;
  }

  isAssignedToOtherProject(employeeId: number): boolean {
    const ass = this.getAssignment(employeeId);
    return !!ass && ass.project?.id !== this.project?.id;
  }

  releaseEmployee(employeeId: number): void {
    const assignment = this.getAssignment(employeeId);
    if (!assignment || !assignment.id) return;

    if (confirm(`Release this engineer from ${this.project.projectName}?`)) {
      this.assignmentService.remove(assignment.id).subscribe({
        next: () => {
          this.allAssignments = this.allAssignments.filter(a => a.id !== assignment.id);
          this.assigned.emit(assignment);
          this.searchCandidates();
        },
        error: (err) => alert('Failed to release resource: ' + (err?.error?.message || err.message))
      });
    }
  }

  isSkillSelected(skill: string): boolean {
    return this.selectedSkills.includes(skill);
  }

  toggleSkill(skill: string): void {
    if (this.isSkillSelected(skill)) {
      this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
    } else {
      this.selectedSkills.push(skill);
    }
    this.searchCandidates();
  }

  searchCandidates(): void {
    this.isLoading = true;
    this.employeeService.search(
      this.selectedSkills,
      this.minExperience,
      0
    ).subscribe({
      next: (results) => {
        this.candidateMatches = results;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to search candidates', err);
        this.isLoading = false;
      }
    });
  }

  selectCandidate(match: EmployeeSkillMatch): void {
    this.selectedMatch = match;
    this.errorMessage = '';
    this.assignedRole = match.employee.designation || 'Project Contributor';

    setTimeout(() => {
      const el = document.getElementById('assignmentForm');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  submitAssignment(): void {
    if (!this.selectedMatch || !this.selectedMatch.employee.id || !this.project.id) {
      return;
    }

    if (!this.assignedRole.trim()) {
      this.errorMessage = 'Please specify an assigned role.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const request: AssignmentRequest = {
      projectId: this.project.id,
      employeeId: this.selectedMatch.employee.id,
      assignedRole: this.assignedRole.trim(),
      allocationPercent: 100,
      startDate: this.startDate,
      endDate: this.endDate && this.endDate.trim().length > 0 ? this.endDate.trim() : undefined
    };

    this.assignmentService.assign(request).subscribe({
      next: (assignment) => {
        this.isSubmitting = false;
        this.assigned.emit(assignment);
        this.closeModal();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || (err?.error?.fieldErrors ? Object.values(err.error.fieldErrors).join(', ') : 'Failed to assign employee.');
      }
    });
  }

  closeModal(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    this.closeModal();
  }

  getInitials(name: string): string {
    return name ? name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() : '??';
  }

  getScoreBadgeClass(score: number): string {
    if (score >= 80) return 'badge-success';
    if (score >= 50) return 'badge-primary';
    if (score > 0) return 'badge-warning';
    return 'badge-neutral';
  }
}

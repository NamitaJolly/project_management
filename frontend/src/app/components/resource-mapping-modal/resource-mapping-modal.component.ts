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
            <div class="modal-subtitle">RESOURCE ALLOCATION ENGINE</div>
            <h2 class="modal-title">Map Team to: {{ project.projectName }}</h2>
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
              <label class="filter-label">Min Experience (Years): {{ minExperience }} yrs</label>
              <input type="range" min="0" max="10" step="1" [(ngModel)]="minExperience" (input)="searchCandidates()" class="slider">
            </div>

            <div class="filter-group">
              <label class="filter-label">Min Available Capacity: {{ minCapacity }}%</label>
              <input type="range" min="0" max="100" step="5" [(ngModel)]="minCapacity" (input)="searchCandidates()" class="slider">
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
            <span>Analyzing skills and capacities...</span>
          </div>

          <div *ngIf="!isLoading && candidateMatches.length === 0" class="empty-state">
            <span>No employees match the selected criteria. Try lowering the experience or capacity filters.</span>
          </div>

          <div class="candidate-list" *ngIf="!isLoading">
            <div *ngFor="let match of candidateMatches" 
                 class="candidate-card"
                 [class.active]="selectedMatch?.employee?.id === match.employee.id"
                 (click)="selectCandidate(match)">
              
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

                <!-- Capacity meter on card -->
                <div class="candidate-capacity-col">
                  <div class="cap-label">
                    <span>Available:</span>
                    <strong>{{ match.employee.availableCapacityPercent }}%</strong>
                  </div>
                  <div class="capacity-track">
                    <div class="capacity-fill" 
                         [ngClass]="getCapacityClass(match.employee.availableCapacityPercent)"
                         [style.width.%]="match.employee.availableCapacityPercent">
                    </div>
                  </div>
                  <button class="btn btn-sm select-btn" [ngClass]="selectedMatch?.employee?.id === match.employee.id ? 'btn-success' : 'btn-primary'">
                    {{ selectedMatch?.employee?.id === match.employee.id ? '✓ Selected' : 'Select' }}
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
            <span class="avail-badge">Available Capacity: {{ selectedMatch.employee.availableCapacityPercent }}%</span>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Assigned Role *</label>
              <input type="text" [(ngModel)]="assignedRole" placeholder="e.g. Lead Developer, Cloud Engineer">
            </div>

            <div class="form-group">
              <label>Allocation Effort (% of time) *</label>
              <div class="allocation-input-row">
                <input type="number" min="1" [max]="selectedMatch.employee.availableCapacityPercent" [(ngModel)]="allocationPercent" class="number-input">
                <span class="input-suffix">%</span>
                <input type="range" min="1" [max]="selectedMatch.employee.availableCapacityPercent" [(ngModel)]="allocationPercent" class="slider flex-1">
              </div>
              <span class="cap-helper">Max available for {{ selectedMatch.employee.name }}: {{ selectedMatch.employee.availableCapacityPercent }}%</span>
            </div>

            <div class="form-group">
              <label>Start Date *</label>
              <input type="date" [(ngModel)]="startDate">
            </div>

            <div class="form-group">
              <label>End Date</label>
              <input type="date" [(ngModel)]="endDate">
            </div>
          </div>

          <div *ngIf="errorMessage" class="error-banner">
            ⚠️ {{ errorMessage }}
          </div>

          <div class="assignment-actions">
            <button class="btn btn-secondary" (click)="selectedMatch = null">Cancel Selection</button>
            <button class="btn btn-primary" 
                    [disabled]="isSubmitting || allocationPercent <= 0 || allocationPercent > selectedMatch.employee.availableCapacityPercent"
                    (click)="submitAssignment()">
              <span *ngIf="!isSubmitting">⚡ Confirm & Assign {{ allocationPercent }}% to Project</span>
              <span *ngIf="isSubmitting">Assigning Resource...</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .modal-content {
      width: 100%;
      max-width: 850px;
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
      grid-template-columns: 1fr 1fr;
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
      max-height: 280px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .candidate-card {
      background-color: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 12px 16px;
      cursor: pointer;
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
      gap: 10px;
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
    .candidate-capacity-col {
      width: 130px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: flex-end;
      flex-shrink: 0;
    }
    .cap-label {
      font-size: 0.75rem;
      color: #94a3b8;
      display: flex;
      gap: 4px;
    }
    .select-btn {
      width: 100%;
      margin-top: 4px;
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
    }
    .avail-badge {
      font-size: 0.75rem;
      color: #34d399;
      background: rgba(16, 185, 129, 0.15);
      padding: 2px 8px;
      border-radius: 12px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
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
    .allocation-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .number-input {
      width: 70px;
      padding: 8px 10px;
      background-color: #0f172a;
      border: 1px solid #334155;
      border-radius: 6px;
      color: #f8fafc;
      font-weight: 700;
      font-size: 0.95rem;
    }
    .input-suffix {
      font-weight: 700;
      color: #94a3b8;
      font-size: 0.9rem;
    }
    .flex-1 {
      flex: 1;
    }
    .cap-helper {
      font-size: 0.72rem;
      color: #94a3b8;
    }
    .btn-success {
      background-color: #10b981 !important;
      color: white !important;
      border-color: #10b981 !important;
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
  minCapacity: number = 0;

  candidateMatches: EmployeeSkillMatch[] = [];
  selectedMatch: EmployeeSkillMatch | null = null;

  assignedRole: string = '';
  allocationPercent: number = 50;
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
      this.searchCandidates();
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
      this.minCapacity
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
    
    // Default allocation to min(50, available capacity)
    if (match.employee.availableCapacityPercent > 0) {
      this.allocationPercent = Math.min(50, match.employee.availableCapacityPercent);
    } else {
      this.allocationPercent = 0;
    }

    setTimeout(() => {
      const el = document.getElementById('assignmentForm');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  submitAssignment(): void {
    if (!this.selectedMatch || !this.selectedMatch.employee.id || !this.project.id) {
      return;
    }

    if (this.allocationPercent <= 0) {
      this.errorMessage = 'Please allocate at least 1% effort.';
      return;
    }

    if (this.allocationPercent > this.selectedMatch.employee.availableCapacityPercent) {
      this.errorMessage = `Cannot allocate ${this.allocationPercent}%: employee only has ${this.selectedMatch.employee.availableCapacityPercent}% available capacity.`;
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const request: AssignmentRequest = {
      projectId: this.project.id,
      employeeId: this.selectedMatch.employee.id,
      assignedRole: this.assignedRole.trim() || 'Contributor',
      allocationPercent: Number(this.allocationPercent),
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
        this.errorMessage = err?.error?.message || (err?.error?.fieldErrors ? Object.values(err.error.fieldErrors).join(', ') : 'Failed to assign employee. Please verify capacity and dates.');
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

  getCapacityClass(cap: number): string {
    if (cap > 50) return 'high';
    if (cap >= 25) return 'medium';
    return 'low';
  }
}

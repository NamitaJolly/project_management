import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-directory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="directory-page">
      
      <!-- Top Bar -->
      <div class="header-bar">
        <div>
          <h1 class="page-title">Engineering Talent Directory</h1>
          <p class="page-subtitle">Roster of software engineers, capacities, and skill proficiencies</p>
        </div>

        <div class="header-actions">
          <button class="btn btn-primary" (click)="openCreateModal()">
            <span>+ Add New Employee</span>
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="search-bar card">
        <div class="search-input-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" [(ngModel)]="searchKeyword" placeholder="Search by engineer name, designation, or skill..." class="search-input">
        </div>

        <div class="filter-pills">
          <button class="filter-pill" [class.active]="filterDesignation === 'ALL'" (click)="filterDesignation = 'ALL'">All</button>
          <button class="filter-pill" [class.active]="filterDesignation === 'FULLSTACK'" (click)="filterDesignation = 'FULLSTACK'">Full-Stack</button>
          <button class="filter-pill" [class.active]="filterDesignation === 'FRONTEND'" (click)="filterDesignation = 'FRONTEND'">Frontend</button>
          <button class="filter-pill" [class.active]="filterDesignation === 'BACKEND'" (click)="filterDesignation = 'BACKEND'">Backend</button>
          <button class="filter-pill" [class.active]="filterDesignation === 'DEVOPS'" (click)="filterDesignation = 'DEVOPS'">DevOps / Cloud</button>
        </div>
      </div>

      <!-- API Error Banner -->
      <div *ngIf="apiError" class="error-banner">
        ⚠️ {{ apiError }}
      </div>

      <!-- Employees Grid -->
      <div class="employees-grid">
        <div *ngFor="let emp of filteredEmployees()" class="card employee-card">
          <div class="card-top">
            <div class="emp-avatar">
              {{ getInitials(emp.name) }}
            </div>
            
            <div class="emp-headings">
              <h3 class="emp-name">{{ emp.name }}</h3>
              <div class="emp-role">{{ emp.designation }}</div>
              <div class="emp-email">📧 {{ emp.email }}</div>
            </div>

            <button class="delete-icon-btn" (click)="deleteEmployee(emp)" title="Delete Employee">✕</button>
          </div>

          <div class="emp-exp-bar">
            <span>Experience: <strong>{{ emp.experienceYears }} Years</strong></span>
          </div>

          <!-- Allocation Status Badge -->
          <div class="allocation-status-badge" [ngClass]="getStatusBadgeClass(emp.availableCapacityPercent)">
            <span class="status-dot"></span>
            <span>{{ getStatusText(emp.availableCapacityPercent) }}</span>
          </div>

          <!-- Skills Badges -->
          <div class="skills-block">
            <div class="skills-title">Core Skills ({{ emp.skills.length }}):</div>
            <div class="skills-wrap">
              <span *ngFor="let s of emp.skills" class="skill-tag">
                {{ s }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Employee Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Add New Engineering Talent</h3>
            <button class="close-btn" (click)="closeModal()">✕</button>
          </div>

          <div class="add-emp-form">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" [(ngModel)]="newEmp.name" placeholder="e.g. Maya Lin">
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input type="email" [(ngModel)]="newEmp.email" placeholder="e.g. maya.lin@company.com">
            </div>

            <div class="form-group">
              <label>Designation *</label>
              <input type="text" [(ngModel)]="newEmp.designation" placeholder="e.g. Senior Angular Architect">
            </div>

            <div class="form-group">
              <label>Experience (Years) *</label>
              <input type="number" min="0" max="30" [(ngModel)]="newEmp.experienceYears">
            </div>

            <div class="form-group">
              <label>Skills (Comma-separated) *</label>
              <input type="text" [(ngModel)]="skillsInput" placeholder="Java, Spring Boot, Angular, TypeScript, Docker">
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn btn-primary" (click)="saveEmployee()">Save Employee</button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .directory-page {
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
    .search-bar {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 20px;
    }
    .search-input-wrap {
      display: flex;
      align-items: center;
      background-color: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 0 14px;
    }
    .search-icon {
      font-size: 1.1rem;
      margin-right: 10px;
    }
    .search-input {
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      width: 100%;
      padding: 12px 0;
    }
    .filter-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .filter-pill {
      background-color: #0f172a;
      border: 1px solid #334155;
      color: #94a3b8;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .filter-pill.active {
      background-color: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
      border-color: #3b82f6;
    }
    .employees-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    .employee-card {
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .employee-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.5);
    }
    .card-top {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      position: relative;
    }
    .emp-avatar {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1, #3b82f6);
      color: #ffffff;
      font-weight: 800;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .emp-headings {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .emp-name {
      font-size: 1.05rem;
      font-weight: 700;
      color: #f8fafc;
    }
    .emp-role {
      font-size: 0.8rem;
      color: #60a5fa;
      font-weight: 600;
    }
    .emp-email {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .delete-icon-btn {
      color: #64748b;
      font-size: 0.9rem;
      padding: 4px;
    }
    .delete-icon-btn:hover {
      color: #ef4444;
    }
    .emp-exp-bar {
      font-size: 0.8rem;
      color: #94a3b8;
      background-color: #182234;
      padding: 6px 10px;
      border-radius: 6px;
    }
    .allocation-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      width: fit-content;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .allocation-status-badge.available {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
    }
    .allocation-status-badge.available .status-dot {
      background: #10b981;
      box-shadow: 0 0 6px #10b981;
    }
    .allocation-status-badge.partial {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;
    }
    .allocation-status-badge.partial .status-dot {
      background: #f59e0b;
      box-shadow: 0 0 6px #f59e0b;
    }
    .allocation-status-badge.allocated {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
    }
    .allocation-status-badge.allocated .status-dot {
      background: #ef4444;
      box-shadow: 0 0 6px #ef4444;
    }
    .skills-block {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: auto;
      border-top: 1px solid #334155;
      padding-top: 10px;
    }
    .skills-title {
      font-size: 0.72rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
    }
    .skills-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .skill-tag {
      font-size: 0.72rem;
      padding: 2px 8px;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid #334155;
      color: #cbd5e1;
    }
    .add-emp-form {
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
    .error-banner {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid #ef4444;
      color: #fca5a5;
      border-radius: 10px;
      padding: 14px 18px;
      font-size: 0.9rem;
    }
  `]
})
export class EmployeeDirectoryComponent implements OnInit {
  employees: Employee[] = [];
  searchKeyword: string = '';
  filterDesignation: string = 'ALL';
  apiError: string = '';

  showModal: boolean = false;
  newEmp: Employee = {
    name: '',
    email: '',
    designation: '',
    experienceYears: 3,
    totalCapacityPercent: 100,
    availableCapacityPercent: 100,
    skills: []
  };
  skillsInput: string = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.apiError = '';
    this.employeeService.getAll().subscribe({
      next: (list) => { this.employees = list; this.apiError = ''; },
      error: (err) => {
        console.error('Failed to load employees', err);
        const status = err?.status;
        if (status === 401 || status === 403) {
          this.apiError = 'Session expired or unauthorized. Please log out and log back in.';
        } else if (status === 0) {
          this.apiError = 'Cannot reach server. Make sure the backend is running on port 8080.';
        } else {
          this.apiError = `Failed to load employees (Error ${status}). Try refreshing.`;
        }
      }
    });
  }

  filteredEmployees(): Employee[] {
    return this.employees.filter(emp => {
      const q = this.searchKeyword.toLowerCase().trim();
      const matchesSearch = !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.designation.toLowerCase().includes(q) ||
        emp.skills.some(s => s.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (this.filterDesignation === 'ALL') return true;
      const des = emp.designation.toLowerCase();
      if (this.filterDesignation === 'FULLSTACK') return des.includes('full-stack') || des.includes('fullstack');
      if (this.filterDesignation === 'FRONTEND') return des.includes('frontend') || des.includes('ui');
      if (this.filterDesignation === 'BACKEND') return des.includes('backend') || des.includes('java');
      if (this.filterDesignation === 'DEVOPS') return des.includes('devops') || des.includes('cloud') || des.includes('sre');

      return true;
    });
  }

  openCreateModal(): void {
    this.newEmp = {
      name: '',
      email: '',
      designation: '',
      experienceYears: 3,
      totalCapacityPercent: 100,
      availableCapacityPercent: 100,
      skills: []
    };
    this.skillsInput = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveEmployee(): void {
    if (!this.newEmp.name || !this.newEmp.email || !this.newEmp.designation) {
      alert('Please fill out all required fields');
      return;
    }

    this.newEmp.skills = this.skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.newEmp.availableCapacityPercent = this.newEmp.totalCapacityPercent;

    this.employeeService.create(this.newEmp).subscribe({
      next: (created) => {
        this.employees.push(created);
        this.closeModal();
      },
      error: (err) => alert('Failed to create employee: ' + (err?.error?.message || err.message))
    });
  }

  deleteEmployee(emp: Employee): void {
    if (confirm(`Delete employee ${emp.name}? Any project assignments will be removed.`)) {
      this.employeeService.delete(emp.id!).subscribe({
        next: () => {
          this.employees = this.employees.filter(e => e.id !== emp.id);
        },
        error: (err) => alert('Failed to delete employee')
      });
    }
  }

  getInitials(name: string): string {
    return name ? name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() : '??';
  }

  getStatusBadgeClass(cap: number): string {
    if (cap >= 75) return 'available';
    if (cap > 0) return 'partial';
    return 'allocated';
  }

  getStatusText(cap: number): string {
    if (cap >= 75) return 'Available on Bench';
    if (cap > 0) return 'Active on Projects';
    return 'Fully Committed';
  }
}

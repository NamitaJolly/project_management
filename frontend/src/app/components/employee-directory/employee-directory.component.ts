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

          <!-- Capacity Meter -->
          <div class="capacity-section">
            <div class="cap-header">
              <span class="cap-title">Available Capacity:</span>
              <span class="cap-value" [ngClass]="getCapacityTextClass(emp.availableCapacityPercent)">
                {{ emp.availableCapacityPercent }}% / {{ emp.totalCapacityPercent }}%
              </span>
            </div>

            <div class="capacity-track">
              <div class="capacity-fill" 
                   [ngClass]="getCapacityClass(emp.availableCapacityPercent)"
                   [style.width.%]="emp.availableCapacityPercent">
              </div>
            </div>
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

            <div class="form-row">
              <div class="form-group">
                <label>Experience (Years) *</label>
                <input type="number" min="0" max="30" [(ngModel)]="newEmp.experienceYears">
              </div>

              <div class="form-group">
                <label>Total Capacity (%) *</label>
                <input type="number" min="10" max="100" [(ngModel)]="newEmp.totalCapacityPercent">
              </div>
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
    .capacity-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .cap-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
    }
    .cap-title {
      color: #94a3b8;
    }
    .cap-value {
      font-weight: 700;
    }
    .cap-value.high { color: #34d399; }
    .cap-value.medium { color: #fbbf24; }
    .cap-value.low { color: #f87171; }
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
  `]
})
export class EmployeeDirectoryComponent implements OnInit {
  employees: Employee[] = [];
  searchKeyword: string = '';
  filterDesignation: string = 'ALL';

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
    this.employeeService.getAll().subscribe({
      next: (list) => this.employees = list,
      error: (err) => console.error('Failed to load employees', err)
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

  getCapacityClass(cap: number): string {
    if (cap > 50) return 'high';
    if (cap >= 25) return 'medium';
    return 'low';
  }

  getCapacityTextClass(cap: number): string {
    if (cap > 50) return 'high';
    if (cap >= 25) return 'medium';
    return 'low';
  }
}

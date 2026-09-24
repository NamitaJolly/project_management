import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardSummary } from '../../models/dashboard.model';
import { Project } from '../../models/project.model';
import { Employee } from '../../models/employee.model';
import { DashboardService } from '../../services/dashboard.service';
import { ProjectService } from '../../services/project.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">

      <!-- Header Section -->
      <div class="dashboard-header">
        <div>
          <h1 class="dash-title">Operational Intelligence Dashboard</h1>
          <p class="dash-subtitle">Real-time overview of projects, capacity pipelines, and talent allocations</p>
        </div>

        <div class="header-actions">
          <a routerLink="/projects" class="btn btn-primary">
            <span>⚡ Open Project Workspace</span>
          </a>
        </div>
      </div>

      <!-- KPI Stat Cards Grid -->
      <div class="kpi-grid">
        
        <!-- Active Projects KPI -->
        <div class="card kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Active Projects</span>
            <div class="kpi-icon blue">💼</div>
          </div>
          <div class="kpi-val">{{ stats?.activeProjects || 0 }}</div>
          <div class="kpi-footer">
            <span class="sub-stat">Total: <strong>{{ stats?.totalProjects || 0 }}</strong></span>
            <span class="sub-stat-sep">•</span>
            <span class="sub-stat">Planning: <strong>{{ stats?.planningProjects || 0 }}</strong></span>
            <span class="sub-stat-sep">•</span>
            <span class="sub-stat">Done: <strong>{{ stats?.completedProjects || 0 }}</strong></span>
          </div>
        </div>

        <!-- Total Talent Pool KPI -->
        <div class="card kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Total Engineering Talent</span>
            <div class="kpi-icon indigo">👥</div>
          </div>
          <div class="kpi-val">{{ stats?.totalEmployees || 0 }}</div>
          <div class="kpi-footer">
            <span class="sub-stat">Total Capacity: <strong>{{ stats?.totalCapacity || 0 }}%</strong></span>
            <span class="sub-stat-sep">•</span>
            <span class="sub-stat">Allocated: <strong>{{ stats?.allocatedCapacity || 0 }}%</strong></span>
          </div>
        </div>

        <!-- Resource Utilization Rate KPI -->
        <div class="card kpi-card highlight-card">
          <div class="kpi-top">
            <span class="kpi-label">Resource Utilization Rate</span>
            <div class="kpi-icon green">📈</div>
          </div>
          <div class="utilization-metric-row">
            <div class="kpi-val text-accent">{{ stats?.resourceUtilizationRate || 0 }}%</div>
            <span class="util-badge" [ngClass]="getUtilizationBadgeClass(stats?.resourceUtilizationRate || 0)">
              {{ getUtilizationStatusText(stats?.resourceUtilizationRate || 0) }}
            </span>
          </div>
          
          <!-- Visual Utilization Progress Bar -->
          <div class="progress-bar-container">
            <div class="progress-track">
              <div class="progress-fill" [style.width.%]="stats?.resourceUtilizationRate || 0"></div>
            </div>
            <div class="progress-meta">
              <span>{{ stats?.allocatedCapacity || 0 }}% Allocated</span>
              <span>{{ stats?.availableCapacity || 0 }}% Free Capacity</span>
            </div>
          </div>
        </div>

        <!-- Bench Availability KPI -->
        <div class="card kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Available Free Capacity</span>
            <div class="kpi-icon amber">⚡</div>
          </div>
          <div class="kpi-val text-amber">{{ stats?.availableCapacity || 0 }}%</div>
          <div class="kpi-footer">
            <span class="sub-stat">Ready to assign across active & planning pipelines</span>
          </div>
        </div>

      </div>

      <!-- Main Content Grid -->
      <div class="dash-content-grid">
        
        <!-- Active Projects List -->
        <div class="card content-card">
          <div class="content-header">
            <div>
              <h2 class="section-title">Active Projects Pipeline</h2>
              <p class="section-sub">Projects currently undergoing execution</p>
            </div>
            <a routerLink="/projects" class="view-all-link">Manage in Workspace →</a>
          </div>

          <div class="projects-list">
            <div *ngFor="let p of activeProjectsList" class="project-item">
              <div class="proj-left">
                <div class="proj-name-row">
                  <span class="proj-name">{{ p.projectName }}</span>
                  <span class="badge badge-primary">{{ p.status }}</span>
                </div>
                <div class="proj-meta">Client: <strong>{{ p.client }}</strong> • Dates: {{ p.startDate }} to {{ p.endDate || 'Ongoing' }}</div>
                <div class="proj-skills-tags">
                  <span *ngFor="let skill of p.requiredSkills" class="skill-mini-badge">{{ skill }}</span>
                </div>
              </div>

              <div class="proj-action">
                <a routerLink="/projects" class="btn btn-sm btn-secondary">Open Workspace</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Talent Bench / Ready to Deploy -->
        <div class="card content-card">
          <div class="content-header">
            <div>
              <h2 class="section-title">Available Talent Bench</h2>
              <p class="section-sub">Engineers with high available capacity</p>
            </div>
            <a routerLink="/employees" class="view-all-link">All Employees →</a>
          </div>

          <div class="bench-list">
            <div *ngFor="let emp of benchEmployees" class="bench-item">
              <div class="bench-avatar">
                {{ getInitials(emp.name) }}
              </div>

              <div class="bench-info">
                <div class="bench-name">{{ emp.name }}</div>
                <div class="bench-role">{{ emp.designation }} • {{ emp.experienceYears }} yrs exp</div>
                <div class="bench-skills">
                  <span *ngFor="let s of (emp.skills | slice:0:3)" class="skill-mini-badge">{{ s }}</span>
                  <span *ngIf="emp.skills.length > 3" class="skill-more">+{{ emp.skills.length - 3 }}</span>
                </div>
              </div>

              <div class="bench-cap-box">
                <span class="bench-cap-num">{{ emp.availableCapacityPercent }}%</span>
                <span class="bench-cap-label">Available</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .dashboard-page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .dash-title {
      font-size: 1.85rem;
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.02em;
    }
    .dash-subtitle {
      font-size: 0.92rem;
      color: #94a3b8;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    @media (max-width: 1100px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .kpi-grid { grid-template-columns: 1fr; }
    }
    .kpi-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: linear-gradient(180deg, #1e293b 0%, #172033 100%);
    }
    .kpi-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .kpi-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .kpi-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }
    .kpi-icon.blue { background: rgba(59, 130, 246, 0.15); }
    .kpi-icon.indigo { background: rgba(99, 102, 241, 0.15); }
    .kpi-icon.green { background: rgba(16, 185, 129, 0.15); }
    .kpi-icon.amber { background: rgba(245, 158, 11, 0.15); }
    .kpi-val {
      font-size: 2.2rem;
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .text-accent {
      color: #38bdf8;
    }
    .text-amber {
      color: #fbbf24;
    }
    .kpi-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .sub-stat-sep {
      color: #475569;
    }
    .utilization-metric-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .util-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
    }
    .util-badge.optimal {
      background-color: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .util-badge.moderate {
      background-color: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    .util-badge.high {
      background-color: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .progress-bar-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 4px;
    }
    .progress-track {
      width: 100%;
      height: 8px;
      background-color: #334155;
      border-radius: 9999px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #38bdf8, #3b82f6);
      border-radius: 9999px;
      transition: width 0.6s ease;
    }
    .progress-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.72rem;
      color: #94a3b8;
    }
    .dash-content-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 24px;
    }
    @media (max-width: 1024px) {
      .dash-content-grid { grid-template-columns: 1fr; }
    }
    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      border-bottom: 1px solid #334155;
      padding-bottom: 12px;
    }
    .section-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #f8fafc;
    }
    .section-sub {
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .view-all-link {
      font-size: 0.85rem;
      font-weight: 600;
      color: #3b82f6;
    }
    .projects-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .project-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #182234;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 16px;
      transition: all 0.2s;
    }
    .project-item:hover {
      border-color: #475569;
      background-color: #202d44;
    }
    .proj-name-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .proj-name {
      font-weight: 700;
      font-size: 1rem;
      color: #f8fafc;
    }
    .proj-meta {
      font-size: 0.8rem;
      color: #94a3b8;
      margin: 4px 0 8px;
    }
    .proj-skills-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .skill-mini-badge {
      font-size: 0.72rem;
      padding: 2px 8px;
      border-radius: 4px;
      background-color: rgba(59, 130, 246, 0.12);
      color: #93c5fd;
      border: 1px solid rgba(59, 130, 246, 0.25);
    }
    .bench-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .bench-item {
      display: flex;
      align-items: center;
      gap: 14px;
      background-color: #182234;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 12px 16px;
    }
    .bench-avatar {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .bench-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .bench-name {
      font-weight: 700;
      font-size: 0.95rem;
      color: #f8fafc;
    }
    .bench-role {
      font-size: 0.78rem;
      color: #94a3b8;
    }
    .bench-skills {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
    }
    .skill-more {
      font-size: 0.7rem;
      color: #94a3b8;
    }
    .bench-cap-box {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .bench-cap-num {
      font-size: 1.1rem;
      font-weight: 800;
      color: #34d399;
    }
    .bench-cap-label {
      font-size: 0.7rem;
      color: #94a3b8;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardSummary | null = null;
  activeProjectsList: Project[] = [];
  benchEmployees: Employee[] = [];

  constructor(
    private dashboardService: DashboardService,
    private projectService: ProjectService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadActiveProjects();
    this.loadBenchEmployees();
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Failed to load dashboard stats', err)
    });
  }

  loadActiveProjects(): void {
    this.projectService.getAll('IN_PROGRESS').subscribe({
      next: (projects) => this.activeProjectsList = projects,
      error: (err) => console.error('Failed to load active projects', err)
    });
  }

  loadBenchEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (employees) => {
        // Filter employees with available capacity >= 50%
        this.benchEmployees = employees
          .filter(e => e.availableCapacityPercent >= 50)
          .sort((a, b) => b.availableCapacityPercent - a.availableCapacityPercent)
          .slice(0, 5);
      },
      error: (err) => console.error('Failed to load bench talent', err)
    });
  }

  getUtilizationBadgeClass(rate: number): string {
    if (rate >= 75) return 'high';
    if (rate >= 40) return 'optimal';
    return 'moderate';
  }

  getUtilizationStatusText(rate: number): string {
    if (rate >= 80) return 'High Demand';
    if (rate >= 40) return 'Healthy Utilization';
    return 'Available Headroom';
  }

  getInitials(name: string): string {
    return name ? name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() : '??';
  }
}

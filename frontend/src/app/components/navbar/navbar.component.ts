import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar">
      <div class="nav-container">
        <div class="brand-group" routerLink="/dashboard">
          <div class="logo-icon">🌊</div>
          <div class="brand-text">
            <span class="brand-title">Team<span class="brand-highlight">Flow</span></span>
            <span class="brand-subtitle">Project & Resource Allocator</span>
          </div>
        </div>

        <nav class="nav-links" *ngIf="isLoggedIn$ | async">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">📊</span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/projects" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">💼</span>
            <span>Projects & Workspace</span>
          </a>
          <a routerLink="/employees" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">👥</span>
            <span>Talent Directory</span>
          </a>
        </nav>

        <div class="nav-right">
          <div class="status-indicator">
            <span class="pulse-dot"></span>
            <span>Derby DB Online</span>
          </div>

          <!-- User session info and Logout button -->
          <ng-container *ngIf="isLoggedIn$ | async">
            <div class="user-pill" *ngIf="getUsername()">
              <span class="user-avatar">👤</span>
              <span class="user-name">{{ getUsername() }}</span>
            </div>

            <button class="btn-logout" (click)="logout()" title="Log out of RMG portal">
              <span class="logout-icon">🚪</span>
              <span>Logout</span>
            </button>
          </ng-container>

          <ng-container *ngIf="!(isLoggedIn$ | async)">
            <a routerLink="/login" class="nav-link login-link">
              <span>Sign In →</span>
            </a>
          </ng-container>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      background-color: rgba(30, 41, 59, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid #334155;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }
    .logo-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.02em;
    }
    .brand-highlight {
      color: #3b82f6;
    }
    .brand-subtitle {
      font-size: 0.72rem;
      color: #94a3b8;
    }
    .nav-links {
      display: flex;
      gap: 8px;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      color: #94a3b8;
      transition: all 0.2s;
      text-decoration: none;
    }
    .nav-link:hover {
      color: #f8fafc;
      background-color: rgba(255, 255, 255, 0.05);
    }
    .nav-link.active {
      color: #3b82f6;
      background-color: rgba(59, 130, 246, 0.12);
    }
    .nav-icon {
      font-size: 1.1rem;
    }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 20px;
      background-color: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      font-size: 0.75rem;
      font-weight: 600;
      color: #34d399;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
      animation: pulse 2s infinite;
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 8px;
      background-color: #1e293b;
      border: 1px solid #334155;
      font-size: 0.82rem;
      color: #cbd5e1;
      font-weight: 600;
    }
    .user-avatar {
      font-size: 0.85rem;
    }
    .user-name {
      color: #60a5fa;
    }
    .btn-logout {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: 8px;
      background-color: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      background-color: rgba(239, 68, 68, 0.25);
      border-color: #ef4444;
      color: #fca5a5;
    }
    .logout-icon {
      font-size: 0.95rem;
    }
    .login-link {
      background-color: #3b82f6;
      color: white !important;
      padding: 6px 14px;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }
  `]
})
export class NavbarComponent {
  isLoggedIn$;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


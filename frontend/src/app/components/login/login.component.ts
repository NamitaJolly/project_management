import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-login', standalone: true, imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="card auth-card">
        <h2>🌊 TeamFlow Login</h2>
        <p class="subtitle">Team & Project Workspace Portal</p>
        <div class="error" *ngIf="error">{{error}}</div>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group"><label>Username</label><input type="text" [(ngModel)]="username" name="username" required></div>
          <div class="form-group"><label>Password</label><input type="password" [(ngModel)]="password" name="password" required></div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
        <p class="footer">New RMG User? <a routerLink="/register">Register here</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; height: 80vh; }
    .auth-card { width: 100%; max-width: 400px; padding: 40px; text-align: center; }
    .subtitle { color: var(--text-secondary); margin-bottom: 20px; }
    .form-group { margin-bottom: 20px; text-align: left; }
    .form-group label { display: block; margin-bottom: 5px; color: var(--text-secondary); font-size: 0.9rem; }
    .form-group input { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-main); color: white; }
    .w-100 { width: 100%; padding: 12px; }
    .footer { margin-top: 20px; font-size: 0.9rem; color: var(--text-secondary); }
    .footer a { color: var(--primary); text-decoration: none; }
    .error { color: #f87171; background: rgba(239, 68, 68, 0.1); padding: 10px; border-radius: 6px; margin-bottom: 15px; }
  `]
})
export class LoginComponent {
  username = ''; password = ''; error = '';
  constructor(private authService: AuthService, private router: Router) {}
  onSubmit() {
    this.authService.login({username: this.username, password: this.password}).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.error = 'Invalid username or password'
    });
  }
}

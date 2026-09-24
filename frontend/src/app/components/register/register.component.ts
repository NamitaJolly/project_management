import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="card auth-card">
        <h2>⚡ Register RMG Account</h2>
        <p class="subtitle">Resource Management & Allocation Portal</p>
        
        <div class="error-banner" *ngIf="error">⚠️ {{ error }}</div>
        <div class="success-banner" *ngIf="successMessage">✓ {{ successMessage }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Username *</label>
            <input type="text" [(ngModel)]="username" name="username" placeholder="e.g. john_doe" required>
          </div>

          <div class="form-group">
            <label>Corporate Email *</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="e.g. user@company.com" required>
            <span class="field-hint" *ngIf="email && !isValidEmail()">Please enter a valid email address (e.g. name&#64;domain.com)</span>
          </div>

          <div class="form-group">
            <label>Password *</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="At least 6 characters" required>
            <span class="field-hint" *ngIf="password && password.length < 6">Password must be at least 6 characters</span>
          </div>

          <div class="form-group">
            <label>Confirm Password *</label>
            <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="Re-enter password" required>
            <span class="field-hint" *ngIf="confirmPassword && password !== confirmPassword">Passwords do not match</span>
          </div>

          <button type="submit" class="btn btn-primary w-100" [disabled]="isSubmitting">
            <span *ngIf="!isSubmitting">Create RMG Account</span>
            <span *ngIf="isSubmitting">Creating Account...</span>
          </button>
        </form>

        <p class="footer">Already registered? <a routerLink="/login">Login here</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 20px; }
    .auth-card { width: 100%; max-width: 440px; padding: 36px; text-align: center; }
    .subtitle { color: var(--text-secondary, #94a3b8); margin-bottom: 20px; font-size: 0.88rem; }
    .form-group { margin-bottom: 16px; text-align: left; }
    .form-group label { display: block; margin-bottom: 6px; color: var(--text-secondary, #94a3b8); font-size: 0.85rem; font-weight: 600; }
    .form-group input { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color, #334155); background: var(--bg-main, #0f172a); color: white; box-sizing: border-box; font-size: 0.92rem; }
    .form-group input:focus { border-color: #3b82f6; outline: none; }
    .field-hint { display: block; font-size: 0.75rem; color: #f87171; margin-top: 4px; }
    .w-100 { width: 100%; padding: 12px; margin-top: 8px; }
    .footer { margin-top: 20px; font-size: 0.9rem; color: var(--text-secondary, #94a3b8); }
    .footer a { color: var(--primary, #3b82f6); text-decoration: none; font-weight: 600; }
    .error-banner { color: #f87171; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); padding: 10px; border-radius: 8px; margin-bottom: 15px; font-size: 0.85rem; text-align: left; }
    .success-banner { color: #34d399; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); padding: 10px; border-radius: 8px; margin-bottom: 15px; font-size: 0.85rem; text-align: left; }
  `]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  successMessage = '';
  isSubmitting = false;

  constructor(private authService: AuthService, private router: Router) {}

  isValidEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.email.trim());
  }

  onSubmit() {
    this.error = '';
    this.successMessage = '';

    if (!this.username.trim()) {
      this.error = 'Please enter a username.';
      return;
    }

    if (!this.email.trim() || !this.isValidEmail()) {
      this.error = 'Please enter a valid corporate email address (e.g. user@company.com).';
      return;
    }

    if (!this.password || this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.isSubmitting = true;
    this.authService.register({
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Account created successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}


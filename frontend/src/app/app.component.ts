import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root', standalone: true, imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-layout">
      <app-navbar *ngIf="isLoggedIn$ | async"></app-navbar>
      <main class="main-content"><router-outlet></router-outlet></main>
    </div>
  `,
  styles: [`
    .app-layout { min-height: 100vh; display: flex; flex-direction: column; }
    .main-content { flex: 1; }
  `]
})
export class AppComponent {
  isLoggedIn$;
  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }
}

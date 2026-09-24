import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-layout">
      <app-navbar *ngIf="showNavbar"></app-navbar>
      <main class="main-content"><router-outlet></router-outlet></main>
    </div>
  `,
  styles: [`
    .app-layout { min-height: 100vh; display: flex; flex-direction: column; }
    .main-content { flex: 1; }
  `]
})
export class AppComponent {
  showNavbar = false;

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      const isAuthPage = url.includes('/login') || url.includes('/register') || url === '/';
      this.showNavbar = !isAuthPage && !!this.authService.getToken();
    });
  }
}

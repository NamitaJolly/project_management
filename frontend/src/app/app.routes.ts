import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectWorkspaceComponent } from './components/project-workspace/project-workspace.component';
import { EmployeeDirectoryComponent } from './components/employee-directory/employee-directory.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'projects', component: ProjectWorkspaceComponent, canActivate: [authGuard] },
  { path: 'employees', component: EmployeeDirectoryComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];

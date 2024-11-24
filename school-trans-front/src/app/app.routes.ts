// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./pages/profile/profile.component')
      .then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'track-bus', 
    loadComponent: () => import('./pages/bus-tracking/bus-tracking.component')
      .then(m => m.BusTrackingComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'schedule', 
    loadComponent: () => import('./pages/schedule/schedule.component')
      .then(m => m.ScheduleComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'notifications', 
    loadComponent: () => import('./pages/notifications/notifications.component')
      .then(m => m.NotificationsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'settings', 
    loadComponent: () => import('./pages/settings/settings.component')
      .then(m => m.SettingsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: '**', 
    loadComponent: () => import('./pages/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  }
];
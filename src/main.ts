import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/components/auth/login/login.component';
import { DashboardComponent } from './app/components/features/dashboard/dashboard.component';
import { UsersComponent } from './app/components/features/users/users.component';
import { ZonesComponent } from './app/components/features/zones/zones.component';
import { ActivitiesComponent } from './app/components/features/activities/activities.component';
import { ProfessionalsPageComponent } from './app/pages/professionals/professionals-page.component';
import { ProfessionalDetailPageComponent } from './app/pages/professionals/professional-detail-page.component';
import { AuthGuard } from './app/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'profesionales', 
    component: ProfessionalsPageComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'profesionales/:id', 
    component: ProfessionalDetailPageComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'usuarios', 
    component: UsersComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'zonas', 
    component: ZonesComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'actividades', 
    component: ActivitiesComponent,
    canActivate: [AuthGuard]
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient()
  ]
});

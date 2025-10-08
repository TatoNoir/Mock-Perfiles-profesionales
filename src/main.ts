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

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profesionales', component: ProfessionalsPageComponent },
  { path: 'profesionales/:id', component: ProfessionalDetailPageComponent },
  { path: 'usuarios', component: UsersComponent },
  { path: 'zonas', component: ZonesComponent },
  { path: 'actividades', component: ActivitiesComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient()
  ]
});

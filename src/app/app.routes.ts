import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/features/dashboard/dashboard.component';
import { UsersComponent } from './components/features/users/users.component';
import { UserProfessionalProfileComponent } from './components/features/users/pages/user-professional-profile/user-professional-profile.component';
import { ZonesComponent } from './components/features/zones/zones.component';
import { ActivitiesComponent } from './components/features/activities/activities.component';
import { ProfessionalsPageComponent } from './pages/professionals/professionals-page.component';
import { ProfessionalDetailPageComponent } from './pages/professionals/professional-detail-page.component';
import { AccountPageComponent } from './pages/account/account-page.component';
import { SettingsPageComponent } from './pages/settings/settings-page.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
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
    path: 'usuarios/:id/perfil-profesional', 
    component: UserProfessionalProfileComponent,
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
  { 
    path: 'mis-datos', 
    component: AccountPageComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'configuracion', 
    component: SettingsPageComponent,
    canActivate: [AuthGuard]
  },
  // Ruta wildcard para manejar rutas no encontradas
  { path: '**', redirectTo: 'login' }
];

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfessionalDetailComponent } from '../../../professional-detail/professional-detail.component';
import { ProfessionalProfile } from '../../../../../models/professional.model';
import { UsersService, ApiUser } from '../../services/users.service';

@Component({
  selector: 'app-user-professional-profile',
  standalone: true,
  imports: [CommonModule, ProfessionalDetailComponent],
  templateUrl: './user-professional-profile.component.html',
  styleUrls: ['./user-professional-profile.component.css']
})
export class UserProfessionalProfileComponent implements OnInit {
  professionalProfile: ProfessionalProfile | undefined = undefined;
  error: string | null = null;
  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario de los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId) {
        this.loadUserProfile(this.userId);
      } else {
        this.error = 'ID de usuario no válido';
      }
    });
  }

  loadUserProfile(userId: number): void {
    this.usersService.getUsers().subscribe({
      next: (users: ApiUser[]) => {
        const user = users.find(u => u.id === userId);
        if (user) {
          this.professionalProfile = this.convertUserToProfessionalProfile(user);
        } else {
          this.error = 'Usuario no encontrado';
        }
      },
      error: (err) => {
        console.error('Error cargando usuario:', err);
        this.error = 'Error al cargar el perfil del usuario';
      }
    });
  }

  convertUserToProfessionalProfile(user: ApiUser): ProfessionalProfile {
    return {
      id: user.id,
      name: user.name,
      specialty: user.activities && user.activities.length > 0 ? user.activities[0].name : 'Sin especialidad',
      description: user.description || 'Profesional registrado en el sistema',
      location: user.locality?.name || 'Ubicación no especificada',
      email: user.email,
      phone: user.phone,
      skills: user.activities?.map(activity => activity.name) || [],
      experienceYears: 0 // No tenemos esta información en ApiUser
    };
  }

  goBack(): void {
    this.router.navigate(['/usuarios']);
  }
}

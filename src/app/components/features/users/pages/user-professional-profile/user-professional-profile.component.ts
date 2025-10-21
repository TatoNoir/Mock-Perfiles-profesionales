import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfessionalProfile } from '../../../../../models/professional.model';
import { UsersService, ApiUser, ApiQuestion, ApiReview, UsersResponse } from '../../services/users.service';
import { CommentsModalComponent } from '../../modals/comments-modal/comments-modal.component';
import { ReviewsModalComponent } from '../../modals/reviews-modal/reviews-modal.component';

@Component({
  selector: 'app-user-professional-profile',
  standalone: true,
  imports: [CommonModule, CommentsModalComponent, ReviewsModalComponent],
  templateUrl: './user-professional-profile.component.html',
  styleUrls: ['./user-professional-profile.component.css']
})
export class UserProfessionalProfileComponent implements OnInit {
  professionalProfile: ProfessionalProfile | undefined = undefined;
  error: string | null = null;
  userId: number | null = null;
  contactUrl: string | null = null;
  questions: ApiQuestion[] = [];
  reviews: ApiReview[] = [];
  showCommentsModal = false;
  showReviewsModal = false;
  loading = false;
  userData: any;


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
      next: (response: UsersResponse) => {
        const user = response.data.find(u => u.id === userId);
        if (user) {
          this.loadUserData(userId);
          this.contactUrl = this.buildWhatsAppUrl(user);
          // Cargar comentarios/preguntas de este usuario
          this.usersService.getQuestions(user.id).subscribe({
            next: (qs) => { this.questions = qs || []; },
            error: () => { this.questions = []; }
          });
          
          // Cargar valoraciones de este usuario
          this.usersService.getReviews(user.id).subscribe({
            next: (rs) => { this.reviews = rs || []; },
            error: () => { this.reviews = []; }
          });
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

  loadUserData(id: number){
    this.loading = true;
    this.error = null;
    
    this.usersService.getUserData(id).subscribe({
      next: (response: any) => { 
        console.log('Usuario cargado:', response);
        this.userData = response;
        this.professionalProfile = this.convertUserToProfessionalProfile(this.userData);
        this.loading = false;
      },
      error: (err: any) => { 
        console.error('Error cargando usuarios', err);
        this.loading = false;
        this.error = 'Error al cargar los usuarios';
      }
    });
  }

  convertUserToProfessionalProfile(user: ApiUser): ProfessionalProfile {

    const professionalProfile: ProfessionalProfile = {
      id: user.id,
      name: (user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user.name || 'Usuario')),
      specialty: user.activities && user.activities.length > 0 ? user.activities[0].name : 'Sin especialidad',
      description: user.description || 'Profesional registrado en el sistema',
      location: this.buildLocation(user),
      email: user.email,
      phone: this.buildPhone(user) || '',
      skills: user.activities?.map(activity => activity.name) || [],
      experienceYears: 0,
      created_at: user.created_at,
      profile_picture: user.profile_picture
    };
    // Adjuntar algunos campos adicionales para el template (sin cambiar la interfaz)
    (professionalProfile as any).document_number = (user as any).document_number || '';
    (professionalProfile as any).address_display = this.buildAddress(user);
    (professionalProfile as any).nationality = (user as any).nationality || '';
    (professionalProfile as any).birth_date = (user as any).birth_date || '';
    
    return professionalProfile;
  }

  private buildWhatsAppUrl(user: ApiUser): string | null {
    const country = (user as any).country_phone || '';
    const area = (user as any).area_code || '';
    const number = (user as any).phone_number || '';
    const digits = `${country}${area}${number}`.replace(/[^0-9]/g, '');
    if (!digits) return null;
    const text = encodeURIComponent('Hola, te contacto desde Perfiles Profesionales');
    return `https://wa.me/${digits}?text=${text}`;
  }

  private buildPhone(user: ApiUser): string {
    const country = (user as any).country_phone || '';
    const area = (user as any).area_code || '';
    const number = (user as any).phone_number || '';
    const compact = `${country} ${area} ${number}`.trim().replace(/\s+/g, ' ');
    return compact;
  }

  private buildLocation(user: ApiUser): string {
    const loc = user.locality?.name || '';
    const state = (user as any).locality?.state?.name || '';
    const stateUpper = state ? state.toUpperCase() : '';
    return [loc, stateUpper].filter(Boolean).join(' · ');
  }

  private buildAddress(user: ApiUser): string {
    const street = (user as any).street || '';
    const streetNumber = (user as any).street_number || '';
    const floor = (user as any).floor || '';
    const apartment = (user as any).apartment || '';
    const address = (user as any).address || '';
    const main = [street, streetNumber].filter(Boolean).join(' ');
    const extra = [floor, apartment].filter(Boolean).join(' ');
    const parts = [address, main, extra].filter(Boolean);
    return parts.join(' · ');
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        return;
      }
      
      // Crear un objeto FileReader para leer la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Actualizar la imagen en el perfil
        if (this.professionalProfile) {
          this.professionalProfile.profile_picture = e.target.result;
          
          // Aquí podrías enviar la imagen al servidor
          // this.uploadImageToServer(file);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  goBack(): void {
    this.router.navigate(['/usuarios']);
  }

  openCommentsModal(): void {
    this.showCommentsModal = true;
  }

  closeCommentsModal(): void {
    this.showCommentsModal = false;
  }

  onQuestionsUpdated(updatedQuestions: ApiQuestion[]): void {
    this.questions = updatedQuestions;
  }

  reloadQuestions(): void {
    if (this.userId) {
      this.usersService.getQuestions(this.userId).subscribe({
        next: (qs) => { 
          this.questions = qs || []; 
        },
        error: () => { 
          this.questions = []; 
        }
      });
    }
  }

  openReviewsModal(): void {
    this.showReviewsModal = true;
  }

  closeReviewsModal(): void {
    this.showReviewsModal = false;
  }

  onReviewsUpdated(updatedReviews: ApiReview[]): void {
    this.reviews = updatedReviews;
  }

  reloadReviews(): void {
    if (this.userId) {
      this.usersService.getReviews(this.userId).subscribe({
        next: (rs) => { 
          this.reviews = rs || []; 
        },
        error: () => { 
          this.reviews = []; 
        }
      });
    }
  }

  getStars(value: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= value ? '★' : '☆');
    }
    return stars;
  }
}

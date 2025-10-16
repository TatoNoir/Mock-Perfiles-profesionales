import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiReview, UsersService } from '../../services/users.service';

@Component({
  selector: 'app-reviews-modal',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './reviews-modal.component.html',
  styleUrls: ['./reviews-modal.component.css']
})
export class ReviewsModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() reviews: ApiReview[] = [];
  @Input() userName = '';
  @Input() userId: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() reviewsUpdated = new EventEmitter<ApiReview[]>();
  @Output() reloadRequested = new EventEmitter<void>();

  editingReviewId: number | null = null;
  editAnswerText = '';
  isSaving = false;
  successMessage = '';

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    // Component initialization
  }

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onEdit(r: ApiReview) {
    this.editingReviewId = r.id;
    this.editAnswerText = r.answer || '';
  }

  onSaveEdit(r: ApiReview) {
    const answer = this.editAnswerText.trim();
    const published = true;
    
    this.isSaving = true;
    this.successMessage = '';
    
    this.usersService.updateReview(r.id, { answer, published }).subscribe({
      next: (response: any) => {
        this.isSaving = false;
        
        // Mostrar mensaje de éxito del backend
        if (response.message) {
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
        
        // Actualizar en memoria con los datos del backend
        const updatedReview = response.data || response;
        const idx = this.reviews.findIndex(x => x.id === r.id);
        if (idx >= 0) {
          this.reviews[idx] = { ...this.reviews[idx], ...updatedReview };
        }
        
        this.cancelEdit();
        this.reviewsUpdated.emit(this.reviews);
        this.reloadRequested.emit();
      },
      error: () => {
        this.isSaving = false;
        alert('No se pudo actualizar la respuesta.');
      }
    });
  }

  onCancelEdit() {
    this.cancelEdit();
  }

  private cancelEdit() {
    this.editingReviewId = null;
    this.editAnswerText = '';
  }

  onDelete(r: ApiReview) {
    const ok = confirm('¿Eliminar esta valoración? Esta acción no se puede deshacer.');
    if (!ok) return;
    
    this.usersService.deleteReview(r.id).subscribe({
      next: (response: any) => {
        // Mostrar mensaje de éxito si viene del backend
        if (response?.message) {
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
        
        this.reviews = this.reviews.filter(x => x.id !== r.id);
        this.reviewsUpdated.emit(this.reviews);
        this.reloadRequested.emit();
      },
      error: () => {
        alert('No se pudo eliminar la valoración.');
      }
    });
  }

  getStars(value: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= value ? '★' : '☆');
    }
    return stars;
  }
}

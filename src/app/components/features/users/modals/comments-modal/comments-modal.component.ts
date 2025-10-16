import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiQuestion, UsersService } from '../../services/users.service';

@Component({
  selector: 'app-comments-modal',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.css']
})
export class CommentsModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() questions: ApiQuestion[] = [];
  @Input() userName = '';
  @Input() userId: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() questionsUpdated = new EventEmitter<ApiQuestion[]>();
  @Output() reloadRequested = new EventEmitter<void>();

  editingQuestionId: number | null = null;
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

  onEdit(q: ApiQuestion) {
    this.editingQuestionId = q.id;
    this.editAnswerText = q.answer || '';
  }

  onSaveEdit(q: ApiQuestion) {
    const answer = this.editAnswerText.trim();
    const published = true;
    
    this.isSaving = true;
    this.successMessage = '';
    
    this.usersService.updateQuestion(q.id, { answer, published }).subscribe({
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
        const updatedQuestion = response.data || response;
        const idx = this.questions.findIndex(x => x.id === q.id);
        if (idx >= 0) {
          this.questions[idx] = { ...this.questions[idx], ...updatedQuestion };
        }
        
        this.cancelEdit();
        this.questionsUpdated.emit(this.questions);
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
    this.editingQuestionId = null;
    this.editAnswerText = '';
  }

  onDelete(q: ApiQuestion) {
    const ok = confirm('¿Eliminar este comentario? Esta acción no se puede deshacer.');
    if (!ok) return;
    
    this.usersService.deleteQuestion(q.id).subscribe({
      next: (response: any) => {
        // Mostrar mensaje de éxito si viene del backend
        if (response?.message) {
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
        
        this.questions = this.questions.filter(x => x.id !== q.id);
        this.questionsUpdated.emit(this.questions);
        this.reloadRequested.emit();
      },
      error: () => {
        alert('No se pudo eliminar el comentario.');
      }
    });
  }
}

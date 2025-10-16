import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiQuestion, UsersService } from '../../services/users.service';

@Component({
  selector: 'app-comments-modal',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.css']
})
export class CommentsModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() questions: ApiQuestion[] = [];
  @Input() userName = '';
  @Output() close = new EventEmitter<void>();

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
    const current = q.answer || '';
    const answer = prompt('Editar respuesta:', current);
    if (answer === null) return;
    const published = true;
    this.usersService.updateQuestion(q.id, { answer, published }).subscribe({
      next: (updated) => {
        // Actualizar en memoria
        const idx = this.questions.findIndex(x => x.id === q.id);
        if (idx >= 0) this.questions[idx] = { ...this.questions[idx], answer: updated.answer, published: updated.published } as ApiQuestion;
      },
      error: () => {
        alert('No se pudo actualizar la respuesta.');
      }
    });
  }

  onDelete(q: ApiQuestion) {
    const ok = confirm('¿Eliminar este comentario? Esta acción no se puede deshacer.');
    if (!ok) return;
    this.usersService.deleteQuestion(q.id).subscribe({
      next: () => {
        this.questions = this.questions.filter(x => x.id !== q.id);
      },
      error: () => {
        alert('No se pudo eliminar el comentario.');
      }
    });
  }
}

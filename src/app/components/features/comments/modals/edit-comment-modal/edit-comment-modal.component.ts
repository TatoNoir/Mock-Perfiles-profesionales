import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommentsService, Comment } from '../../services/comments.service';

@Component({
  selector: 'app-edit-comment-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-comment-modal.component.html',
  styleUrls: ['./edit-comment-modal.component.css']
})
export class EditCommentModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() comment: Comment | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() commentUpdated = new EventEmitter<Comment>();

  editForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private commentsService: CommentsService
  ) {
    this.editForm = this.fb.group({
      answer: [''],
      published: [false]
    });
  }

  ngOnInit(): void {
    if (this.comment) {
      this.populateForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comment'] && this.comment) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (this.comment) {
      this.editForm.patchValue({
        answer: this.comment.answer || '',
        published: this.comment.published || false
      });
    }
  }

  onClose(): void {
    if (!this.loading) {
      this.editForm.reset();
      this.editForm.patchValue({
        answer: '',
        published: false
      });
      this.error = null;
      this.close.emit();
    }
  }

  onSubmit(): void {
    if (this.editForm.valid && !this.loading && this.comment) {
      this.loading = true;
      this.error = null;

      const formValue = this.editForm.value;
      const updateData = {
        answer: formValue.answer,
        published: formValue.published
      };

      this.commentsService.updateComment(this.comment.id!, updateData).subscribe({
        next: (updatedComment) => {
          this.loading = false;
          this.commentUpdated.emit(updatedComment);
          this.onClose();
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al actualizar comentario:', error);
          this.error = 'Error al actualizar el comentario. Por favor, intente nuevamente.';
        }
      });
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommentsService, Comment } from '../../services/comments.service';

@Component({
  selector: 'app-add-comment-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-comment-modal.component.html',
  styleUrls: ['./add-comment-modal.component.css']
})
export class AddCommentModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() commentCreated = new EventEmitter<Comment>();

  addForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private commentsService: CommentsService
  ) {
    this.addForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      message: ['', [Validators.required]],
      user_id: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // No hay inicialización especial necesaria
  }

  onClose(): void {
    if (!this.loading) {
      this.addForm.reset();
      this.error = null;
      this.close.emit();
    }
  }

  onSubmit(): void {
    if (this.addForm.valid && !this.loading) {
      this.loading = true;
      this.error = null;

      const formValue = this.addForm.value;
      const newComment = {
        email: formValue.email,
        name: formValue.name,
        message: formValue.message,
        user_id: parseInt(formValue.user_id)
      };

      this.commentsService.createComment(newComment).subscribe({
        next: (createdComment) => {
          this.loading = false;
          this.commentCreated.emit(createdComment);
          this.onClose();
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al crear comentario:', error);
          this.error = 'Error al crear el comentario. Por favor, intente nuevamente.';
        }
      });
    }
  }
}

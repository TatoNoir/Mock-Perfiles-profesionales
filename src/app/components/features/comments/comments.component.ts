import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommentsService, Comment, CommentFilters } from './services/comments.service';
import { EditCommentModalComponent } from './modals/edit-comment-modal/edit-comment-modal.component';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, EditCommentModalComponent],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  filteredComments: Comment[] = [];
  filters: CommentFilters = {};
  loading = false;
  error: string | null = null;
  
  // Modal state
  showEditModal = false;
  selectedComment: Comment | null = null;

  constructor(private commentsService: CommentsService) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.loading = true;
    this.error = null;

    this.commentsService.getComments().subscribe({
      next: (comments) => {
        this.comments = comments;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los comentarios';
        this.loading = false;
        console.error('Error loading comments:', error);
      }
    });
  }

  applyFilters(): void {
    if (this.hasActiveFilters()) {
      this.loading = true;
      this.commentsService.getCommentsWithFilters(this.filters).subscribe({
        next: (comments) => {
          this.filteredComments = comments;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al filtrar los comentarios';
          this.loading = false;
          console.error('Error filtering comments:', error);
        }
      });
    } else {
      this.filteredComments = [...this.comments];
    }
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.user_id || this.filters.message);
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {};
    this.filteredComments = [...this.comments];
  }

  addComment(): void {
    // TODO: Implementar modal para agregar comentario
    console.log('Agregar comentario');
  }

  editComment(comment: Comment): void {
    this.selectedComment = comment;
    this.showEditModal = true;
  }

  onCloseEditModal(): void {
    this.showEditModal = false;
    this.selectedComment = null;
  }

  onCommentUpdated(updatedComment: Comment): void {
    // Actualizar el comentario en la lista
    const index = this.comments.findIndex(c => c.id === updatedComment.id);
    if (index !== -1) {
      this.comments[index] = updatedComment;
    }
    
    // Actualizar también en la lista filtrada
    const filteredIndex = this.filteredComments.findIndex(c => c.id === updatedComment.id);
    if (filteredIndex !== -1) {
      this.filteredComments[filteredIndex] = updatedComment;
    }
    
    this.showEditModal = false;
    this.selectedComment = null;
  }

  deleteComment(comment: Comment): void {
    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      this.loading = true;
      this.commentsService.deleteComment(comment.id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadComments();
          } else {
            this.error = 'Error al eliminar el comentario';
            this.loading = false;
          }
        },
        error: (error) => {
          this.error = 'Error al eliminar el comentario';
          this.loading = false;
          console.error('Error deleting comment:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByCommentId(index: number, comment: Comment): number {
    return comment.id || index;
  }
}

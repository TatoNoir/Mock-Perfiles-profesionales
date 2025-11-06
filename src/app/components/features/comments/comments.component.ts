import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommentsService, Comment, CommentFilters, CommentsResponse } from './services/comments.service';
import { EditCommentModalComponent } from './modals/edit-comment-modal/edit-comment-modal.component';
import { AddCommentModalComponent } from './modals/add-comment-modal/add-comment-modal.component';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, EditCommentModalComponent, AddCommentModalComponent],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  filters: CommentFilters = {};
  loading = false;
  error: string | null = null;
  
  // Modal state
  showEditModal = false;
  showAddModal = false;
  selectedComment: Comment | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  constructor(private commentsService: CommentsService) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.loading = true;
    this.error = null;

    this.commentsService.getComments(this.currentPage, this.itemsPerPage)
    .subscribe({
      next: (response: CommentsResponse) => {
        this.comments = response.data;
        this.totalItems = response.pagination.total;
        this.totalPages = response.pagination.last_page;
        this.currentPage = response.pagination.current_page;
        this.itemsPerPage = response.pagination.per_page;
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
      this.commentsService.getCommentsWithFilters(this.filters, this.currentPage, this.itemsPerPage).subscribe({
        next: (response: CommentsResponse) => {
          this.comments = response.data;
          this.totalItems = response.pagination.total;
          this.totalPages = response.pagination.last_page;
          this.currentPage = response.pagination.current_page;
          this.itemsPerPage = response.pagination.per_page;
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al filtrar los comentarios';
          this.loading = false;
        }
      });
    } else {
      this.loadComments();
    }
  }

  onFilterChange(): void {
    this.currentPage = 1
    this.applyFilters();
  }

  clearFilters(): void {
    this.currentPage = 1
    this.filters = {};
    this.loadComments()
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.user_id || this.filters.message);
  }

  addComment(): void {
    this.showAddModal = true;
  }

  onCloseAddModal(): void {
    this.showAddModal = false;
  }

  onCommentCreated(newComment: Comment): void {
    // Recargar la lista para mantener la paginación correcta
    this.loadComments();
    this.showAddModal = false;
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
    // Recargar la lista para mantener la paginación correcta
    if (this.hasActiveFilters()) {
      this.applyFilters();
    } else {
      this.loadComments();
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

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.hasActiveFilters()) {
      this.applyFilters();
    } else {
      this.loadComments();
    }
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    if (this.hasActiveFilters()) {
      this.applyFilters();
    } else {
      this.loadComments();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
}

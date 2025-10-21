import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';

export interface Comment {
  id?: number;
  email: string;
  name: string;
  message: string;
  user_id: number;
  answer?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CommentFilters {
  user_id?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  constructor(private apiService: ApiService) { }

  // Listar todos los comentarios
  getComments(): Observable<Comment[]> {
    return this.apiService.get<{ data: Comment[] }>('/api/questions').pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching comments from API:', error);
        // Fallback: retornar array vacío en caso de error
        return of([]);
      })
    );
  }

  // Filtrar comentarios
  getCommentsWithFilters(filters: CommentFilters): Observable<Comment[]> {
    const params: any = {};
    
    if (filters.user_id) {
      params.user_id = filters.user_id;
    }
    
    if (filters.message) {
      params.message = filters.message;
    }

    return this.apiService.get<{ data: Comment[] }>('/api/questions', params).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error filtering comments from API:', error);
        // Fallback: retornar array vacío en caso de error
        return of([]);
      })
    );
  }

  // Crear nuevo comentario
  createComment(comment: Omit<Comment, 'id'>): Observable<Comment> {
    return this.apiService.post<Comment>('/api/questions', comment).pipe(
      catchError(error => {
        console.error('Error creating comment:', error);
        throw error;
      })
    );
  }

  // Editar comentario
  updateComment(id: number, comment: { answer?: string; published?: boolean }): Observable<Comment> {
    return this.apiService.put<Comment>(`/api/questions/${id}`, comment).pipe(
      catchError(error => {
        console.error('Error updating comment:', error);
        throw error;
      })
    );
  }

  // Eliminar comentario
  deleteComment(id: number): Observable<{ success: boolean }> {
    return this.apiService.delete<{ success?: boolean } | null>(`/api/questions/${id}`).pipe(
      map(response => ({ success: response?.success ?? true })),
      catchError(error => {
        console.error('Error deleting comment:', error);
        throw error;
      })
    );
  }
}

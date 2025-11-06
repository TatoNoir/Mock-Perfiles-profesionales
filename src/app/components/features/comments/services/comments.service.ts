import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
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

export interface CommentsResponse {
  data: Comment[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
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
  getComments(page: number = 1, limit: number = 10): Observable<CommentsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    return this.apiService.get<CommentsResponse>(`/api/questions?${params}`).pipe(
      map((response: any) => {
        if (response?.data && response?.pagination) {
          return response as CommentsResponse;
        }
        if (Array.isArray(response)) {
          return {
            data: response as Comment[],
            pagination: {
              current_page: 1,
              per_page: response.length,
              total: response.length,
              last_page: 1
            }
          };
        }
        return {
          data: [],
          pagination: {
            current_page: 1,
            per_page: 10,
            total: 0,
            last_page: 1
          }
        };
      }),
      catchError((error) => {
        console.error('Error fetching comments from API:', error);
        // Fallback: retornar array vacío en caso de error
        return of({
          data: [],
          pagination: {
              current_page: 1,
              per_page: 10,
              total: 0,
              last_page: 1
            }
        }).pipe(delay(100));
      })
    );
  }
  

  // Filtrar comentarios
  getCommentsWithFilters(filters: CommentFilters, page: number = 1, limit: number = 10): Observable<CommentsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      user_id: filters.user_id?.toString() || '',
    });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });

    return this.apiService.get<CommentsResponse>(`/api/questions?${params}`).pipe(
      map((response: any) => {
        if (response?.data && response?.pagination) {
          return response as CommentsResponse;
        }
        if (Array.isArray(response)) {
          return {
            data: response as Comment[],
            pagination: {
              current_page: 1,
              per_page: response.length,
              total: response.length,
              last_page: 1
            }
          };
        }
        return {
          data: [],
          pagination: {
            current_page: 1,
            per_page: 10,
            total: 0,
            last_page: 1
          }
        };
      }),
      catchError((error) => {
        console.error('Error filtering comments from API:', error);
        // Fallback: retornar array vacío en caso de error
        return of({
          data: [],
          pagination: {
            current_page: 1,
            per_page: 10,
            total: 0,
            last_page: 1
          }
        });
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

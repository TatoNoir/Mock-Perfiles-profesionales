import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';

export interface Rate {
  id?: number;
  value: number;
  email: string;
  name: string;
  comment: string;
  user_id: number;
  answer?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RateFilters {
  user_id?: number;
  search?: string;
  published?: number | null; // 1 para publicado, 0 para sin publicar, null para todos
}

export interface RatesResponse {
  data: Rate[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  constructor(private apiService: ApiService) { }

  // Listar todas las valoraciones
  getRates(page?: number, limit?: number): Observable<RatesResponse> {
    const params: any = {};
    if (page) {
      params.page = page;
    }
    if (limit) {
      params.limit = limit;
    }
    return this.apiService.get<RatesResponse>('/api/reviews', params).pipe(
      catchError(error => {
        console.error('Error fetching rates from API:', error);
        throw error;
      })
    );
  }

  // Filtrar valoraciones
  getRatesWithFilters(filters: RateFilters, page?: number, limit?: number): Observable<RatesResponse> {
    const params: any = {};
    
    if (filters.user_id) {
      params.user_id = filters.user_id.toString();
    }
    
    if (filters.search) {
      params.search = filters.search;
    }
    
    if (filters.published !== undefined && filters.published !== null) {
      params.published = filters.published.toString();
    }

    if (page) {
      params.page = page;
    }
    if (limit) {
      params.limit = limit;
    }

    return this.apiService.get<RatesResponse>('/api/reviews', params).pipe(
      catchError(error => {
        console.error('Error filtering rates from API:', error);
        throw error;
      })
    );
  }

  // Crear nueva valoración
  createRate(rate: Omit<Rate, 'id'>): Observable<Rate> {
    return this.apiService.post<Rate>('/api/reviews', rate).pipe(
      catchError(error => {
        console.error('Error creating rate:', error);
        throw error;
      })
    );
  }

  // Editar valoración
  updateRate(id: number, rate: { answer?: string; published?: boolean }): Observable<Rate> {
    return this.apiService.put<Rate>(`/api/reviews/${id}`, rate).pipe(
      catchError(error => {
        console.error('Error updating rate:', error);
        throw error;
      })
    );
  }

  // Eliminar valoración
  deleteRate(id: number): Observable<{ success: boolean }> {
    return this.apiService.delete<{ success?: boolean } | null>(`/api/reviews/${id}`).pipe(
      map(response => ({ success: response?.success ?? true })),
      catchError(error => {
        console.error('Error deleting rate:', error);
        throw error;
      })
    );
  }
}

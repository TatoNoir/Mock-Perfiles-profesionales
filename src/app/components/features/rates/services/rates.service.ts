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
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  constructor(private apiService: ApiService) { }

  // Listar todas las valoraciones
  getRates(): Observable<Rate[]> {
    return this.apiService.get<{ data: Rate[] }>('/api/reviews').pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching rates from API:', error);
        // Fallback: retornar array vacío en caso de error
        return of([]);
      })
    );
  }

  // Filtrar valoraciones
  getRatesWithFilters(filters: RateFilters): Observable<Rate[]> {
    const params: any = {};
    
    if (filters.user_id) {
      params.user_id = filters.user_id;
    }
    
    if (filters.message) {
      params.message = filters.message;
    }

    return this.apiService.get<{ data: Rate[] }>('/api/reviews', params).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error filtering rates from API:', error);
        // Fallback: retornar array vacío en caso de error
        return of([]);
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

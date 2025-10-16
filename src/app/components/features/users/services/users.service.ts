import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';

export interface ApiActivityPivot { 
  user_id: number; 
  activity_id: number; 
}

export interface ApiActivity {
  id: number;
  name: string;
  short_code: string;
  tags: string;
  code: string;
  disabled: number;
  created_at?: string | null;
  updated_at?: string | null;
  pivot?: ApiActivityPivot;
}

export interface ApiUserType {
  id: number;
  name: string;
  description: string;
}

// Lightweight geo types for typeahead endpoints used in Users forms
export interface GeoCountry { id: number; name: string; }
export interface GeoState { id: number; name: string; }
export interface GeoLocality { id: number; name: string; }
export interface GeoZipCode { id: number; code: string; locality_id: number; locality?: GeoLocality }

export interface ApiProvince {
  id: number;
  name: string;
  short_code: string;
  disabled: number;
  country_id: number;
  created_at: string;
  updated_at: string;
}

export interface ApiStateRef {
  id: number;
  country_id: number;
  name: string;
  codigo3166_2?: string;
  deleted_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ApiLocality {
  id: number;
  name: string;
  short_code: string;
  disabled?: number;
  // Compatibilidad antigua (provincias)
  province_id?: number;
  province?: ApiProvince;
  // Estructura actual (estados)
  state_id?: number;
  state?: ApiStateRef;
  created_at: string;
  updated_at: string;
}

export interface ApiUser {
  id: number;
  // Algunos listados aún usan name
  name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  email_verified_at?: string | null;
  // Compatibilidad con vistas antiguas
  phone?: string;
  profile_picture: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  locality_id: number;
  user_type_id: number;
  user_type?: ApiUserType;
  activities: ApiActivity[];
  locality?: ApiLocality;
}

export interface ApiDocumentType {
  id: number;
  name: string;
  description: string;
}

export interface ApiQuestion {
  id: number;
  email: string;
  name: string;
  published: boolean;
  message: string;
  answer: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  username: string;
  first_name: string;
  last_name: string;
  document_type: string;
  document_number: string;
  birth_date: string; // YYYY-MM-DD
  nationality: string;
  country_phone: string;
  area_code: string;
  phone_number: string;
  password: string;
  email: string;
  email_verified_at: string | null;
  profile_picture: string | null;
  description: string;
  address: string;
  street: string;
  street_number: string;
  floor: string;
  apartment: string;
  user_type_id: number;
  locality_id: number;
  activities: number[];
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private apiService: ApiService) {}

  getUsers(params?: {
    name?: string;
    email?: string;
    user_type_id?: string | number;
    province_id?: string | number;
    created_from?: string;
    created_to?: string;
  }): Observable<ApiUser[]> {
    const qs = params ?
      '?' + Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null && `${v}` !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
      : '';
    return this.apiService.get<{ data: ApiUser[] }>(`/api/users${qs}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching users from API:', error);
        // Fallback: retornar array vacío en caso de error
        return of([]);
      })
    );
  }

  getQuestions(userId: number) {
    const qs = `?user_id=${encodeURIComponent(String(userId))}`;
    return this.apiService.get<{ data: ApiQuestion[] }>(`/api/questions${qs}`).pipe(
      map((response) => response?.data ?? []),
      catchError((error) => {
        console.error('Error fetching questions:', error);
        return of([]);
      })
    );
  }

  // --- Geo helpers (copiados desde ZonesService) ---
  getCountries(query: string = '') {
    const qs = query ? `?name=${encodeURIComponent(query)}` : '';
    return this.apiService.get<{ data: GeoCountry[] } | GeoCountry[]>(`/api/countries${qs}`).pipe(
      map((response: any) => {
        if (response?.data && Array.isArray(response.data)) return response.data as GeoCountry[];
        if (Array.isArray(response)) return response as GeoCountry[];
        return [
          { id: 13, name: 'Argentina' },
          { id: 250, name: 'Chile' },
          { id: 251, name: 'Perú' }
        ];
      }),
      catchError(() => of([
        { id: 13, name: 'Argentina' },
        { id: 250, name: 'Chile' }
      ]))
    );
  }

  getProvincesByCountry(countryId: number) {
    return this.apiService.get<{ data: GeoState[] } | GeoState[]>(`/api/states?country_id=${encodeURIComponent(countryId)}`).pipe(
      map((response: any) => {
        if (response?.data && Array.isArray(response.data)) return response.data as GeoState[];
        if (Array.isArray(response)) return response as GeoState[];
        return [
          { id: 1, name: 'Buenos Aires' },
          { id: 2, name: 'Córdoba' }
        ];
      }),
      catchError(() => of([
        { id: 1, name: 'Buenos Aires' },
        { id: 2, name: 'Córdoba' }
      ]))
    );
  }

  getLocalitiesByState(stateId: number) {
    return this.apiService.get<{ data: GeoLocality[] } | GeoLocality[]>(`/api/localities?state_id=${encodeURIComponent(stateId)}`).pipe(
      map((response: any) => {
        if (response?.data && Array.isArray(response.data)) return response.data as GeoLocality[];
        if (Array.isArray(response)) return response as GeoLocality[];
        return [
          { id: 1, name: 'La Plata' },
          { id: 2, name: 'Capital Federal' }
        ];
      }),
      catchError(() => of([
        { id: 1, name: 'La Plata' },
        { id: 2, name: 'Capital Federal' }
      ]))
    );
  }

  getZipCodesByCode(code: string) {
    const qs = code ? `?code=${encodeURIComponent(code)}` : '';
    return this.apiService.get<{ data: GeoZipCode[] } | GeoZipCode[]>(`/api/zip-codes${qs}`).pipe(
      map((response: any) => {
        if (response?.data && Array.isArray(response.data)) return response.data as GeoZipCode[];
        if (Array.isArray(response)) return response as GeoZipCode[];
        return [{ id: 1, code: code || '0000', locality_id: 0, locality: { id: 0, name: 'Desconocida' } }];
      }),
      catchError(() => of([{ id: 1, code: code || '0000', locality_id: 0, locality: { id: 0, name: 'Desconocida' } }]))
    );
  }

  createUser(request: CreateUserRequest): Observable<ApiUser> {
    return this.apiService.post<ApiUser>('/api/users', request).pipe(
      catchError(error => {
        console.error('Error creating user:', error);
        throw error;
      })
    );
  }

  updateUser(id: number, request: CreateUserRequest): Observable<ApiUser> {
    return this.apiService.put<ApiUser>(`/api/users/${id}`, request).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        throw error;
      })
    );
  }

  deleteUser(id: number): Observable<{ success: boolean }> {
    return this.apiService.delete<{ success: boolean }>(`/api/users/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        throw error;
      })
    );
  }

  getUserTypes(): Observable<ApiUserType[]> {
    return this.apiService.get<{ data: ApiUserType[] }>('/api/user-types').pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching user types from API:', error);
        // Fallback: retornar array vacío en caso de error
        return of([]);
      })
    );
  }

  getActivities(): Observable<ApiActivity[]> {
    return this.apiService.get<{ data: ApiActivity[] }>('/api/activities').pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching activities from API:', error);
        // Fallback: retornar array vacío en caso de error
        return of([]);
      })
    );
  }

  getDocumentTypes(): Observable<ApiDocumentType[]> {
    return this.apiService.get<{ data: ApiDocumentType[] }>('/api/document-types').pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching document types from API:', error);
        // Fallback: retornar array vacío en caso de error
        return of([]);
      })
    );
  }
}

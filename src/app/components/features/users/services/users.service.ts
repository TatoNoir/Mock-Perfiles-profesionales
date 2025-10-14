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

export interface ApiProvince {
  id: number;
  name: string;
  short_code: string;
  disabled: number;
  country_id: number;
  created_at: string;
  updated_at: string;
}

export interface ApiLocality {
  id: number;
  name: string;
  short_code: string;
  disabled: number;
  province_id: number;
  created_at: string;
  updated_at: string;
  province?: ApiProvince;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  phone: string;
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

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  description: string;
  user_type_id: number;
  locality_id: number;
  activities: number[];
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private apiService: ApiService) {}

  getUsers(): Observable<ApiUser[]> {
    return this.apiService.get<{ data: ApiUser[] }>('/api/users').pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching users from API:', error);
        // Fallback: retornar array vacío en caso de error
        return of([]);
      })
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

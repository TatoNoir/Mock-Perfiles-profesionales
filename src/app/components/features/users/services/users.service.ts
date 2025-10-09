import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';

export interface ApiActivityPivot { user_id: number; activity_id: number }

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

export interface ApiUserProfile {
  id: number;
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  profile_picture: string | null;
  description: string | null;
  profile_user_id: number | null;
  profile: ApiUserProfile | null;
  activities: ApiActivity[];
  email_verified_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
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
}

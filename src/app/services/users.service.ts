import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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
  private readonly endpoint = 'https://86711653425b.ngrok-free.app/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<ApiUser[]> {
    return this.http.get<{ data: ApiUser[] }>(this.endpoint).pipe(map(r => r.data));
  }
}



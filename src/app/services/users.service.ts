import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface ApiActivity {
  id: number;
  name: string;
  short_code: string;
  tags: string;
  code: string;
  disabled: number;
}

export interface ApiUserProfile { id: number; name: string; }

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
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly endpoint = 'https://e0f8a9c88865.ngrok-free.app/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<ApiUser[]> {
    return this.http.get<{ data: ApiUser[] }>(this.endpoint).pipe(map(r => r.data));
  }
}



import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError, tap } from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

export interface AuthUser {
  id: number;
  name: string; // first_name + last_name
  email: string;
  phone: string; // country_phone + area_code + phone_number
  profile_picture?: string | null;
  description?: string | null;
  locality_id: number;
  // Perfil (user_type del backend)
  profile: {
    id: number;
    name: string;
    created_at?: string | null;
    updated_at?: string | null;
  };
  // Localidad (del backend)
  locality: {
    id: number;
    name: string;
    short_code?: string;
    state_id?: number;
    province_id?: number; // compat
    disabled?: number;
    created_at?: string | null;
    updated_at?: string | null;
  };
  // Dirección adicional
  address?: string | null;
  street?: string | null;
  street_number?: string | null;
  floor?: string | null;
  apartment?: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<AuthUser | null> = new BehaviorSubject<AuthUser | null>(null);
  public currentUser: Observable<AuthUser | null> = this.currentUserSubject.asObservable();
  private readonly USER_KEY = 'current_user';

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService
  ) {
    // Verificar si hay un usuario guardado al inicializar el servicio
    this.loadStoredUser();
  }

  get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.currentUserValue;
    return !!(token && user && this.tokenService.isTokenValid());
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    const token = this.tokenService.getToken();
    
    if (storedUser && token && this.tokenService.isTokenValid()) {
      try {
        const user: AuthUser = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error al cargar usuario guardado:', error);
        this.clearStorage();
      }
    } else if (token && !this.tokenService.isTokenValid()) {
      this.clearStorage();
    }
  }

  private saveUserData(response: LoginResponse): void {
    this.tokenService.setToken(response.access_token);
    const u: any = response.user as any;
    const fullName = [u.first_name, u.last_name].filter(Boolean).join(' ').trim() || u.username || '';
    const phone = [u.country_phone, u.area_code, u.phone_number]
      .filter(Boolean)
      .map((s: string) => (s || '').toString().trim())
      .join(' ')
      .trim();

    const normalized: AuthUser = {
      id: u.id,
      name: fullName,
      email: u.email,
      phone,
      profile_picture: u.profile_picture ?? null,
      description: u.description ?? null,
      locality_id: u.locality_id,
      profile: {
        id: u.user_type?.id ?? 0,
        name: u.user_type?.name ?? 'Usuario',
        created_at: u.user_type?.created_at ?? null,
        updated_at: u.user_type?.updated_at ?? null
      },
      locality: {
        id: u.locality?.id ?? 0,
        name: u.locality?.name ?? '',
        short_code: u.locality?.short_code,
        state_id: u.locality?.state_id,
        created_at: u.locality?.created_at ?? null,
        updated_at: u.locality?.updated_at ?? null
      },
      address: u.address ?? null,
      street: u.street ?? null,
      street_number: u.street_number ?? null,
      floor: u.floor ?? null,
      apartment: u.apartment ?? null
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(normalized));
    this.currentUserSubject.next(normalized);
  }

  private clearStorage(): void {
    this.tokenService.removeToken();
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  signIn(email: string, password: string): Observable<LoginResponse> {
    
    return this.apiService.post<LoginResponse>('/api/login', { email, password }).pipe(
      tap((response: LoginResponse) => {
        this.saveUserData(response);
      }),
      catchError(error => {
        console.error('❌ Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  async signOut() {
    this.clearStorage();
    await new Promise(r => setTimeout(r, 150));
  }
}



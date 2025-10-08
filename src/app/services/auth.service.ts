import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError, tap } from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_picture?: string;
  description?: string;
  locality_id: number;
  profile: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  locality: {
    id: number;
    name: string;
    short_code: string;
    disabled: number;
    province_id: number;
    created_at: string;
    updated_at: string;
  };
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
      console.log('Token expirado, limpiando sesión');
      this.clearStorage();
    }
  }

  private saveUserData(response: LoginResponse): void {
    this.tokenService.setToken(response.access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private clearStorage(): void {
    this.tokenService.removeToken();
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  async signUp(email: string, _password: string) {
    await new Promise(r => setTimeout(r, 300));
    const user: AuthUser = { 
      id: 999, 
      name: 'Usuario Nuevo',
      email,
      phone: '',
      locality_id: 1,
      profile: { id: 1, name: 'Usuario', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      locality: { id: 1, name: 'La Plata', short_code: 'LAP', disabled: 0, province_id: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    };
    this.currentUserSubject.next(user);
    return { user } as any;
  }

  signIn(email: string, password: string): Observable<LoginResponse> {
    console.log('🔐 Intentando login con:', { email, password: '***' });
    
    return this.apiService.post<LoginResponse>('/api/login', { email, password }).pipe(
      tap((response: LoginResponse) => {
        console.log('✅ Login exitoso, guardando datos del usuario');
        this.saveUserData(response);
      }),
      catchError(error => {
        console.error('❌ Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  async signOut() {
    console.log('🚪 Cerrando sesión');
    this.clearStorage();
    await new Promise(r => setTimeout(r, 150));
  }
}



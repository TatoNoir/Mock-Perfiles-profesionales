import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AuthUser {
  id: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<AuthUser | null> = new BehaviorSubject<AuthUser | null>(null);
  public currentUser: Observable<AuthUser | null> = this.currentUserSubject.asObservable();

  get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  async signUp(email: string, _password: string) {
    await new Promise(r => setTimeout(r, 300));
    const user: AuthUser = { id: 'mock-user', email };
    this.currentUserSubject.next(user);
    return { user } as any;
  }

  async signIn(email: string, _password: string) {
    await new Promise(r => setTimeout(r, 300));
    const user: AuthUser = { id: 'mock-user', email };
    this.currentUserSubject.next(user);
    return { user } as any;
  }

  async signOut() {
    await new Promise(r => setTimeout(r, 150));
    this.currentUserSubject.next(null);
  }
}



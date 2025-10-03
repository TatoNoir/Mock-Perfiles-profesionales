import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const envFromImportMeta = (import.meta as any)?.env || {};
    const envFromWindow = (globalThis as any)?.__ENV__ || {};

    const supabaseUrl: string | undefined = 
      environment.supabaseUrl || 
      envFromImportMeta.VITE_SUPABASE_URL || 
      envFromWindow.VITE_SUPABASE_URL;
    const supabaseAnonKey: string | undefined = 
      environment.supabaseAnonKey || 
      envFromImportMeta.VITE_SUPABASE_ANON_KEY || 
      envFromWindow.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[SupabaseService] Variables de entorno faltantes. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en import.meta.env o window.__ENV__.');
    } else {
      this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    }

    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();

    if (this.supabase) {
      this.supabase.auth.onAuthStateChange((event, session) => {
        (() => {
          this.currentUserSubject.next(session?.user ?? null);
        })();
      });
    }

    this.loadUser();
  }

  private async loadUser() {
    if (!this.supabase) {
      this.currentUserSubject.next(null);
      return;
    }
    const { data: { user } } = await this.supabase.auth.getUser();
    this.currentUserSubject.next(user);
  }

  async signUp(email: string, password: string) {
    if (!this.supabase) throw new Error('Supabase no está configurado. Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.');
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    if (!this.supabase) throw new Error('Supabase no está configurado. Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.');
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    if (!this.supabase) return;
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }
}

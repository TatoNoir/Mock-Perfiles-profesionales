import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1 class="brand">Portal de Profesionales</h1>

      <div class="card">
        <h2 class="card-title">Ingresar</h2>

        <form class="form" (ngSubmit)="onSubmit()">
          <label class="label">Email o usuario</label>
          <input
            class="input"
            type="email"
            [(ngModel)]="email"
            name="email"
            placeholder="tu@email.com"
            required
          >

          <label class="label">Contraseña</label>
          <div class="password-row">
            <input
              class="input"
              [type]="showPassword ? 'text' : 'password'"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
            >
            <button type="button" class="icon-button" (click)="togglePassword()" aria-label="Mostrar u ocultar contraseña">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>

          <label class="remember">
            <input type="checkbox" [(ngModel)]="remember" name="remember">
            Recordarme
          </label>

          <div *ngIf="errorMessage" class="error">
            {{ errorMessage }}
          </div>

          <button type="submit" class="primary" [disabled]="loading">
            <span class="spinner" *ngIf="loading"></span>
            Ingresar
          </button>
        </form>

        <button class="link" type="button">Olvidé mi contraseña</button>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f8fbff;
      padding: 3rem 1rem;
      gap: 2rem;
    }

    .brand {
      margin: 0;
      color: #1e3a8a;
      font-size: 2.25rem;
      font-weight: 800;
      letter-spacing: 0.3px;
      text-align: center;
    }

    .card {
      width: 100%;
      max-width: 560px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(2, 18, 54, 0.08);
      padding: 2rem;
    }

    .card-title {
      margin: 0 0 1.25rem 0;
      font-size: 1.25rem;
      color: #0f172a;
      font-weight: 700;
    }

    .form {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .label {
      font-size: 0.9rem;
      color: #334155;
      font-weight: 600;
      margin-top: 0.35rem;
    }

    .input {
      padding: 0.9rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      font-size: 1rem;
      background: #fff;
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
    }

    .password-row {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 0.5rem;
    }

    .icon-button {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      border: 1px solid #e5e7eb;
      background: #fff;
      cursor: pointer;
    }

    .remember {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0 0.25rem;
      color: #334155;
      font-size: 0.95rem;
    }

    .error {
      margin-top: 0.5rem;
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      font-size: 0.9rem;
    }

    .primary {
      margin-top: 0.5rem;
      height: 46px;
      border: none;
      border-radius: 10px;
      background: #2563eb;
      color: white;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .primary:disabled { opacity: 0.7; cursor: not-allowed; }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.5);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .link {
      margin-top: 1rem;
      background: none;
      border: none;
      color: #1d4ed8;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  isLogin = false;
  showPassword = false;
  remember = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      if (this.isLogin) {
        await this.authService.signIn(this.email, this.password);
      } else {
        await this.authService.signUp(this.email, this.password);
      }
      this.router.navigateByUrl('/dashboard');
    } catch (error: any) {
      this.errorMessage = error.message || 'Ocurrió un error. Por favor intenta de nuevo.';
    } finally {
      this.loading = false;
    }
  }

  togglePassword() { this.showPassword = !this.showPassword; }
}

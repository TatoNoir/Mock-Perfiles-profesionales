import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  isLogin = true;
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

    if (this.isLogin) {
      this.authService.signIn(this.email, this.password).subscribe({
        next: (response) => {
          console.log('✅ Login exitoso:', response);
          console.log('📋 Estructura de la respuesta:', JSON.stringify(response, null, 2));
          this.loading = false;
          this.router.navigateByUrl('/dashboard');
        },
        error: (error) => {
          console.error('❌ Error en login:', error);
          console.log('📋 Estructura del error:', JSON.stringify(error, null, 2));
          this.errorMessage = error.error?.error || error.error || 'Error al iniciar sesión';
          this.loading = false;
        }
      });
    } else {
      try {
        console.log('🔐 Intentando registro con:', { email: this.email, password: '***' });
        await this.authService.signUp(this.email, this.password);
        console.log('✅ Registro exitoso');
        this.loading = false;
        // this.router.navigateByUrl('/dashboard'); // Comentado temporalmente
      } catch (error: any) {
        this.errorMessage = error.message || 'Ocurrió un error. Por favor intenta de nuevo.';
        this.loading = false;
      }
    }
  }

  togglePassword() { this.showPassword = !this.showPassword; }
}

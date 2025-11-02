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
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.signIn(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        this.errorMessage = error.error?.error || error.error || 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }

  togglePassword() { 
    this.showPassword = !this.showPassword; 
  }
}

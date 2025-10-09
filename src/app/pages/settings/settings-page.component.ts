import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent {
  current = '';
  newPass = '';
  confirm = '';
  loading = false;
  error: string | null = null;
  success = false;

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.error = null;
    this.success = false;
    if (this.newPass !== this.confirm) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    // Placeholder: Aquí iría el llamado real al backend
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.success = true;
      this.current = this.newPass = this.confirm = '';
    }, 700);
  }
}



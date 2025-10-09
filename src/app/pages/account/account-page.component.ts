import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, AuthUser } from '../../services/auth.service';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent {
  user: AuthUser | null = null;

  constructor(private authService: AuthService) {
    this.user = this.authService.currentUserValue;
  }
}



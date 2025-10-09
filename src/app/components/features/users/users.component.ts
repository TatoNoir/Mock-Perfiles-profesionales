import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UsersService, ApiUser } from './services/users.service';

type User = {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'activo' | 'inactivo';
  lastAccess: string; // ISO or formatted
  createdAt: string;  // ISO or formatted
};

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users: User[] = [
    { name: 'Ana García', email: 'ana@example.com', role: 'admin', status: 'activo', lastAccess: '2025-10-03 11:20', createdAt: '2024-06-12' },
    { name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'editor', status: 'activo', lastAccess: '2025-10-02 18:04', createdAt: '2024-08-01' },
    { name: 'María López', email: 'maria@example.com', role: 'viewer', status: 'inactivo', lastAccess: '2025-08-21 09:11', createdAt: '2023-12-05' },
    { name: 'Juan Martínez', email: 'juan@example.com', role: 'viewer', status: 'activo', lastAccess: '2025-10-01 22:15', createdAt: '2024-02-19' }
  ];

  // Datos remotos disponibles bajo demanda sin afectar la tabla mock
  apiUsers: ApiUser[] = [];
  showApiData = false;
  
  constructor(private usersService: UsersService) {}
  
  loadUsersFromApi() {
    this.usersService.getUsers().subscribe({
      next: (data: ApiUser[]) => { 
        console.log('getUsers() ->', data);
        this.apiUsers = data;
        this.showApiData = true;
      },
      error: (err: any) => { 
        console.error('Error cargando usuarios', err); 
      }
    });
  }

  showMockData() {
    this.showApiData = false;
  }
}
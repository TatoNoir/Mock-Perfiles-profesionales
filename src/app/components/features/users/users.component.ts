import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UsersService, ApiUser } from './services/users.service';
import { AddUserModalComponent } from './modals/add-user-modal/add-user-modal.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, AddUserModalComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: ApiUser[] = [];
  loading = false;
  error: string | null = null;
  showAddModal = false;
  
  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers() {
    this.loading = true;
    this.error = null;
    
    this.usersService.getUsers().subscribe({
      next: (data: ApiUser[]) => { 
        console.log('getUsers() ->', data);
        this.users = data;
        this.loading = false;
      },
      error: (err: any) => { 
        console.error('Error cargando usuarios', err);
        this.loading = false;
        this.error = 'Error al cargar los usuarios';
      }
    });
  }

  onAddUser() {
    this.showAddModal = true;
  }

  onCloseAddModal() {
    this.showAddModal = false;
  }

  onUserCreated(newUser: ApiUser) {
    // Agregar el nuevo usuario a la lista
    this.users.push(newUser);
    console.log('Usuario agregado a la lista:', newUser);
  }
}
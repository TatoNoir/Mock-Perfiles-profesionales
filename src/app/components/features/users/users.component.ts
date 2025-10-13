import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsersService, ApiUser } from './services/users.service';
import { AddUserModalComponent } from './modals/add-user-modal/add-user-modal.component';
import { EditUserModalComponent } from './modals/edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, AddUserModalComponent, EditUserModalComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: ApiUser[] = [];
  loading = false;
  error: string | null = null;
  showAddModal = false;
  showEditModal = false;
  selectedUser: ApiUser | null = null;
  
  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

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

  onEditUser(user: ApiUser) {
    this.selectedUser = user;
    this.showEditModal = true;
  }

  onCloseEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  onUserUpdated(updatedUser: ApiUser) {
    // Actualizar el usuario en la lista
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
    console.log('Usuario actualizado en la lista:', updatedUser);
  }

  onDeleteUser(user: ApiUser) {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.name}"?`)) {
      this.loading = true;
      this.error = null;
      
      this.usersService.deleteUser(user.id).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            // Remover el usuario de la lista local
            this.users = this.users.filter(u => u.id !== user.id);
            console.log('Usuario eliminado:', user.name);
          } else {
            this.error = 'No se pudo eliminar el usuario';
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al eliminar usuario:', error);
          this.error = 'Error al eliminar el usuario';
        }
      });
    }
  }

  onViewProfessionalProfile(user: ApiUser) {
    // Navegar a la página del perfil profesional del usuario
    this.router.navigate(['/usuarios', user.id, 'perfil-profesional']);
  }
}
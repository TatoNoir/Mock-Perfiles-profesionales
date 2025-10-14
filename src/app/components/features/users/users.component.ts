import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService, ApiUser, ApiUserType, ApiActivity } from './services/users.service';
import { AddUserModalComponent } from './modals/add-user-modal/add-user-modal.component';
import { EditUserModalComponent } from './modals/edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, AddUserModalComponent, EditUserModalComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: ApiUser[] = [];
  filteredUsers: ApiUser[] = [];
  loading = false;
  error: string | null = null;
  showAddModal = false;
  showEditModal = false;
  selectedUser: ApiUser | null = null;
  showFilters = false;
  
  filters = {
    email: '',
    name: '',
    role: '',
    status: '',
    createdFrom: '',
    createdTo: '',
    lastAccess: '',
    locality: '',
    province: ''
  };
  
  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadUserTypes();
    this.loadActivities();
  }
  
  loadUsers() {
    this.loading = true;
    this.error = null;
    
    this.usersService.getUsers().subscribe({
      next: (data: ApiUser[]) => { 
        this.users = data;
        this.filteredUsers = data;
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
        this.filteredUsers.push(newUser);
        
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
        
        const filteredIndex = this.filteredUsers.findIndex(u => u.id === updatedUser.id);
        if (filteredIndex !== -1) {
          this.filteredUsers[filteredIndex] = updatedUser;
        }
        
        
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
                this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);
                
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

  loadUserTypes() {
    this.usersService.getUserTypes().subscribe({
      next: (userTypes: ApiUserType[]) => {
        
      },
      error: (err: any) => {
        console.error('Error cargando tipos de usuario:', err);
      }
    });
  }

      loadActivities() {
        this.usersService.getActivities().subscribe({
          next: (activities: ApiActivity[]) => {
            
          },
          error: (err: any) => {
            console.error('Error cargando actividades:', err);
          }
        });
      }

      // Métodos de filtrado
      toggleFilters(): void {
        this.showFilters = !this.showFilters;
      }

      applyFilters(): void {
        this.filteredUsers = this.users.filter(user => {
          // Filtro por email
          if (this.filters.email && !user.email.toLowerCase().includes(this.filters.email.toLowerCase())) {
            return false;
          }

          // Filtro por nombre
          if (this.filters.name && !user.name.toLowerCase().includes(this.filters.name.toLowerCase())) {
            return false;
          }

          // Filtro por rol/tipo de usuario
          if (this.filters.role && user.user_type_id.toString() !== this.filters.role) {
            return false;
          }

          // Filtro por localidad
          if (this.filters.locality && user.locality_id.toString() !== this.filters.locality) {
            return false;
          }

          // Filtro por provincia (a través de localidad)
          if (this.filters.province && user.locality?.province_id.toString() !== this.filters.province) {
            return false;
          }

          // Filtro por rango de fechas de creación
          if (this.filters.createdFrom || this.filters.createdTo) {
            const userCreatedDate = new Date(user.created_at);
            
            if (this.filters.createdFrom) {
              const fromDate = new Date(this.filters.createdFrom);
              if (userCreatedDate < fromDate) {
                return false;
              }
            }
            
            if (this.filters.createdTo) {
              const toDate = new Date(this.filters.createdTo);
              toDate.setHours(23, 59, 59, 999); // Incluir todo el día
              if (userCreatedDate > toDate) {
                return false;
              }
            }
          }

          // Filtro por último acceso (simulado - no tenemos esta data real)
          if (this.filters.lastAccess) {
            // Por ahora solo simulamos, en un caso real tendrías que tener esta información
            const now = new Date();
            const userUpdatedDate = new Date(user.updated_at);
            const daysDiff = Math.floor((now.getTime() - userUpdatedDate.getTime()) / (1000 * 60 * 60 * 24));
            
            switch (this.filters.lastAccess) {
              case 'today':
                if (daysDiff > 0) return false;
                break;
              case 'week':
                if (daysDiff > 7) return false;
                break;
              case 'month':
                if (daysDiff > 30) return false;
                break;
              case '3months':
                if (daysDiff > 90) return false;
                break;
              case '6months':
                if (daysDiff > 180) return false;
                break;
              case 'year':
                if (daysDiff > 365) return false;
                break;
              case 'never':
                // Simulamos que nunca accedió si no se actualizó en los últimos 30 días
                if (daysDiff < 30) return false;
                break;
            }
          }

          return true;
        });

        
      }

      clearFilters(): void {
        this.filters = {
          email: '',
          name: '',
          role: '',
          status: '',
          createdFrom: '',
          createdTo: '',
          lastAccess: '',
          locality: '',
          province: ''
        };
        this.filteredUsers = [...this.users];
        
      }
    }
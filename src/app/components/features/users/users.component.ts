import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService, ApiUser, ApiUserType, ApiDocumentType } from './services/users.service';
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
  documentTypes: ApiDocumentType[] = [];
  userTypes: ApiUserType[] = [];
  loading = false;
  error: string | null = null;
  showAddModal = false;
  showEditModal = false;
  selectedUser: ApiUser | null = null;
  showFilters = false;
  // Provincia typeahead state
  provinceText = '';
  showProvinceDropdown = false;
  provinceSuggestions: { id: number; name: string }[] = [];
  selectedProvinceId: number | null = null;
  // Localidad typeahead state
  localityText = '';
  showLocalityDropdown = false;
  localitySuggestions: { id: number; name: string }[] = [];
  selectedLocalityId: number | null = null;
  
  filters = {
    email: '',
    name: '',
    role: '',
    status: '',
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
    this.loadDocumentTypes();
  }
  
  loadUsers() {
    this.loading = true;
    this.error = null;
    
    const params: any = {
      name: this.filters.name,
      email: this.filters.email,
      user_type_id: this.filters.role,
      province_id: this.selectedProvinceId ?? undefined,
      locality_id: this.selectedLocalityId ?? undefined,
      // created_from: this.filters.createdFrom, // removido del UI actual
      // created_to: this.filters.createdTo
    };
    this.usersService.getUsers(params).subscribe({
      next: (data: ApiUser[]) => { 
        this.users = data;
        this.filteredUsers = data;
        // precalcular sugerencias de provincias desde los datos cargados
        this.recomputeProvinceSuggestions('');
        // precalcular sugerencias de localidades
        this.recomputeLocalitySuggestions('');
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
        // Refrescar desde el backend para asegurar datos y relaciones
        this.loadUsers();
        this.showAddModal = false;
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
        // Refrescar lista para reflejar cambios
        this.loadUsers();
        this.showEditModal = false;
        this.selectedUser = null;
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
        this.userTypes = userTypes;
      },
      error: (err: any) => {
        console.error('Error cargando tipos de usuario:', err);
      }
    });
  }

  loadDocumentTypes() {
        this.usersService.getDocumentTypes().subscribe({
          next: (documentTypes: ApiDocumentType[]) => {
            this.documentTypes = documentTypes;
          },
          error: (err: any) => {
            console.error('Error cargando tipos de documento:', err);
          }
        });
      }

      // Métodos de filtrado
      toggleFilters(): void {
        this.showFilters = !this.showFilters;
      }

      applyFilters(): void {
        // Ahora filtramos desde el backend: recargar con parámetros
        this.loadUsers();

        
      }

      clearFilters(): void {
        this.filters = {
          email: '',
          name: '',
          role: '',
      status: '',
          locality: '',
          province: ''
        };
    this.filteredUsers = [...this.users];
    this.provinceText = '';
    this.selectedProvinceId = null;
    this.showProvinceDropdown = false;
    this.recomputeProvinceSuggestions('');
    this.localityText = '';
    this.selectedLocalityId = null;
    this.showLocalityDropdown = false;
    this.recomputeLocalitySuggestions('');
    // reconsultar backend sin filtros
    // Forzar consulta sin parámetros: vaciar seleccionados antes de llamar
    this.usersService.getUsers({}).subscribe({
      next: (data: ApiUser[]) => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: () => {}
    });
        
      }

  // Provincia typeahead helpers
  onProvinceFocus(): void {
    this.showProvinceDropdown = this.provinceSuggestions.length > 0;
  }

  onProvinceInput(value: string): void {
    this.provinceText = value;
    if (!value) this.selectedProvinceId = null;
    this.recomputeProvinceSuggestions(value);
    this.showProvinceDropdown = true;
  }

  onSelectProvince(value: { id: number; name: string }): void {
    this.provinceText = value.name;
    this.selectedProvinceId = value.id;
    this.showProvinceDropdown = false;
  }

  private recomputeProvinceSuggestions(query: string): void {
    const map = new Map<number, string>();
    for (const u of this.users) {
      const id = (u.locality?.state?.id as number) || 0;
      const name = (u.locality?.state?.name || '').trim();
      if (id && name && !map.has(id)) map.set(id, name);
    }
    const all = Array.from(map.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
    const q = (query || '').toLowerCase();
    this.provinceSuggestions = q ? all.filter(n => n.name.toLowerCase().includes(q)) : all.slice(0, 10);
  }

  // Localidad typeahead helpers
  onLocalityFocus(): void {
    this.showLocalityDropdown = this.localitySuggestions.length > 0;
  }

  onLocalityInput(value: string): void {
    this.localityText = value;
    if (!value) this.selectedLocalityId = null;
    this.recomputeLocalitySuggestions(value);
    this.showLocalityDropdown = true;
  }

  onSelectLocality(value: { id: number; name: string }): void {
    this.localityText = value.name;
    this.selectedLocalityId = value.id;
    this.showLocalityDropdown = false;
  }

  private recomputeLocalitySuggestions(query: string): void {
    const map = new Map<number, string>();
    for (const u of this.users) {
      const id = (u.locality?.id as number) || 0;
      const name = (u.locality?.name || '').trim();
      if (id && name && !map.has(id)) map.set(id, name);
    }
    const all = Array.from(map.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
    const q = (query || '').toLowerCase();
    this.localitySuggestions = q ? all.filter(n => n.name.toLowerCase().includes(q)) : all.slice(0, 10);
  }
    }
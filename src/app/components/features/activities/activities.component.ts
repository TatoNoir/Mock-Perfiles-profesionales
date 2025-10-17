import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';
import { ActivitiesService, Activity, ActivityFilters, ActivityStatus } from './services/activities.service';
import { AddActivityModalComponent } from './modals/add-activity-modal/add-activity-modal.component';
import { EditActivityModalComponent } from './modals/edit-activity-modal/edit-activity-modal.component';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule, AddActivityModalComponent, EditActivityModalComponent],
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Data
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  
  // State
  loading = false;
  error: string | null = null;
  showAddModal = false;
  showEditModal = false;
  selectedActivity: Activity | null = null;
  
  // Filters
  filters: ActivityFilters = {
    activity: '',
    tags: '',
    status: undefined
  };

  constructor(private activitiesService: ActivitiesService) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los datos iniciales
   */
  private loadInitialData(): void {
    this.loading = true;
    this.error = null;

    // Cargar actividades
    this.activitiesService.getActivities()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (activities) => {
          this.activities = activities;
          this.filteredActivities = [...activities];
        },
        error: (error) => {
          console.error('Error al cargar actividades:', error);
          this.error = 'Error al cargar las actividades';
        }
      });
  }

  /**
   * Aplica los filtros localmente a las actividades
   */
  applyFilters(): void {
    this.filteredActivities = this.activities.filter(activity => {
      // Filtro por actividad
      if (this.filters.activity && !activity.activity.toLowerCase().includes(this.filters.activity.toLowerCase())) {
        return false;
      }

      // Filtro por tags
      if (this.filters.tags && (!activity.tags || !activity.tags.toLowerCase().includes(this.filters.tags.toLowerCase()))) {
        return false;
      }

      // Filtro por estado
      if (this.filters.status && activity.status !== this.filters.status) {
        return false;
      }

      return true;
    });
  }

  /**
   * Limpia los filtros y recarga todas las actividades
   */
  onClearFilters(): void {
    this.filters = {
      activity: '',
      tags: '',
      status: undefined
    };
    this.applyFilters();
  }

  /**
   * Abre el modal/formulario para agregar una nueva actividad
   */
  onAdd(): void {
    this.showAddModal = true;
  }

  /**
   * Cierra el modal de agregar actividad
   */
  onCloseAddModal(): void {
    this.showAddModal = false;
  }

  /**
   * Maneja la creación exitosa de una actividad
   */
  onActivityCreated(): void {
    // Recargar la lista de actividades
    this.loadInitialData();
  }

  /**
   * Cierra el modal de editar actividad
   */
  onCloseEditModal(): void {
    this.showEditModal = false;
    this.selectedActivity = null;
  }

  /**
   * Maneja la actualización exitosa de una actividad
   */
  onActivityUpdated(updatedActivity: Activity): void {
    // Refrescar desde el servicio para mantener consistencia con backend/mock
    this.loading = true;
    this.activitiesService.getActivities()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (activities) => {
          this.activities = activities;
          this.applyFilters();
          this.showEditModal = false;
          this.selectedActivity = null;
        },
        error: (error) => {
          console.error('Error recargando actividades:', error);
          // Si falla la recarga, al menos actualizamos localmente
          const index = this.activities.findIndex(a => a.id === updatedActivity.id);
          if (index !== -1) {
            this.activities[index] = updatedActivity;
          }
          this.applyFilters();
          this.showEditModal = false;
          this.selectedActivity = null;
        }
      });
  }

  /**
   * Abre el modal/formulario para editar una actividad
   */
  onEdit(activity: Activity): void {
    this.selectedActivity = activity;
    this.showEditModal = true;
  }

  /**
   * Cambia el estado de una actividad (Activa/Inactiva)
   */
  onToggleStatus(activity: Activity): void {
    this.activitiesService.toggleActivityStatus(activity.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedActivity) => {
          if (updatedActivity) {
            // Actualizar la actividad en la lista local
            const index = this.activities.findIndex(a => a.id === activity.id);
            if (index !== -1) {
              this.activities[index] = updatedActivity;
            }
            // Aplicar filtros para actualizar la vista
            this.applyFilters();
          }
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          this.error = 'Error al cambiar el estado de la actividad';
        }
      });
  }

  /**
   * Elimina una actividad
   */
  onDelete(activity: Activity): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la actividad "${activity.activity}"?`)) {
      this.loading = true;
      this.error = null;
      
      this.activitiesService.deleteActivityFromApi(activity.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (success) => {
            this.loading = false;
            if (success) {
              // Remover la actividad de la lista local
              this.activities = this.activities.filter(a => a.id !== activity.id);
              // Aplicar filtros para actualizar la vista
              this.applyFilters();
            } else {
              this.error = 'No se pudo eliminar la actividad';
            }
          },
          error: (error) => {
            this.loading = false;
            console.error('Error al eliminar actividad:', error);
            this.error = 'Error al eliminar la actividad';
          }
        });
    }
  }

  /**
   * TrackBy function para optimizar el rendimiento de *ngFor
   */
  trackByActivityId(index: number, activity: Activity): number {
    return activity.id;
  }
}

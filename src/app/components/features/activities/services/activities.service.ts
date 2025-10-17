import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';

export type ActivityStatus = 'Activa' | 'Inactiva';

export interface Activity {
  id: number;
  category: string;
  activity: string;
  description: string;
  status: ActivityStatus;
  createdAt: Date;
  updatedAt: Date;
  tags?: string;
  short_code?: string;
  code?: string;
}

export interface CreateActivityRequest {
  name: string;
  short_code: string;
  tags: string;
  code: string;
  disabled: number;
}

export interface ActivityFilters {
  activity: string;
  tags: string;
  status?: ActivityStatus;
}

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  constructor(private apiService: ApiService) {}
  private activities: Activity[] = [
    {
      id: 1,
      category: 'Instalaciones',
      activity: 'Electricista',
      description: 'Instalación y reparación eléctrica',
      status: 'Activa',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      tags: 'construcción, cables, energía'
    },
    {
      id: 2,
      category: 'Mantenimiento',
      activity: 'Plomero',
      description: 'Reparaciones de caños y grifería',
      status: 'Activa',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      tags: 'plomería, caños, grifería'
    },
    {
      id: 3,
      category: 'Jardinería',
      activity: 'Jardinero',
      description: 'Corte de césped y mantenimiento',
      status: 'Inactiva',
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17'),
      tags: 'jardín, césped, plantas'
    },
    {
      id: 4,
      category: 'Instalaciones',
      activity: 'Gasista',
      description: 'Instalación y reparación de gas',
      status: 'Activa',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
      tags: 'gas, instalaciones, seguridad'
    },
    {
      id: 5,
      category: 'Mantenimiento',
      activity: 'Pintor',
      description: 'Pintura de interiores y exteriores',
      status: 'Activa',
      createdAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-01-19'),
      tags: 'pintura, decoración, mantenimiento'
    }
  ];

  private categories: string[] = ['Instalaciones', 'Mantenimiento', 'Jardinería', 'Construcción', 'Limpieza'];

  /**
   * Obtiene todas las actividades desde la API
   */
  getActivities(): Observable<Activity[]> {
    return this.apiService.get<Activity[]>('/api/activities').pipe(
      map((response: any) => {
        const mapItem = (item: any): Activity => ({
          id: item.id,
          category: '',
          activity: item.name,
          description: item.name,
          status: item.disabled === 0 ? 'Activa' : 'Inactiva',
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
          updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
          tags: item.tags,
          short_code: item.short_code,
          code: item.code
        });

        if (response?.data && Array.isArray(response.data)) {
          return response.data.map(mapItem);
        }
        if (Array.isArray(response)) {
          return response.map(mapItem);
        }
        console.warn('Formato de respuesta inesperado, usando datos mock');
        return [...this.activities];
      }),
      catchError((error) => {
        console.error('Error al obtener actividades desde la API:', error);
        return of([...this.activities]).pipe(delay(300));
      })
    );
  }

  /**
   * Obtiene las categorías disponibles desde la API
   */
  // Temporalmente deshabilitado: categorías
  // getCategories(): Observable<string[]> { ... }

  /**
   * Obtiene una actividad por ID
   */
  getActivityById(id: number): Observable<Activity | null> {
    const activity = this.activities.find(a => a.id === id);
    return of(activity || null).pipe(delay(100));
  }

  /**
   * Crea una nueva actividad
   */
  createActivity(request: CreateActivityRequest): Observable<Activity> {
    return this.apiService.post<Activity>('/api/activities', request).pipe(
      map((response: any) => {
        // Si la API devuelve un wrapper con data, extraemos la actividad
        if (response.data) {
          return this.mapApiActivityToInternal(response.data);
        }
        // Si devuelve directamente el objeto
        if (response.id) {
          return this.mapApiActivityToInternal(response);
        }
        // Fallback a creación local si hay error
        console.warn('Formato de respuesta inesperado para crear actividad, usando creación local');
        return this.createActivityLocally(request);
      }),
      catchError((error) => {
        console.error('Error al crear actividad desde la API:', error);
        return of(this.createActivityLocally(request)).pipe(delay(300));
      })
    );
  }

  /**
   * Elimina una actividad por ID desde la API
   */
  deleteActivityFromApi(id: number): Observable<boolean> {
    return this.apiService.delete<{ success: boolean }>(`/api/activities/${id}`).pipe(
      map(response => response.success || true),
      catchError(error => {
        console.error('Error deleting activity:', error);
        // Fallback: eliminar localmente
        return of(this.deleteActivityLocally(id));
      })
    );
  }

  /**
   * Actualiza una actividad por ID desde la API
   */
  updateActivityFromApi(id: number, request: CreateActivityRequest): Observable<Activity> {
    return this.apiService.put<Activity>(`/api/activities/${id}`, request).pipe(
      map(response => this.mapApiActivityToInternal(response)),
      catchError(error => {
        console.error('Error updating activity:', error);
        // Fallback: actualizar localmente
        return of(this.updateActivityLocally(id, request));
      })
    );
  }

  private mapApiActivityToInternal(apiActivity: any): Activity {
    return {
      id: apiActivity.id,
      category: '',
      activity: apiActivity.name,
      description: apiActivity.name,
      status: apiActivity.disabled === 0 ? 'Activa' : 'Inactiva',
      createdAt: apiActivity.created_at ? new Date(apiActivity.created_at) : new Date(),
      updatedAt: apiActivity.updated_at ? new Date(apiActivity.updated_at) : new Date(),
      tags: apiActivity.tags,
      short_code: apiActivity.short_code,
      code: apiActivity.code
    };
  }

  private createActivityLocally(request: CreateActivityRequest): Activity {
    const newActivity: Activity = {
      id: Math.max(...this.activities.map(a => a.id)) + 1,
      category: '',
      activity: request.name,
      description: request.name,
      status: request.disabled === 0 ? 'Activa' : 'Inactiva',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: request.tags
    };

    this.activities.push(newActivity);
    return newActivity;
  }

  private deleteActivityLocally(id: number): boolean {
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) {
      return false;
    }
    this.activities.splice(index, 1);
    return true;
  }

  private updateActivityLocally(id: number, request: CreateActivityRequest): Activity {
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Activity not found');
    }

    const updatedActivity: Activity = {
      ...this.activities[index],
      activity: request.name,
      description: request.name,
      status: request.disabled === 0 ? 'Activa' : 'Inactiva',
      updatedAt: new Date(),
      tags: request.tags
    };

    this.activities[index] = updatedActivity;
    return updatedActivity;
  }

  /**
   * Actualiza una actividad existente
   */
  updateActivity(id: number, updates: Partial<Activity>): Observable<Activity | null> {
    const index = this.activities.findIndex(a => a.id === id);
    
    if (index === -1) {
      return of(null);
    }

    this.activities[index] = {
      ...this.activities[index],
      ...updates,
      updatedAt: new Date()
    };

    return of(this.activities[index]).pipe(delay(300));
  }


  /**
   * Cambia el estado de una actividad
   */
  toggleActivityStatus(id: number): Observable<Activity | null> {
    const activity = this.activities.find(a => a.id === id);
    
    if (!activity) {
      return of(null);
    }

    activity.status = activity.status === 'Activa' ? 'Inactiva' : 'Activa';
    activity.updatedAt = new Date();

    return of(activity).pipe(delay(200));
  }
}

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
}

export interface ActivityFilters {
  category: string;
  activity: string;
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
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      category: 'Mantenimiento',
      activity: 'Plomero',
      description: 'Reparaciones de caños y grifería',
      status: 'Activa',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: 3,
      category: 'Jardinería',
      activity: 'Jardinero',
      description: 'Corte de césped y mantenimiento',
      status: 'Inactiva',
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17')
    },
    {
      id: 4,
      category: 'Instalaciones',
      activity: 'Gasista',
      description: 'Instalación y reparación de gas',
      status: 'Activa',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: 5,
      category: 'Mantenimiento',
      activity: 'Pintor',
      description: 'Pintura de interiores y exteriores',
      status: 'Activa',
      createdAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-01-19')
    }
  ];

  private categories: string[] = ['Instalaciones', 'Mantenimiento', 'Jardinería', 'Construcción', 'Limpieza'];

  /**
   * Obtiene todas las actividades desde la API
   */
  getActivities(): Observable<Activity[]> {
    return this.apiService.get<Activity[]>('/api/activities').pipe(
      map((response: any) => {
        // Si la API devuelve un wrapper con data, extraemos las actividades
        if (response.data) {
          return response.data;
        }
        // Si devuelve directamente el array
        if (Array.isArray(response)) {
          return response;
        }
        // Fallback a datos mock si hay error
        console.warn('Formato de respuesta inesperado, usando datos mock');
        return [...this.activities];
      }),
      catchError((error) => {
        console.error('Error al obtener actividades desde la API:', error);
        console.log('Usando datos mock como fallback');
        return of([...this.activities]).pipe(delay(300));
      })
    );
  }

  /**
   * Obtiene las categorías disponibles desde la API
   */
  getCategories(): Observable<string[]> {
    return this.apiService.get<string[]>('/api/activities/categories').pipe(
      map((response: any) => {
        // Si la API devuelve un wrapper con data, extraemos las categorías
        if (response.data) {
          return response.data;
        }
        // Si devuelve directamente el array
        if (Array.isArray(response)) {
          return response;
        }
        // Fallback a datos mock si hay error
        console.warn('Formato de respuesta inesperado para categorías, usando datos mock');
        return [...this.categories];
      }),
      catchError((error) => {
        console.error('Error al obtener categorías desde la API:', error);
        console.log('Usando categorías mock como fallback');
        return of([...this.categories]).pipe(delay(100));
      })
    );
  }

  /**
   * Filtra las actividades según los criterios usando la API
   */
  filterActivities(filters: ActivityFilters): Observable<Activity[]> {
    // Preparar parámetros de consulta
    const params: any = {};
    
    if (filters.category) {
      params.category = filters.category;
    }
    if (filters.activity) {
      params.activity = filters.activity;
    }
    if (filters.status) {
      params.status = filters.status;
    }

    return this.apiService.get<Activity[]>('/api/activities', params).pipe(
      map((response: any) => {
        // Si la API devuelve un wrapper con data, extraemos las actividades
        if (response.data) {
          return response.data;
        }
        // Si devuelve directamente el array
        if (Array.isArray(response)) {
          return response;
        }
        // Fallback a filtrado local si hay error
        console.warn('Formato de respuesta inesperado para filtros, usando filtrado local');
        return this.filterActivitiesLocally(filters);
      }),
      catchError((error) => {
        console.error('Error al filtrar actividades desde la API:', error);
        console.log('Usando filtrado local como fallback');
        return of(this.filterActivitiesLocally(filters)).pipe(delay(200));
      })
    );
  }

  /**
   * Filtrado local como fallback
   */
  private filterActivitiesLocally(filters: ActivityFilters): Activity[] {
    let filtered = [...this.activities];

    if (filters.category) {
      filtered = filtered.filter(activity => 
        activity.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.activity) {
      filtered = filtered.filter(activity => 
        activity.activity.toLowerCase().includes(filters.activity.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(activity => activity.status === filters.status);
    }

    return filtered;
  }

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
  createActivity(activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Observable<Activity> {
    const newActivity: Activity = {
      ...activity,
      id: Math.max(...this.activities.map(a => a.id)) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.activities.push(newActivity);
    return of(newActivity).pipe(delay(300));
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
   * Elimina una actividad
   */
  deleteActivity(id: number): Observable<boolean> {
    const index = this.activities.findIndex(a => a.id === id);
    
    if (index === -1) {
      return of(false);
    }

    this.activities.splice(index, 1);
    return of(true).pipe(delay(200));
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

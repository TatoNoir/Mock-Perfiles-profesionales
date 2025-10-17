import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';

// Interfaces para los datos del dashboard
export interface DashboardStats {
  totalProfessionals: number;
  newRegistrationsThisWeek: number;
  contactsSent: number;
  mostSearchedSpecialty: string;
}

export interface RecentUser {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'inactive';
  registrationDate: string;
  province: string;
  locality: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentUsers: RecentUser[];
}

// Interfaces copiadas de otros servicios
export interface ApiUser {
  id: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  email_verified_at?: string | null;
  phone?: string;
  profile_picture: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  locality_id: number;
  user_type_id: number;
  user_type?: {
    id: number;
    name: string;
    description: string;
    disabled: number;
    created_at: string | null;
    updated_at: string | null;
  };
  activities: any[];
  locality?: {
    id: number;
    name: string;
    short_code: string;
    state_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    state?: {
      id: number;
      country_id: number;
      name: string;
      codigo3166_2: string;
      deleted_at: string | null;
      created_at: string | null;
      updated_at: string | null;
    };
  };
  reviews_count?: number;
  reviews_avg_value?: string;
}

export interface UsersResponse {
  data: ApiUser[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface ApiQuestion {
  id: number;
  question: string;
  answer: string | null;
  published: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ApiReview {
  id: number;
  value: number;
  comment: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  category: string;
  activity: string;
  description: string;
  status: 'Activa' | 'Inactiva';
  createdAt: Date;
  updatedAt: Date;
  tags?: string;
  short_code?: string;
  code?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private apiService: ApiService) {}

  /**
   * Obtiene los datos del dashboard desde el API
   */
  getDashboardData(): Observable<DashboardData> {
    // Combinamos datos reales de múltiples endpoints
    return this.getRealDashboardData();
  }

  /**
   * Obtiene estadísticas del dashboard
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.getMockDashboardData().pipe(
      map(data => data.stats)
    );
  }

  /**
   * Obtiene los usuarios recientes
   */
  getRecentUsers(): Observable<RecentUser[]> {
    return this.getMockDashboardData().pipe(
      map(data => data.recentUsers)
    );
  }

  /**
   * Datos mock para el dashboard (temporal)
   * TODO: Reemplazar con llamadas reales al API cuando esté disponible
   */
  private getMockDashboardData(): Observable<DashboardData> {
    const mockData: DashboardData = {
      stats: {
        totalProfessionals: 120,
        newRegistrationsThisWeek: 8,
        contactsSent: 32, // Total de comentarios
        mostSearchedSpecialty: '45' // Total de valoraciones
      },
      recentUsers: [
        {
          id: 1,
          name: 'Carlos García',
          role: 'Médico',
          status: 'active',
          registrationDate: '15/03/2024',
          province: 'Buenos Aires',
          locality: 'La Plata'
        },
        {
          id: 2,
          name: 'Carlos Rodríguez',
          role: 'Abogado',
          status: 'inactive',
          registrationDate: '08/01/2024',
          province: 'Córdoba',
          locality: 'Córdoba Capital'
        },
        {
          id: 3,
          name: 'María López',
          role: 'Ingeniera',
          status: 'active',
          registrationDate: '17/11/2023',
          province: 'Santa Fe',
          locality: 'Rosario'
        },
        {
          id: 4,
          name: 'Juan Martínez',
          role: 'Arquitecto',
          status: 'active',
          registrationDate: '29/09/2023',
          province: 'Buenos Aires',
          locality: 'Mar del Plata'
        }
      ]
    };

    // Simulamos un delay de red
    return of(mockData).pipe(
      delay(500),
      catchError(error => {
        console.error('Error fetching dashboard data:', error);
        // Retornamos datos por defecto en caso de error
        return of(mockData);
      })
    );
  }

  /**
   * Método para obtener datos reales del API combinando múltiples endpoints
   */
  private getRealDashboardData(): Observable<DashboardData> {
    // Combinamos datos de múltiples endpoints
    return this.combineDashboardData().pipe(
      catchError(error => {
        console.error('Error fetching dashboard data from API:', error);
        // Fallback a datos mock en caso de error
        return this.getMockDashboardData();
      })
    );
  }

  /**
   * Combina datos de múltiples endpoints para el dashboard
   */
  private combineDashboardData(): Observable<DashboardData> {
    return new Observable(observer => {
      // Hacemos llamadas paralelas a todos los endpoints
      const users$ = this.getUsersList();
      const activities$ = this.getActivitiesList();
      const questions$ = this.getQuestionsList();
      const reviews$ = this.getReviewsList();

      // Combinamos todos los observables
      users$.subscribe({
        next: (usersResponse) => {
          activities$.subscribe({
            next: (activities) => {
              questions$.subscribe({
                next: (questions) => {
                  reviews$.subscribe({
                    next: (reviews) => {
                      // Calculamos las estadísticas
                      const stats: DashboardStats = {
                        totalProfessionals: usersResponse.pagination.total,
                        newRegistrationsThisWeek: this.calculateNewRegistrations(usersResponse.data),
                        contactsSent: questions.length, // Total de comentarios/preguntas
                        mostSearchedSpecialty: reviews.length.toString() // Total de valoraciones
                      };

                      // Convertimos usuarios a formato RecentUser
                      const recentUsers: RecentUser[] = usersResponse.data
                        .slice(0, 4) // Solo los primeros 4
                        .map(user => ({
                          id: user.id,
                          name: user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}` 
                            : user.name || 'Sin nombre',
                          role: user.user_type?.name || 'Sin rol',
                          status: 'active' as const,
                          registrationDate: this.formatDate(user.created_at),
                          province: user.locality?.state?.name || 'Sin provincia',
                          locality: user.locality?.name || 'Sin localidad'
                        }));

                      const dashboardData: DashboardData = {
                        stats,
                        recentUsers
                      };

                      observer.next(dashboardData);
                      observer.complete();
                    },
                    error: (error) => {
                      console.error('Error fetching reviews:', error);
                      observer.error(error);
                    }
                  });
                },
                error: (error) => {
                  console.error('Error fetching questions:', error);
                  observer.error(error);
                }
              });
            },
            error: (error) => {
              console.error('Error fetching activities:', error);
              observer.error(error);
            }
          });
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          observer.error(error);
        }
      });
    });
  }

  /**
   * Calcula registros nuevos de esta semana (simulado)
   */
  private calculateNewRegistrations(users: ApiUser[]): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return users.filter(user => {
      const userDate = new Date(user.created_at);
      return userDate >= oneWeekAgo;
    }).length;
  }

  /**
   * Formatea fecha para mostrar
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // ===== MÉTODOS COPIADOS DE OTROS SERVICIOS =====

  /**
   * Obtiene listado de usuarios sin filtros
   * Copiado de UsersService
   */
  getUsersList(): Observable<UsersResponse> {
    return this.apiService.get<UsersResponse>('/api/users').pipe(
      map(response => response),
      catchError(error => {
        console.error('Error fetching users from API:', error);
        // Fallback: retornar respuesta vacía en caso de error
        return of({
          data: [],
          pagination: {
            current_page: 1,
            per_page: 10,
            total: 0,
            last_page: 1
          }
        });
      })
    );
  }

  /**
   * Obtiene listado de actividades sin filtros
   * Copiado de ActivitiesService
   */
  getActivitiesList(): Observable<Activity[]> {
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
          tags: item.tags || '',
          short_code: item.short_code || '',
          code: item.code || ''
        });
        return Array.isArray(response) ? response.map(mapItem) : [];
      }),
      catchError(error => {
        console.error('Error fetching activities from API:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene listado de comentarios/preguntas sin filtros
   * Copiado de UsersService
   */
  getQuestionsList(): Observable<ApiQuestion[]> {
    return this.apiService.get<{ data: ApiQuestion[] }>('/api/questions').pipe(
      map((response) => response?.data ?? []),
      catchError((error) => {
        console.error('Error fetching questions:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene listado de valoraciones sin filtros
   * Copiado de UsersService
   */
  getReviewsList(): Observable<ApiReview[]> {
    return this.apiService.get<{ data: ApiReview[] }>('/api/reviews').pipe(
      map((response) => response?.data ?? []),
      catchError((error) => {
        console.error('Error fetching reviews:', error);
        return of([]);
      })
    );
  }
}

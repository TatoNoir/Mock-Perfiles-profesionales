import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';

export type ZoneType = 'Urbana' | 'Suburbana' | 'Rural';

export interface ApiCountry {
  id: number;
  name: string;
}

export interface ApiZone {
  id: number;
  country: string;
  province: string;
  city: string;
  postal_code: string;
  neighborhood: string;
  type: ZoneType;
  flag?: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ZoneFilters {
  country: string;
  province: string;
  city: string;
  postal_code: string;
  type?: ZoneType;
}

export interface CreateZoneRequest {
  country: string;
  province: string;
  city: string;
  postal_code: string;
  neighborhood: string;
  type: ZoneType;
  flag?: string;
}

export interface UpdateZoneRequest extends CreateZoneRequest {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ZonesService {
  constructor(private apiService: ApiService) {}

  // Datos mock para fallback
  private zones: ApiZone[] = [
    {
      id: 1,
      country: 'Argentina',
      province: 'Buenos Aires',
      city: 'La Plata',
      postal_code: '1900',
      neighborhood: 'Microcentro',
      type: 'Urbana',
      flag: '🇦🇷',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      country: 'Argentina',
      province: 'Buenos Aires',
      city: 'Capital Federal',
      postal_code: '1000',
      neighborhood: 'Microcentro',
      type: 'Urbana',
      flag: '🇦🇷',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 3,
      country: 'Argentina',
      province: 'Buenos Aires',
      city: 'Escobar',
      postal_code: '1625',
      neighborhood: 'Centro',
      type: 'Suburbana',
      flag: '🇦🇷',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 4,
      country: 'Perú',
      province: 'Lima',
      city: 'Lima',
      postal_code: '15001',
      neighborhood: 'Miraflores',
      type: 'Urbana',
      flag: '🇵🇪',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 5,
      country: 'Chile',
      province: 'Santiago',
      city: 'Santiago',
      postal_code: '8320000',
      neighborhood: 'Las Condes',
      type: 'Urbana',
      flag: '🇨🇱',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    }
  ];

  /**
   * Obtiene todas las zonas desde la API
   */
  getZones(): Observable<ApiZone[]> {
    return this.apiService.get<ApiZone[]>('/api/zones').pipe(
      map((response: any) => {
        const mapItem = (item: any): ApiZone => ({
          id: item.id,
          country: item.country,
          province: item.province,
          city: item.city,
          postal_code: item.postal_code,
          neighborhood: item.neighborhood,
          type: item.type,
          flag: item.flag || this.getFlagForCountry(item.country),
          created_at: item.created_at || null,
          updated_at: item.updated_at || null
        });

        if (response?.data && Array.isArray(response.data)) {
          return response.data.map(mapItem);
        }
        if (Array.isArray(response)) {
          return response.map(mapItem);
        }
        console.warn('Formato de respuesta inesperado, usando datos mock');
        return [...this.zones];
      }),
      catchError((error) => {
        console.error('Error al obtener zonas desde la API:', error);
        return of([...this.zones]).pipe(delay(300));
      })
    );
  }

  /**
   * Filtra las zonas según los criterios proporcionados
   */
  filterZones(filters: ZoneFilters): Observable<ApiZone[]> {
    return this.apiService.post<ApiZone[]>('/api/zones/filter', filters).pipe(
      map((response: any) => {
        const mapItem = (item: any): ApiZone => ({
          id: item.id,
          country: item.country,
          province: item.province,
          city: item.city,
          postal_code: item.postal_code,
          neighborhood: item.neighborhood,
          type: item.type,
          flag: item.flag || this.getFlagForCountry(item.country),
          created_at: item.created_at || null,
          updated_at: item.updated_at || null
        });

        if (response?.data && Array.isArray(response.data)) {
          return response.data.map(mapItem);
        }
        if (Array.isArray(response)) {
          return response.map(mapItem);
        }
        console.warn('Formato de respuesta inesperado, usando filtrado local');
        return this.filterZonesLocally(filters);
      }),
      catchError((error) => {
        console.error('Error al filtrar zonas desde la API:', error);
        return of(this.filterZonesLocally(filters)).pipe(delay(300));
      })
    );
  }

  /**
   * Obtiene una zona por ID
   */
  getZoneById(id: number): Observable<ApiZone | null> {
    const zone = this.zones.find(z => z.id === id);
    return of(zone || null).pipe(delay(100));
  }

  /**
   * Crea una nueva zona
   */
  createZone(request: CreateZoneRequest): Observable<ApiZone> {
    return this.apiService.post<ApiZone>('/api/zones', request).pipe(
      map((response: any) => {
        // Si la API devuelve un wrapper con data, extraemos la zona
        if (response.data) {
          return this.mapApiZoneToInternal(response.data);
        }
        // Si devuelve directamente el objeto
        if (response.id) {
          return this.mapApiZoneToInternal(response);
        }
        // Fallback a creación local si hay error
        console.warn('Formato de respuesta inesperado para crear zona, usando creación local');
        return this.createZoneLocally(request);
      }),
      catchError((error) => {
        console.error('Error al crear zona desde la API:', error);
        return of(this.createZoneLocally(request)).pipe(delay(300));
      })
    );
  }

  /**
   * Actualiza una zona por ID desde la API
   */
  updateZoneFromApi(id: number, request: UpdateZoneRequest): Observable<ApiZone> {
    return this.apiService.put<ApiZone>(`/api/zones/${id}`, request).pipe(
      map(response => this.mapApiZoneToInternal(response)),
      catchError(error => {
        console.error('Error updating zone:', error);
        // Fallback: actualizar localmente
        return of(this.updateZoneLocally(id, request));
      })
    );
  }

  /**
   * Elimina una zona por ID desde la API
   */
  deleteZoneFromApi(id: number): Observable<boolean> {
    return this.apiService.delete<{ success: boolean }>(`/api/zones/${id}`).pipe(
      map(response => response.success || true),
      catchError(error => {
        console.error('Error deleting zone:', error);
        // Fallback: eliminar localmente
        return of(this.deleteZoneLocally(id));
      })
    );
  }

  /**
   * Busca países por nombre (typeahead). Si no se envía query, trae lista inicial.
   */
  getCountries(query: string = ''): Observable<ApiCountry[]> {
    const qs = query ? `?name=${encodeURIComponent(query)}` : '';
    return this.apiService.get<{ data: ApiCountry[] } | ApiCountry[]>(`/api/countries${qs}`).pipe(
      map((response: any) => {
        if (response?.data && Array.isArray(response.data)) {
          return response.data as ApiCountry[];
        }
        if (Array.isArray(response)) {
          return response as ApiCountry[];
        }
        console.warn('Formato de respuesta inesperado para países, usando datos mock');
        return [
          { id: 13, name: 'Argentina' },
          { id: 248, name: 'Uruguay' },
          { id: 246, name: 'Paraguay' },
          { id: 245, name: 'Bolivia' },
          { id: 250, name: 'Chile' },
          { id: 251, name: 'Perú' }
        ];
      }),
      catchError((error) => {
        console.error('Error al obtener países desde la API:', error);
        return of([
          { id: 13, name: 'Argentina' },
          { id: 250, name: 'Chile' },
          { id: 251, name: 'Perú' }
        ]).pipe(delay(100));
      })
    );
  }

  /**
   * Obtiene las provincias de un país específico
   */
  getProvincesByCountry(country: string): Observable<string[]> {
    const provincesByCountry: { [key: string]: string[] } = {
      'Argentina': ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán', 'Entre Ríos', 'Salta', 'Misiones', 'Chaco', 'Corrientes'],
      'Perú': ['Lima', 'Arequipa', 'La Libertad', 'Piura', 'Cusco', 'Junín', 'Lambayeque', 'Ancash', 'Puno', 'Tacna'],
      'Chile': ['Santiago', 'Valparaíso', 'Biobío', 'La Araucanía', 'Los Lagos', 'Antofagasta', 'Coquimbo', 'O\'Higgins', 'Maule', 'Tarapacá'],
      'Uruguay': ['Montevideo', 'Canelones', 'Maldonado', 'Salto', 'Paysandú', 'Río Negro', 'Tacuarembó', 'Colonia', 'Soriano', 'Florida'],
      'Paraguay': ['Asunción', 'Central', 'Alto Paraná', 'Itapúa', 'Caaguazú', 'San Pedro', 'Cordillera', 'Guairá', 'Caazapá', 'Misiones'],
      'Bolivia': ['La Paz', 'Santa Cruz', 'Cochabamba', 'Potosí', 'Oruro', 'Chuquisaca', 'Tarija', 'Beni', 'Pando']
    };

    const provinces = provincesByCountry[country] || [];
    return of(provinces).pipe(delay(100));
  }

  /**
   * Obtiene las ciudades de una provincia específica
   */
  getCitiesByProvince(country: string, province: string): Observable<string[]> {
    // Mock data para ciudades por provincia
    const citiesByProvince: { [key: string]: string[] } = {
      'Buenos Aires': ['La Plata', 'Capital Federal', 'Escobar', 'Pilar', 'Tigre', 'San Isidro', 'Vicente López'],
      'Córdoba': ['Córdoba', 'Villa María', 'Río Cuarto', 'San Francisco', 'Villa Carlos Paz', 'Jesús María'],
      'Lima': ['Lima', 'Callao', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos'],
      'Santiago': ['Santiago', 'Valparaíso', 'Viña del Mar', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco']
    };

    const key = `${country}-${province}`;
    const cities = citiesByProvince[province] || [];
    return of(cities).pipe(delay(100));
  }

  /**
   * Mapea la respuesta de la API al formato interno
   */
  private mapApiZoneToInternal(apiZone: any): ApiZone {
    return {
      id: apiZone.id,
      country: apiZone.country,
      province: apiZone.province,
      city: apiZone.city,
      postal_code: apiZone.postal_code,
      neighborhood: apiZone.neighborhood,
      type: apiZone.type,
      flag: apiZone.flag || this.getFlagForCountry(apiZone.country),
      created_at: apiZone.created_at || null,
      updated_at: apiZone.updated_at || null
    };
  }

  /**
   * Filtra las zonas localmente (fallback)
   */
  private filterZonesLocally(filters: ZoneFilters): ApiZone[] {
    return this.zones.filter(zone => {
      if (filters.country && !zone.country.toLowerCase().includes(filters.country.toLowerCase())) {
        return false;
      }
      if (filters.province && !zone.province.toLowerCase().includes(filters.province.toLowerCase())) {
        return false;
      }
      if (filters.city && !zone.city.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }
      if (filters.postal_code && !zone.postal_code.includes(filters.postal_code)) {
        return false;
      }
      if (filters.type && zone.type !== filters.type) {
        return false;
      }
      return true;
    });
  }

  /**
   * Crea una zona localmente (fallback)
   */
  private createZoneLocally(request: CreateZoneRequest): ApiZone {
    const newZone: ApiZone = {
      id: Math.max(...this.zones.map(z => z.id)) + 1,
      country: request.country,
      province: request.province,
      city: request.city,
      postal_code: request.postal_code,
      neighborhood: request.neighborhood,
      type: request.type,
      flag: request.flag || this.getFlagForCountry(request.country),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.zones.push(newZone);
    return newZone;
  }

  /**
   * Actualiza una zona localmente (fallback)
   */
  private updateZoneLocally(id: number, request: UpdateZoneRequest): ApiZone {
    const index = this.zones.findIndex(z => z.id === id);
    if (index === -1) {
      throw new Error('Zone not found');
    }

    const updatedZone: ApiZone = {
      ...this.zones[index],
      country: request.country,
      province: request.province,
      city: request.city,
      postal_code: request.postal_code,
      neighborhood: request.neighborhood,
      type: request.type,
      flag: request.flag || this.getFlagForCountry(request.country),
      updated_at: new Date().toISOString()
    };

    this.zones[index] = updatedZone;
    return updatedZone;
  }

  /**
   * Elimina una zona localmente (fallback)
   */
  private deleteZoneLocally(id: number): boolean {
    const index = this.zones.findIndex(z => z.id === id);
    if (index === -1) {
      return false;
    }
    this.zones.splice(index, 1);
    return true;
  }

  /**
   * Obtiene la bandera emoji para un país
   */
  private getFlagForCountry(country: string): string {
    const flags: { [key: string]: string } = {
      'Argentina': '🇦🇷',
      'Perú': '🇵🇪',
      'Chile': '🇨🇱',
      'Uruguay': '🇺🇾',
      'Paraguay': '🇵🇾',
      'Bolivia': '🇧🇴',
      'Brasil': '🇧🇷',
      'Colombia': '🇨🇴',
      'Venezuela': '🇻🇪',
      'Ecuador': '🇪🇨'
    };
    return flags[country] || '🏳️';
  }
}

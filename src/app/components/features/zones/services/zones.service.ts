import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, delay, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';

export type ZoneType = 'Urbana' | 'Suburbana' | 'Rural';

export interface ApiCountry {
  id: number;
  name: string;
}

export interface ApiState {
  id: number;
  name: string;
}

export interface ApiLocality {
  id: number;
  name: string;
}

export interface ApiZipCode {
  id: number;
  code: string;
  locality_id: number;
  locality?: ApiLocality;
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
   * Obtiene las provincias/estados por país usando el endpoint real
   * GET /api/states?country_id=<id>
   */
  getProvincesByCountry(countryId: number): Observable<ApiState[]> {
    return this.apiService.get<{ data: ApiState[] } | ApiState[]>(`/api/states?country_id=${encodeURIComponent(countryId)}`).pipe(
      map((response: any) => {
        if (response?.data && Array.isArray(response.data)) {
          return response.data as ApiState[];
        }
        if (Array.isArray(response)) {
          return response as ApiState[];
        }
        console.warn('Formato de respuesta inesperado para provincias, usando mock');
        return [
          { id: 1, name: 'Buenos Aires' },
          { id: 2, name: 'Córdoba' },
          { id: 3, name: 'Santa Fe' }
        ];
      }),
      catchError((error) => {
        console.error('Error al obtener provincias desde la API:', error);
        return of([
          { id: 1, name: 'Buenos Aires' },
          { id: 2, name: 'Córdoba' }
        ]).pipe(delay(100));
      })
    );
  }

  /**
   * Obtiene localidades por provincia/estado (endpoint real)
   * GET /api/localities?state_id=<id>
   */
  getLocalitiesByState(stateId: number): Observable<ApiLocality[]> {
    return this.apiService.get<{ data: ApiLocality[] } | ApiLocality[]>(`/api/localities?state_id=${encodeURIComponent(stateId)}`).pipe(
      map((response: any) => {
        if (response?.data && Array.isArray(response.data)) {
          return response.data as ApiLocality[];
        }
        if (Array.isArray(response)) {
          return response as ApiLocality[];
        }
        console.warn('Formato inesperado para localidades, usando mock');
        return [
          { id: 1, name: 'La Plata' },
          { id: 2, name: 'Capital Federal' },
          { id: 3, name: 'Escobar' }
        ];
      }),
      catchError((error) => {
        console.error('Error al obtener localidades desde la API:', error);
        return of([
          { id: 1, name: 'La Plata' },
          { id: 2, name: 'Capital Federal' }
        ]).pipe(delay(100));
      })
    );
  }

  /**
   * Obtiene códigos postales por localidad
   * GET /api/zip-codes?locality_id=<id>
   */
  getZipCodesByLocality(localityId: number): Observable<ApiZipCode[]> {
    return this.apiService.get<{ data: ApiZipCode[] } | ApiZipCode[]>(`/api/zip-codes?locality_id=${encodeURIComponent(localityId)}`).pipe(
      map((response: any) => {
        if (response?.data && Array.isArray(response.data)) {
          return response.data as ApiZipCode[];
        }
        if (Array.isArray(response)) {
          return response as ApiZipCode[];
        }
        console.warn('Formato inesperado para códigos postales, usando mock');
        return [
          { id: 1, code: '1900', locality_id: localityId },
          { id: 2, code: '1901', locality_id: localityId }
        ];
      }),
      catchError((error) => {
        console.error('Error al obtener códigos postales desde la API:', error);
        return of([{ id: 1, code: '0000', locality_id: localityId }]).pipe(delay(100));
      })
    );
  }

  /**
   * Obtiene códigos postales por provincia/estado
   * Preferentemente desde la API: GET /api/zip-codes?state_id=<id>
   * Fallback: agrega los CP consultando por cada localidad de la provincia
   */
  getZipCodesByState(stateId: number): Observable<ApiZipCode[]> {
    // Intento directo a la API si está disponible
    return this.apiService
      .get<{ data: ApiZipCode[] } | ApiZipCode[]>(`/api/zip-codes?state_id=${encodeURIComponent(stateId)}`)
      .pipe(
        map((response: any) => {
          if (response?.data && Array.isArray(response.data)) {
            return response.data as ApiZipCode[];
          }
          if (Array.isArray(response)) {
            return response as ApiZipCode[];
          }
          // Si la forma no es la esperada, construimos a partir de localidades
          return [] as ApiZipCode[];
        }),
        catchError(() => of([] as ApiZipCode[])),
        // Si vino vacío por formato desconocido, usamos fallback local
        map((zipsFromApi) => zipsFromApi && zipsFromApi.length > 0 ? zipsFromApi : null),
        // Si null, hacemos fallback a consultar por localidad
        switchMap((maybeZips) => {
          if (maybeZips) {
            return of(maybeZips);
          }
          return this.getLocalitiesByState(stateId).pipe(
            switchMap((localities) => {
              if (!localities || localities.length === 0) {
                return of([] as ApiZipCode[]);
              }
              const requests = localities.map((l) => this.getZipCodesByLocality(l.id));
              return forkJoin(requests).pipe(
                map((results) => results.flat())
              );
            }),
            catchError(() => of([] as ApiZipCode[]))
          );
        })
      );
  }

  /**
   * Busca códigos postales por código (modo búsqueda directa por CP)
   * GET /api/zip-codes?code=<cp>
   */
  getZipCodesByCode(code: string): Observable<ApiZipCode[]> {
    const qs = code ? `?code=${encodeURIComponent(code)}` : '';
    return this.apiService.get<{ data: ApiZipCode[] } | ApiZipCode[]>(`/api/zip-codes${qs}`).pipe(
      map((response: any) => {
        if (response?.data && Array.isArray(response.data)) {
          return response.data as ApiZipCode[];
        }
        if (Array.isArray(response)) {
          return response as ApiZipCode[];
        }
        console.warn('Formato inesperado para búsqueda por código postal, usando mock');
        return [
          { id: 1, code: code || '0000', locality_id: 0, locality: { id: 0, name: 'Desconocida' } }
        ];
      }),
      catchError((error) => {
        console.error('Error al buscar por código postal en la API:', error);
        return of([{ id: 1, code: code || '0000', locality_id: 0, locality: { id: 0, name: 'Desconocida' } }]).pipe(delay(100));
      })
    );
  }

  // (El método de ciudades mock se eliminó por no utilizarse)

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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UsuarioDto, UsuarioListItemDto, UsuarioDetalleDto } from '../models';
import { environment } from '../../environments/entironments';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiBaseUrl}/usuarios`;
  // Flag para usar datos mock (para desarrollo)
  private useMockData = true; // Cambia a false para usar la API real

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  getAll(): Observable<UsuarioListItemDto[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getMockUsuarios());
    }
    return this.http.get<UsuarioListItemDto[]>(this.apiUrl);
  }

  getActivos(): Observable<UsuarioListItemDto[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getMockUsuarios().filter(u => u.estado === 'ACTIVO'));
    }
    return this.http.get<UsuarioListItemDto[]>(`${this.apiUrl}/activos`);
  }

  getById(id: number): Observable<UsuarioDto> {
    if (this.useMockData) {
      return of(this.mockDataService.getMockUsuarioDetalle(id));
    }
    return this.http.get<UsuarioDto>(`${this.apiUrl}/${id}`);
  }

  buscar(termino: string): Observable<UsuarioListItemDto[]> {
    if (this.useMockData) {
      const mockUsuarios = this.mockDataService.getMockUsuarios();
      const filteredUsuarios = mockUsuarios.filter(u => 
        u.nombre.toLowerCase().includes(termino.toLowerCase()) || 
        u.apellido.toLowerCase().includes(termino.toLowerCase()) || 
        u.dni.includes(termino)
      );
      return of(filteredUsuarios);
    }
    return this.http.get<UsuarioListItemDto[]>(`${this.apiUrl}/buscar?termino=${termino}`);
  }

  create(usuario: UsuarioDto): Observable<UsuarioDto> {
    if (this.useMockData) {
      // Simulamos creación asignando un ID
      const mockUsuario = { ...usuario, id: Math.floor(Math.random() * 1000) + 100 };
      return of(mockUsuario);
    }
    return this.http.post<UsuarioDto>(this.apiUrl, usuario);
  }

  update(id: number, usuario: UsuarioDto): Observable<UsuarioDto> {
    if (this.useMockData) {
      // Simulamos actualización retornando el mismo objeto
      return of(usuario);
    }
    return this.http.put<UsuarioDto>(`${this.apiUrl}/${id}`, usuario);
  }

  delete(id: number): Observable<void> {
    if (this.useMockData) {
      // Simulamos eliminación
      return of(undefined);
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ClaseDto, ClaseInfoDto, DayOfWeek } from '../models';
import { environment } from '../../environments/entironments';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ClaseService {
  private apiUrl = `${environment.apiBaseUrl}/api/clases`;
  // Flag para usar datos mock (para desarrollo)
  private useMockData = false; // Cambia a false para usar la API real

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  getAll(): Observable<ClaseInfoDto[]> {
    /*if (this.useMockData) {
      return of(this.mockDataService.getMockClases());
    }*/
    return this.http.get<ClaseInfoDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<ClaseInfoDto> {
    
    return this.http.get<ClaseInfoDto>(`${this.apiUrl}/${id}`);
  }

  getByTurnoId(turnoId: number): Observable<ClaseInfoDto[]> {
    return this.http.get<ClaseInfoDto[]>(`${this.apiUrl}/turno/${turnoId}`);
  }

  getByFecha(fecha: string): Observable<ClaseInfoDto[]> {
    return this.http.get<ClaseInfoDto[]>(`${this.apiUrl}/fecha?fecha=${fecha}`);
  }

  getByPeriodo(fechaInicio: string, fechaFin: string): Observable<ClaseInfoDto[]> {
    return this.http.get<ClaseInfoDto[]>(`${this.apiUrl}/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  getByUsuarioId(usuarioId: number, fechaInicio: string, fechaFin: string): Observable<ClaseInfoDto[]> {
    return this.http.get<ClaseInfoDto[]>(`${this.apiUrl}/usuario/${usuarioId}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  create(clase: ClaseDto): Observable<ClaseInfoDto> {
    return this.http.post<ClaseInfoDto>(this.apiUrl, clase);
  }

  update(id: number, clase: ClaseDto): Observable<ClaseInfoDto> {
    /*if (this.useMockData) {
      const claseUpdated: ClaseInfoDto = {
        id: id,
        turnoId: clase.turnoId,
        diaSemana: DayOfWeek.MONDAY, // Valor predeterminado, debería calcularse
        hora: '08:00', // Valor predeterminado, debería obtenerse del turno
        fecha: clase.fecha.toString(),
        descripcion: clase.descripcion || '',
        cantidadAsistencias: 10, // Valores ficticios
        cantidadPresentes: 7 // Valores ficticios
      };
      return of(claseUpdated);
    }*/
    return this.http.put<ClaseInfoDto>(`${this.apiUrl}/${id}`, clase);
  }

  delete(id: number): Observable<void> {
    /*if (this.useMockData) {
      return of(undefined);
    }*/
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEstadisticasAsistenciasPeriodo(fechaInicio: string, fechaFin: string): Observable<number> {
    /*if (this.useMockData) {
      // Devolver un porcentaje aleatorio entre 50% y 90%
      return of(Math.floor(Math.random() * 40) + 50);
    }*/
    return this.http.get<number>(`${this.apiUrl}/estadisticas/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
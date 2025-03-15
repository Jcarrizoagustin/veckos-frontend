import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClaseDto, ClaseInfoDto } from '../models';
import { environment } from '../../environments/entironments';

@Injectable({
  providedIn: 'root'
})
export class ClaseService {
  private apiUrl = `${environment.apiBaseUrl}/clases`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ClaseDto[]> {
    return this.http.get<ClaseDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<ClaseDto> {
    return this.http.get<ClaseDto>(`${this.apiUrl}/${id}`);
  }

  getByTurnoId(turnoId: number): Observable<ClaseDto[]> {
    return this.http.get<ClaseDto[]>(`${this.apiUrl}/turno/${turnoId}`);
  }

  getByFecha(fecha: string): Observable<ClaseDto[]> {
    return this.http.get<ClaseDto[]>(`${this.apiUrl}/fecha?fecha=${fecha}`);
  }

  getByPeriodo(fechaInicio: string, fechaFin: string): Observable<ClaseDto[]> {
    return this.http.get<ClaseDto[]>(`${this.apiUrl}/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  getByUsuarioId(usuarioId: number, fechaInicio: string, fechaFin: string): Observable<ClaseDto[]> {
    return this.http.get<ClaseDto[]>(`${this.apiUrl}/usuario/${usuarioId}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  create(clase: ClaseDto): Observable<ClaseDto> {
    return this.http.post<ClaseDto>(this.apiUrl, clase);
  }

  update(id: number, clase: ClaseDto): Observable<ClaseDto> {
    return this.http.put<ClaseDto>(`${this.apiUrl}/${id}`, clase);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEstadisticasAsistenciasPeriodo(fechaInicio: string, fechaFin: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/estadisticas/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
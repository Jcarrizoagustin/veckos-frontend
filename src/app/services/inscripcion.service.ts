import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InscripcionCrearDto, InscripcionInfoDto, EstadoPago } from '../models';
import { environment } from '../../environments/entironments';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private apiUrl = `${environment.apiBaseUrl}/inscripciones`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<InscripcionInfoDto[]> {
    return this.http.get<InscripcionInfoDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<InscripcionInfoDto> {
    return this.http.get<InscripcionInfoDto>(`${this.apiUrl}/${id}`);
  }

  getByUsuarioId(usuarioId: number): Observable<InscripcionInfoDto[]> {
    return this.http.get<InscripcionInfoDto[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getActivaByUsuarioId(usuarioId: number): Observable<InscripcionInfoDto> {
    return this.http.get<InscripcionInfoDto>(`${this.apiUrl}/usuario/${usuarioId}/activa`);
  }

  getByEstado(estado: EstadoPago): Observable<InscripcionInfoDto[]> {
    return this.http.get<InscripcionInfoDto[]>(`${this.apiUrl}/por-estado/${estado}`);
  }

  getByVencimiento(fechaInicio: string, fechaFin: string): Observable<InscripcionInfoDto[]> {
    return this.http.get<InscripcionInfoDto[]>(`${this.apiUrl}/por-vencimiento?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  create(inscripcion: InscripcionCrearDto): Observable<InscripcionInfoDto> {
    return this.http.post<InscripcionInfoDto>(this.apiUrl, inscripcion);
  }

  update(id: number, inscripcion: any): Observable<InscripcionInfoDto> {
    return this.http.put<InscripcionInfoDto>(`${this.apiUrl}/${id}`, inscripcion);
  }

  renovar(id: number): Observable<InscripcionInfoDto> {
    return this.http.post<InscripcionInfoDto>(`${this.apiUrl}/${id}/renovar`, {});
  }

  renovarConCambios(id: number, inscripcion: InscripcionCrearDto): Observable<InscripcionInfoDto> {
    return this.http.post<InscripcionInfoDto>(`${this.apiUrl}/${id}/renovar-con-cambios`, inscripcion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  actualizarEstadosPagos(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/actualizar-estados`, {});
  }
}
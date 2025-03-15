import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsistenciaInfoDto, AsistenciaRegistrarDto } from '../models';
import { environment } from '../../environments/entironments';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = `${environment.apiBaseUrl}/asistencias`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AsistenciaInfoDto[]> {
    return this.http.get<AsistenciaInfoDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<AsistenciaInfoDto> {
    return this.http.get<AsistenciaInfoDto>(`${this.apiUrl}/${id}`);
  }

  getByUsuarioId(usuarioId: number): Observable<AsistenciaInfoDto[]> {
    return this.http.get<AsistenciaInfoDto[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getByClaseId(claseId: number): Observable<AsistenciaInfoDto[]> {
    return this.http.get<AsistenciaInfoDto[]>(`${this.apiUrl}/clase/${claseId}`);
  }

  getByUsuarioIdAndFecha(usuarioId: number, fechaInicio: string, fechaFin: string): Observable<AsistenciaInfoDto[]> {
    return this.http.get<AsistenciaInfoDto[]>(`${this.apiUrl}/usuario/${usuarioId}/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  registrar(asistencia: AsistenciaRegistrarDto): Observable<AsistenciaInfoDto> {
    return this.http.post<AsistenciaInfoDto>(this.apiUrl, asistencia);
  }

  registrarPorClase(claseId: number, usuariosPresentes: number[]): Observable<AsistenciaInfoDto[]> {
    return this.http.post<AsistenciaInfoDto[]>(`${this.apiUrl}/clase/${claseId}`, usuariosPresentes);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEstadisticasUsuario(usuarioId: number, fechaInicio: string, fechaFin: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/estadisticas/usuario/${usuarioId}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  getRanking(fechaInicio: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ranking?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
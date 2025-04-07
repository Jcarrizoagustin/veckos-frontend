import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagoCrearDto, PagoInfoDto } from '../models';
import { environment } from '../../environments/entironments';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = `${environment.apiBaseUrl}/api/pagos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PagoInfoDto[]> {
    return this.http.get<PagoInfoDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<PagoInfoDto> {
    return this.http.get<PagoInfoDto>(`${this.apiUrl}/${id}`);
  }

  getByInscripcionId(inscripcionId: number): Observable<PagoInfoDto[]> {
    return this.http.get<PagoInfoDto[]>(`${this.apiUrl}/inscripcion/${inscripcionId}`);
  }

  getByUsuarioId(usuarioId: number): Observable<PagoInfoDto[]> {
    return this.http.get<PagoInfoDto[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getByPeriodo(fechaInicio: string, fechaFin: string): Observable<PagoInfoDto[]> {
    return this.http.get<PagoInfoDto[]>(`${this.apiUrl}/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  registrar(pago: PagoCrearDto): Observable<PagoInfoDto> {
    return this.http.post<PagoInfoDto>(this.apiUrl, pago);
  }

  update(id: number, pago: PagoCrearDto): Observable<PagoInfoDto> {
    return this.http.put<PagoInfoDto>(`${this.apiUrl}/${id}`, pago);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSumaPagosPeriodo(fechaInicio: string, fechaFin: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/estadisticas/periodo/suma?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  getEstadisticasPorMetodoPago(fechaInicio: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estadisticas/periodo/metodo-pago?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  getEstadisticasMensuales(fechaInicio: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estadisticas/periodo/mensual?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
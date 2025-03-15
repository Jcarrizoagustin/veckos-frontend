import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteAsistenciaRequestDto } from '../models';
import { environment } from '../../environments/entironments';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = `${environment.apiBaseUrl}/reportes`;

  constructor(private http: HttpClient) {}

  generarReporteAsistencia(request: ReporteAsistenciaRequestDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/asistencia`, request);
  }

  generarReporteFinanciero(fechaInicio: string, fechaFin: string, agruparPorMes: boolean = false, agruparPorMetodoPago: boolean = false): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/financiero?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&agruparPorMes=${agruparPorMes}&agruparPorMetodoPago=${agruparPorMetodoPago}`);
  }

  generarReporteInscripciones(fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/inscripciones?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`);
  }
}
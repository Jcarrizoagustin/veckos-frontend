import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ReporteAsistenciaRequestDto } from '../models';
import { environment } from '../../environments/entironments';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = `${environment.apiBaseUrl}/api/reportes`;
  // Flag para usar datos mock (para desarrollo)
  private useMockData = false; // Cambia a false para usar la API real

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  generarReporteAsistencia(request: ReporteAsistenciaRequestDto): Observable<any> {
    /*if (this.useMockData) {
      // Generar un reporte de asistencia simulado
      const reporte: any = {
        fechaInicio: request.fechaInicio,
        fechaFin: request.fechaFin,
        totalUsuarios: 48,
        totalClasesProgramadas: 120,
        totalAsistencias: 85,
        porcentajeAsistenciaPromedio: 70.8
      };

      // Si es para un usuario específico
      if (request.usuarioId) {
        const usuario = this.mockDataService.getMockUsuarioDetalle(request.usuarioId);
        const asistencias = this.mockDataService.getMockAsistenciasByUsuarioId(request.usuarioId);
        
        // Filtrar por presentes si se solicita
        const asistenciasFiltradas = request.incluirSoloPresentes 
          ? asistencias.filter(a => a.presente) 
          : asistencias;

        reporte.usuarioId = request.usuarioId;
        reporte.nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;
        reporte.totalClasesProgramadas = 12;
        reporte.totalAsistencias = asistenciasFiltradas.length;
        reporte.porcentajeAsistencia = reporte.totalClasesProgramadas > 0 
          ? (reporte.totalAsistencias / reporte.totalClasesProgramadas) * 100 
          : 0;
        reporte.asistencias = asistenciasFiltradas;
      } else {
        // Reporte general (todos los usuarios)
        reporte.rankingUsuarios = [
          [1, 'Juan Pérez', 15],
          [5, 'Martín López', 14],
          [2, 'María González', 11],
          [3, 'Carlos Rodríguez', 8]
        ];
        
        // Si se solicita agrupación por día
        if (request.agruparPorDia) {
          reporte.asistenciasPorDia = {
            '2023-02-01': 12,
            '2023-02-02': 15,
            '2023-02-03': 14,
            '2023-02-06': 16,
            '2023-02-07': 18,
            '2023-02-08': 10
          };
        }
      }

      return of(reporte);
    }*/
    
    return this.http.post<any>(`${this.apiUrl}/asistencia`, request);
  }

  generarReporteFinanciero(fechaInicio: string, fechaFin: string, agruparPorMes: boolean = false, agruparPorMetodoPago: boolean = false,cuentaId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/financiero?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&agruparPorMes=${agruparPorMes}&agruparPorMetodoPago=${agruparPorMetodoPago}&cuentaId=${cuentaId}`);
  }

  generarReporteInscripciones(fechaInicio: string, fechaFin: string): Observable<any> {
    /*if (this.useMockData) {
      // Generar un reporte de inscripciones simulado
      const inscripciones = this.mockDataService.getMockInscripciones();
      
      const reporte: any = {
        fechaInicio,
        fechaFin,
        totalInscripciones: inscripciones.length,
        inscripcionesNuevas: Math.floor(inscripciones.length * 0.6),
        inscripcionesRenovadas: Math.floor(inscripciones.length * 0.4),
        inscripciones: inscripciones
      };
      
      // Distribución por plan
      reporte.inscripcionesPorPlan = {
        'Plan Fitness': 8,
        'Plan Wellness': 6,
        'Plan Sport': 10
      };
      
      // Distribución por frecuencia
      reporte.inscripcionesPorFrecuencia = {
        '3': 14,
        '5': 10
      };
      
      return of(reporte);
    }*/
    
    return this.http.get<any>(`${this.apiUrl}/inscripciones?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  getDashboardStats(): Observable<any> {
    /*if (this.useMockData) {
      return of(this.mockDataService.getMockDashboardStats());
    }*/
    
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`);
  }
}
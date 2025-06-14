import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/entironments';
import { ReporteAsistenciaRequestDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ExportarReporteService {
  private apiUrl = `${environment.apiBaseUrl}/api/reportes`;

  constructor(private http: HttpClient) {}

  exportarReporteExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/financiero/excel`, {
      responseType: 'blob'
    });
  }

  exportarReportePorPeriodoExcel(fechaInicio: string, fechaFin: string, cuentaId:string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/financiero/excel/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&cuentaId=${cuentaId}`, {
      responseType: 'blob'
    });
  }

  exportarReporteAsistenciaIndividualPdf(request: ReporteAsistenciaRequestDto): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/asistencia/pdf`,request, {
      responseType: 'blob'
    });
  }
}

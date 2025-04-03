import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/entironments';

@Injectable({
  providedIn: 'root'
})
export class ExportarReporteService {
  private apiUrl = `${environment.apiBaseUrl}/reportes`;

  constructor(private http: HttpClient) {}

  exportarReporteExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/financiero/excel`, {
      responseType: 'blob'
    });
  }

  exportarReportePorPeriodoExcel(fechaInicio: string, fechaFin: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/financiero/excel/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
      responseType: 'blob'
    });
  }
}

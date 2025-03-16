import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AsistenciaInfoDto, AsistenciaRegistrarDto } from '../models';
import { environment } from '../../environments/entironments';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = `${environment.apiBaseUrl}/asistencias`;
  // Flag para usar datos mock (para desarrollo)
  private useMockData = true; // Cambia a false para usar la API real

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  getAll(): Observable<AsistenciaInfoDto[]> {
    if (this.useMockData) {
      // Combinamos todas las asistencias de todas las clases
      const asistencias: AsistenciaInfoDto[] = [];
      const clases = this.mockDataService.getMockClases();
      
      // Tomamos solo las primeras 5 clases para no generar demasiados datos
      clases.slice(0, 5).forEach(clase => {
        const asistenciasClase = this.mockDataService.getMockAsistenciasByClaseId(clase.id);
        asistencias.push(...asistenciasClase);
      });
      
      return of(asistencias);
    }
    return this.http.get<AsistenciaInfoDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<AsistenciaInfoDto> {
    if (this.useMockData) {
      // Generar una asistencia ficticia
      return of({
        id: id,
        claseId: 100,
        fechaClase: new Date().toISOString().split('T')[0],
        horaClase: '08:00',
        nombreUsuario: 'Usuario',
        apellidoUsuario: 'De Prueba',
        presente: Math.random() > 0.3, // 70% de probabilidad de estar presente
        fechaRegistro: new Date().toISOString()
      });
    }
    return this.http.get<AsistenciaInfoDto>(`${this.apiUrl}/${id}`);
  }

  getByUsuarioId(usuarioId: number): Observable<AsistenciaInfoDto[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getMockAsistenciasByUsuarioId(usuarioId));
    }
    return this.http.get<AsistenciaInfoDto[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getByClaseId(claseId: number): Observable<AsistenciaInfoDto[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getMockAsistenciasByClaseId(claseId));
    }
    return this.http.get<AsistenciaInfoDto[]>(`${this.apiUrl}/clase/${claseId}`);
  }

  getByUsuarioIdAndFecha(usuarioId: number, fechaInicio: string, fechaFin: string): Observable<AsistenciaInfoDto[]> {
    if (this.useMockData) {
      // Filtramos las asistencias del usuario por fecha (simplificado)
      const asistenciasUsuario = this.mockDataService.getMockAsistenciasByUsuarioId(usuarioId);
      
      // En la práctica, deberíamos filtrar por fecha, pero para simplificar:
      return of(asistenciasUsuario.slice(0, 10)); // Tomamos solo las primeras 10
    }
    return this.http.get<AsistenciaInfoDto[]>(`${this.apiUrl}/usuario/${usuarioId}/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  registrar(asistencia: AsistenciaRegistrarDto): Observable<AsistenciaInfoDto> {
    if (this.useMockData) {
      // Crear una asistencia ficticia
      const nuevaAsistencia: AsistenciaInfoDto = {
        id: Math.floor(Math.random() * 1000) + 5000,
        claseId: asistencia.claseId,
        fechaClase: new Date().toISOString().split('T')[0],
        horaClase: '08:00', // Debería obtenerse de la clase
        nombreUsuario: 'Usuario', // Debería obtenerse del usuario
        apellidoUsuario: 'Registrado',
        presente: asistencia.presente,
        fechaRegistro: new Date().toISOString()
      };
      return of(nuevaAsistencia);
    }
    return this.http.post<AsistenciaInfoDto>(this.apiUrl, asistencia);
  }

  registrarPorClase(claseId: number, usuariosPresentes: number[]): Observable<AsistenciaInfoDto[]> {
    if (this.useMockData) {
      return of(this.mockDataService.registrarAsistenciasPorClaseMock(claseId, usuariosPresentes));
    }
    return this.http.post<AsistenciaInfoDto[]>(`${this.apiUrl}/clase/${claseId}`, usuariosPresentes);
  }

  delete(id: number): Observable<void> {
    if (this.useMockData) {
      return of(undefined);
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEstadisticasUsuario(usuarioId: number, fechaInicio: string, fechaFin: string): Observable<number> {
    if (this.useMockData) {
      // Devolver un porcentaje aleatorio entre 60% y 95%
      return of(Math.floor(Math.random() * 35) + 60);
    }
    return this.http.get<number>(`${this.apiUrl}/estadisticas/usuario/${usuarioId}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  getRanking(fechaInicio: string, fechaFin: string): Observable<any[]> {
    if (this.useMockData) {
      // Generar un ranking ficticio con usuarios reales
      const usuarios = this.mockDataService.getMockUsuarios();
      return of(usuarios.map(usuario => ({
        usuarioId: usuario.id,
        nombreCompleto: `${usuario.nombre} ${usuario.apellido}`,
        porcentajeAsistencia: Math.floor(Math.random() * 35) + 60 // Entre 60% y 95%
      })));
    }
    return this.http.get<any[]>(`${this.apiUrl}/ranking?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { InscripcionCrearDto, InscripcionInfoDto, EstadoPago } from '../models';
import { environment } from '../../environments/entironments';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private apiUrl = `${environment.apiBaseUrl}/api/inscripciones`;
  // Flag para usar datos mock (para desarrollo)
  private useMockData = false; // Cambia a false para usar la API real

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  getAll(): Observable<InscripcionInfoDto[]> {
    /*if (this.useMockData) {
      return of(this.mockDataService.getMockInscripciones());
    }*/
    return this.http.get<InscripcionInfoDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<InscripcionInfoDto> {
    /*if (this.useMockData) {
      return of(this.mockDataService.getMockInscripcionById(id));
    }*/
    return this.http.get<InscripcionInfoDto>(`${this.apiUrl}/${id}`);
  }

  getByUsuarioId(usuarioId: number): Observable<InscripcionInfoDto[]> {
    /*if (this.useMockData) {
      return of(this.mockDataService.getMockInscripcionesByUsuarioId(usuarioId));
    }*/
    return this.http.get<InscripcionInfoDto[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getActivaByUsuarioId(usuarioId: number): Observable<InscripcionInfoDto> {
    /*if (this.useMockData) {
      const inscripciones = this.mockDataService.getMockInscripcionesByUsuarioId(usuarioId);
      const activa = inscripciones.find(i => 
        i.estadoPago === EstadoPago.ACTIVO || i.estadoPago === EstadoPago.PROXIMO_A_VENCER
      );
      return of(activa || inscripciones[0]);
    }*/
    return this.http.get<InscripcionInfoDto>(`${this.apiUrl}/usuario/${usuarioId}/activa`);
  }

  getByEstado(estado: EstadoPago): Observable<InscripcionInfoDto[]> {
    /*if (this.useMockData) {
      return of(this.mockDataService.getMockInscripcionesByEstado(estado));
    }*/
    return this.http.get<InscripcionInfoDto[]>(`${this.apiUrl}/por-estado/${estado}`);
  }

  getByVencimiento(fechaInicio: string, fechaFin: string): Observable<InscripcionInfoDto[]> {
    /*if (this.useMockData) {
      // Filtramos inscripciones que vencen en el período
      const inscripciones = this.mockDataService.getMockInscripciones()
        .filter(i => i.fechaFin >= fechaInicio && i.fechaFin <= fechaFin);
      return of(inscripciones);
    }*/
    return this.http.get<InscripcionInfoDto[]>(`${this.apiUrl}/por-vencimiento?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  create(inscripcion: InscripcionCrearDto): Observable<InscripcionInfoDto> {
    /*if (this.useMockData) {
      // Crear una inscripción simulada
      const usuarios = this.mockDataService.getMockUsuarios();
      const planes = this.mockDataService.getMockPlanes();
      
      const usuario = usuarios.find(u => u.id === inscripcion.usuarioId);
      const plan = planes.find(p => p.id === inscripcion.planId);
      
      if (!usuario || !plan) {
        throw new Error('Usuario o plan no encontrado');
      }
      
      const nuevaInscripcion: InscripcionInfoDto = {
        id: Math.floor(Math.random() * 1000) + 200,
        usuarioId: usuario.id,
        nombreUsuario: usuario.nombre,
        apellidoUsuario: usuario.apellido,
        nombrePlan: plan.nombre,
        planId: plan.id,
        precioPlan:29440,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        frecuencia: inscripcion.frecuencia,
        estadoPago: EstadoPago.ACTIVO,
        ultimoPago: new Date().toISOString().split('T')[0],
        detalles: inscripcion.detalles.map((detalle, index) => ({
          id: Math.floor(Math.random() * 1000) + 300 + index,
          diaSemana: detalle.diaSemana,
          turnoId: detalle.turnoId,
          horaTurno: '08:00' // Hora mock, en producción se obtendría del turno
        }))
      };
      
      return of(nuevaInscripcion);
    }*/
    return this.http.post<InscripcionInfoDto>(this.apiUrl, inscripcion);
  }

  update(id: number, inscripcion: any): Observable<InscripcionInfoDto> {
    /*if (this.useMockData) {
      // Simulamos actualización obteniendo la inscripción existente y actualizando campos
      const inscripcionExistente = this.mockDataService.getMockInscripcionById(id);
      return of({ 
        ...inscripcionExistente, 
        estadoPago: inscripcion.estadoPago || inscripcionExistente.estadoPago,
        fechaFin: inscripcion.fechaFin || inscripcionExistente.fechaFin,
        ultimoPago: inscripcion.ultimoPago || inscripcionExistente.ultimoPago
      });
    }*/
    return this.http.put<InscripcionInfoDto>(`${this.apiUrl}/${id}`, inscripcion);
  }

  renovar(id: number): Observable<InscripcionInfoDto> {
    /*if (this.useMockData) {
      // Simulamos renovación copiando la inscripción existente y actualizando fechas
      const inscripcionExistente = this.mockDataService.getMockInscripcionById(id);
      const fechaInicio = new Date(inscripcionExistente.fechaFin);
      fechaInicio.setDate(fechaInicio.getDate() + 1);
      
      const fechaFin = new Date(fechaInicio);
      fechaFin.setMonth(fechaFin.getMonth() + 1);
      
      return of({
        ...inscripcionExistente,
        id: Math.floor(Math.random() * 1000) + 200,
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0],
        estadoPago: EstadoPago.ACTIVO,
        ultimoPago: new Date().toISOString().split('T')[0]
      });
    }*/
    return this.http.post<InscripcionInfoDto>(`${this.apiUrl}/${id}/renovar`, {});
  }

  renovarConCambios(id: number, inscripcion: InscripcionCrearDto): Observable<InscripcionInfoDto> {
    if (this.useMockData) {
      // Similar a create, pero manteniendo la referencia a la inscripción anterior
      return this.create(inscripcion);
    }
    return this.http.post<InscripcionInfoDto>(`${this.apiUrl}/${id}/renovar-con-cambios`, inscripcion);
  }

  delete(id: number): Observable<void> {
    if (this.useMockData) {
      // Simulamos eliminación
      return of(undefined);
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  actualizarEstadosPagos(): Observable<void> {
    if (this.useMockData) {
      // Simulamos la actualización de estados
      return of(undefined);
    }
    return this.http.put<void>(`${this.apiUrl}/actualizar-estados`, {});
  }
}
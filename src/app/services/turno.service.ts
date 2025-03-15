import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DayOfWeek, TurnoDto, TurnoConUsuariosDto } from '../models';
import { environment } from '../../environments/entironments';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = `${environment.apiBaseUrl}/turnos`;
  // Flag para usar datos mock (para desarrollo)
  private useMockData = true; // Cambia a false para usar la API real

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  getAll(): Observable<TurnoDto[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getMockTurnos());
    }
    return this.http.get<TurnoDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<TurnoDto> {
    if (this.useMockData) {
      const turno = this.mockDataService.getMockTurnos()
        .find(t => t.id === id);
      return of(turno || this.mockDataService.getMockTurnos()[0]);
    }
    return this.http.get<TurnoDto>(`${this.apiUrl}/${id}`);
  }

  getByDiaSemana(diaSemana: DayOfWeek): Observable<TurnoDto[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getMockTurnosByDiaSemana(diaSemana));
    }
    return this.http.get<TurnoDto[]>(`${this.apiUrl}/por-dia/${diaSemana}`);
  }

  getConUsuariosByDiaSemana(diaSemana: DayOfWeek): Observable<TurnoConUsuariosDto[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getMockTurnosConUsuariosByDiaSemana(diaSemana));
    }
    return this.http.get<TurnoConUsuariosDto[]>(`${this.apiUrl}/con-usuarios/${diaSemana}`);
  }

  getByOcupacion(): Observable<TurnoDto[]> {
    if (this.useMockData) {
      // Simulamos ordenar por ocupación (aleatorio para los mocks)
      const turnos = this.mockDataService.getMockTurnos()
        .sort(() => Math.random() - 0.5);
      return of(turnos);
    }
    return this.http.get<TurnoDto[]>(`${this.apiUrl}/por-ocupacion`);
  }

  create(turno: TurnoDto): Observable<TurnoDto> {
    if (this.useMockData) {
      // Simulamos crear un nuevo turno con ID generado
      const nuevoTurno = { ...turno, id: Math.floor(Math.random() * 1000) + 100 };
      return of(nuevoTurno);
    }
    return this.http.post<TurnoDto>(this.apiUrl, turno);
  }

  update(id: number, turno: TurnoDto): Observable<TurnoDto> {
    if (this.useMockData) {
      // Simulamos actualización retornando el mismo objeto con ID
      return of({ ...turno, id });
    }
    return this.http.put<TurnoDto>(`${this.apiUrl}/${id}`, turno);
  }

  delete(id: number): Observable<void> {
    if (this.useMockData) {
      // Simulamos eliminación
      return of(undefined);
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DayOfWeek, TurnoDto, TurnoConUsuariosDto } from '../models';
import { environment } from '../../environments/entironments';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = `${environment.apiBaseUrl}/turnos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TurnoDto[]> {
    return this.http.get<TurnoDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<TurnoDto> {
    return this.http.get<TurnoDto>(`${this.apiUrl}/${id}`);
  }

  getByDiaSemana(diaSemana: DayOfWeek): Observable<TurnoDto[]> {
    return this.http.get<TurnoDto[]>(`${this.apiUrl}/por-dia/${diaSemana}`);
  }

  getConUsuariosByDiaSemana(diaSemana: DayOfWeek): Observable<TurnoDto[]> {
    return this.http.get<TurnoDto[]>(`${this.apiUrl}/con-usuarios/${diaSemana}`);
  }

  getByOcupacion(): Observable<TurnoDto[]> {
    return this.http.get<TurnoDto[]>(`${this.apiUrl}/por-ocupacion`);
  }

  create(turno: TurnoDto): Observable<TurnoDto> {
    return this.http.post<TurnoDto>(this.apiUrl, turno);
  }

  update(id: number, turno: TurnoDto): Observable<TurnoDto> {
    return this.http.put<TurnoDto>(`${this.apiUrl}/${id}`, turno);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
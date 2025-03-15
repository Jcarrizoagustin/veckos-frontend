import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanDto } from '../models';
import { environment } from '../../environments/entironments';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = `${environment.apiBaseUrl}/planes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PlanDto[]> {
    return this.http.get<PlanDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<PlanDto> {
    return this.http.get<PlanDto>(`${this.apiUrl}/${id}`);
  }

  getPorPrecio(): Observable<PlanDto[]> {
    return this.http.get<PlanDto[]>(`${this.apiUrl}/por-precio`);
  }

  getPorPopularidad(): Observable<PlanDto[]> {
    return this.http.get<PlanDto[]>(`${this.apiUrl}/por-popularidad`);
  }

  create(plan: PlanDto): Observable<PlanDto> {
    return this.http.post<PlanDto>(this.apiUrl, plan);
  }

  update(id: number, plan: PlanDto): Observable<PlanDto> {
    return this.http.put<PlanDto>(`${this.apiUrl}/${id}`, plan);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
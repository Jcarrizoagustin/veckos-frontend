import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PlanDto } from '../models';
import { environment } from '../../environments/entironments';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = `${environment.apiBaseUrl}/planes`;
  // Flag para usar datos mock (para desarrollo)
  private useMockData = false; // Cambia a false para usar la API real

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  getAll(): Observable<PlanDto[]> {
    /*if (this.useMockData) {
      return of(this.mockDataService.getMockPlanes());
    }*/
    return this.http.get<PlanDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<PlanDto> {
    /*if (this.useMockData) {
      return of(this.mockDataService.getMockPlanById(id));
    }*/
    return this.http.get<PlanDto>(`${this.apiUrl}/${id}`);
  }

  getPorPrecio(): Observable<PlanDto[]> {
    /*if (this.useMockData) {
      // Ordenamos los planes por precio de menor a mayor
      const planes = this.mockDataService.getMockPlanes()
        .sort((a, b) => a.precio - b.precio);
      return of(planes);
    }*/
    return this.http.get<PlanDto[]>(`${this.apiUrl}/por-precio`);
  }

  getPorPopularidad(): Observable<PlanDto[]> {
    /*if (this.useMockData) {
      // Simulamos un orden por popularidad (podría ser aleatorio para los mocks)
      const planes = this.mockDataService.getMockPlanes()
        .sort(() => Math.random() - 0.5);
      return of(planes);
    }*/
    return this.http.get<PlanDto[]>(`${this.apiUrl}/por-popularidad`);
  }

  create(plan: PlanDto): Observable<PlanDto> {
    /*if (this.useMockData) {
      // Simulamos crear un nuevo plan con ID generado
      const nuevoPlan = { ...plan, id: Math.floor(Math.random() * 1000) + 100 };
      return of(nuevoPlan);
    }*/
    return this.http.post<PlanDto>(this.apiUrl, plan);
  }

  update(id: number, plan: PlanDto): Observable<PlanDto> {
    /*if (this.useMockData) {
      // Simulamos actualización retornando el mismo objeto con ID
      return of({ ...plan, id });
    }*/
    return this.http.put<PlanDto>(`${this.apiUrl}/${id}`, plan);
  }

  delete(id: number): Observable<void> {
    /*if (this.useMockData) {
      // Simulamos eliminación
      return of(undefined);
    }*/
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
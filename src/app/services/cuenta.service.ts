import { Injectable } from '@angular/core';
import { environment } from '../../environments/entironments';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CuentaDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  private apiUrl = `${environment.apiBaseUrl}/api/cuentas`;
  private useMockData = false; // Cambia a false para usar la API real

  constructor(
    private http: HttpClient) {
  }

  getAll(): Observable<CuentaDto[]> {
    if(this.useMockData){
      const cuenta: CuentaDto = {
        id:1,
        cbu:"15115611515151",
        descripcion:"Naranja X"
      }
      return of([cuenta]);
    }
    return this.http.get<CuentaDto[]>(this.apiUrl)
  }

  // Obtener una cuenta por ID
  getCuentaById(id: number): Observable<CuentaDto> {
    return this.http.get<CuentaDto>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva cuenta
  createCuenta(cuenta: CuentaDto): Observable<CuentaDto> {
    return this.http.post<CuentaDto>(this.apiUrl, cuenta);
  }

  // Actualizar una cuenta existente
  updateCuenta(cuenta: CuentaDto): Observable<CuentaDto> {
    return this.http.put<CuentaDto>(`${this.apiUrl}/${cuenta.id}`, cuenta);
  }

  // Eliminar una cuenta
  deleteCuenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

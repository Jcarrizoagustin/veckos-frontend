import { Injectable } from '@angular/core';
import { environment } from '../../environments/entironments';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { EventoAuditoria } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private apiUrl = `${environment.apiBaseUrl}/api/auditoria`;

  constructor(private http: HttpClient) { }

   getAll(): Observable<EventoAuditoria[]> {
      return this.http.get<EventoAuditoria[]>(this.apiUrl);
    }
}

import { Component, OnInit } from '@angular/core';
import { AuditoriaService } from '../../../services/auditoria.service';
import { EventoAuditoria } from '../../../models';
import { NotificacionService } from '../../../services/notification.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auditoria-list',
  standalone: true,
   imports: [
      CommonModule,
      RouterModule,
      FormsModule
    ],
  templateUrl: './auditoria-list.component.html',
  styleUrl: './auditoria-list.component.css'
})
export class AuditoriaListComponent implements OnInit{

  listado: EventoAuditoria[] = []
  auditoriasFiltradas: EventoAuditoria[] = []
  loading: boolean = false;
  filtroFecha: string = ''; // formato YYYY-MM-DD
  filtroUsuario: string = '';
  usuarios = ['Sistema','jmartinez','profeveckos']

  constructor(private auditoriaService: AuditoriaService,
    private notificationService: NotificacionService,
  ){}

  ngOnInit(){
    this.auditoriaService.getAll().subscribe({
      next: (data) => {
        this.listado = data;
        this.auditoriasFiltradas = data;
        this.loading = false;
        console.log(data)
      },
      error: (error) => {
        console.error('Error al cargar auditoria:', error);
        this.notificationService.error('Error al cargar auditoria');
        this.loading = false;
      }
    })
  }

  formatearFecha(date: Date): string {
    const datePipe = new DatePipe('es-ES');
    return datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss') || '';
  }

  filtrar() {
    this.auditoriasFiltradas = this.listado.filter(listado => {
      const coincideFecha = this.filtroFecha
        ? new Date(listado.fecha).toISOString().startsWith(this.filtroFecha)
        : true;

      const coincideUsuario = this.filtroUsuario
        ? listado.usuario === this.filtroUsuario
        : true;

      return coincideFecha && coincideUsuario;
    });
  }
}

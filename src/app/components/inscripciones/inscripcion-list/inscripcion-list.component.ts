import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { InscripcionService } from '../../../services/inscripcion.service';
import { DayOfWeek, EstadoInscripcion, EstadoPago, InscripcionInfoDto } from '../../../models';
import { NotificacionService } from '../../../services/notification.service';

@Component({
  selector: 'app-inscripcion-list',
  templateUrl: './inscripcion-list.component.html',
  styleUrls: ['./inscripcion-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ]
})
export class InscripcionListComponent implements OnInit {
  inscripciones:InscripcionInfoDto[] = [];
  inscripcionesFiltradas: InscripcionInfoDto[] = [];
  loading = false;
  filtroEstado: string = 'TODOS';
  filtroBusqueda: string = '';
  
  // Mapeos para UI
  estadoPagoClasses: { [key: string]: string } = {
    [EstadoPago.PAGA]: 'bg-green-100 text-green-800',
    [EstadoPago.PENDIENTE]: 'bg-blue-100 text-blue-800'
  };

  estadoInscripcionClasses: { [key: string]: string } = {
    [EstadoInscripcion.EN_CURSO]: 'bg-green-100 text-green-800',
    [EstadoInscripcion.COMPLETADA]: 'bg-blue-100 text-blue-800'
  };

  constructor(
    private inscripcionService: InscripcionService,
    private router: Router,
    private notificationService: NotificacionService
  ) { }

  ngOnInit(): void {
    this.cargarInscripciones();
  }

  cargarInscripciones(): void {
    this.loading = true;
    this.inscripcionService.getAll().subscribe({
      next: (inscripciones) => {
        this.inscripciones = inscripciones;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar inscripciones:', error);
        this.notificationService.exito('Error al cargar inscripciones');
        this.aplicarFiltros()
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    // Primero aplicamos filtro por estado
    let inscripcionesFiltradas = this.inscripciones;
    
    if (this.filtroEstado !== 'TODOS') {
      inscripcionesFiltradas = inscripcionesFiltradas.filter(
        inscripcion => inscripcion.estadoInscripcion === this.filtroEstado
      );
    }
    
    // Luego aplicamos filtro de búsqueda
    if (this.filtroBusqueda.trim()) {
      const terminoBusqueda = this.filtroBusqueda.toLowerCase().trim();
      inscripcionesFiltradas = inscripcionesFiltradas.filter(
        inscripcion => 
          inscripcion.nombreUsuario.toLowerCase().includes(terminoBusqueda) ||
          inscripcion.apellidoUsuario.toLowerCase().includes(terminoBusqueda) ||
          inscripcion.nombrePlan.toLowerCase().includes(terminoBusqueda)
      );
    }
    
    this.inscripcionesFiltradas = inscripcionesFiltradas;
  }

  cambiarFiltroEstado(estado: string): void {
    this.filtroEstado = estado;
    this.aplicarFiltros();
  }

  buscar(): void {
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.filtroEstado = 'TODOS';
    this.filtroBusqueda = '';
    this.aplicarFiltros();
  }

  verDetalles(id: number): void {
    this.router.navigate(['/inscripciones', id]);
  }

  nuevaInscripcion(): void {
    this.router.navigate(['/inscripciones/nuevo']);
  }

  renovarInscripcion(id: number, event: Event): void {
    event.stopPropagation();
    this.loading = true;
    
    this.inscripcionService.renovar(id).subscribe({
      next: () => {
        this.notificationService.exito('Inscripción renovada con éxito');
        this.cargarInscripciones();
      },
      error: (error) => {
        console.error('Error al renovar inscripción:', error);
        this.notificationService.error('Error al renovar inscripción');
        this.loading = false;
      }
    });
  }

  cancelarInscripcion(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Está seguro que desea cancelar esta inscripción?')) {
      this.loading = true;
      
      this.inscripcionService.delete(id).subscribe({
        next: () => {
          this.notificationService.exito('Inscripción cancelada con éxito');
          this.cargarInscripciones();
        },
        error: (error) => {
          console.error('Error al cancelar inscripción:', error);
          this.notificationService.error('Error al cancelar inscripción');
          this.loading = false;
        }
      });
    }
  }

  actualizarEstadosPagos(): void {
    this.loading = true;
    
    this.inscripcionService.actualizarEstadosPagos().subscribe({
      next: () => {
        this.notificationService.exito('Estados de pago actualizados con éxito');
        this.cargarInscripciones();
      },
      error: (error) => {
        console.error('Error al actualizar estados de pago:', error);
        this.notificationService.error('Error al actualizar estados de pago');
        this.loading = false;
      }
    });
  }

  getDiasRestantes(fechaFin: string | Date): number {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    hoy.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    
    // Diferencia en milisegundos
    const diferencia = fin.getTime() - hoy.getTime();
    
    // Convertir a días y redondear
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }
  
  getFechaFormateada(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString();
  }
}
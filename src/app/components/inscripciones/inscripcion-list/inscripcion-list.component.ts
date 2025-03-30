import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InscripcionService } from '../../../services/inscripcion.service';
import { DayOfWeek, EstadoPago, InscripcionInfoDto } from '../../../models';

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
    [EstadoPago.ACTIVO]: 'bg-green-100 text-green-800',
    [EstadoPago.INACTIVO]: 'bg-red-100 text-red-800',
    [EstadoPago.PROXIMO_A_VENCER]: 'bg-yellow-100 text-yellow-800',
    [EstadoPago.PENDIENTE]: 'bg-blue-100 text-blue-800'
  };

  constructor(
    private inscripcionService: InscripcionService,
    private router: Router,
    private snackBar: MatSnackBar
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
        this.snackBar.open('Error al cargar inscripciones', 'Cerrar', {
          duration: 5000
        });
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
        inscripcion => inscripcion.estadoPago === this.filtroEstado
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
        this.snackBar.open('Inscripción renovada con éxito', 'Cerrar', {
          duration: 3000
        });
        this.cargarInscripciones();
      },
      error: (error) => {
        console.error('Error al renovar inscripción:', error);
        this.snackBar.open('Error al renovar inscripción', 'Cerrar', {
          duration: 5000
        });
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
          this.snackBar.open('Inscripción cancelada con éxito', 'Cerrar', {
            duration: 3000
          });
          this.cargarInscripciones();
        },
        error: (error) => {
          console.error('Error al cancelar inscripción:', error);
          this.snackBar.open('Error al cancelar inscripción', 'Cerrar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    }
  }

  actualizarEstadosPagos(): void {
    this.loading = true;
    
    this.inscripcionService.actualizarEstadosPagos().subscribe({
      next: () => {
        this.snackBar.open('Estados de pago actualizados con éxito', 'Cerrar', {
          duration: 3000
        });
        this.cargarInscripciones();
      },
      error: (error) => {
        console.error('Error al actualizar estados de pago:', error);
        this.snackBar.open('Error al actualizar estados de pago', 'Cerrar', {
          duration: 5000
        });
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
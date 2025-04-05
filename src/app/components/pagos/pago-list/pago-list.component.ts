import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PagoService } from '../../../services/pago.service';
import { PagoInfoDto, MetodoPago } from '../../../models';
import { NotificacionService } from '../../../services/notification.service';

@Component({
  selector: 'app-pago-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './pago-list.component.html',
  styleUrls: ['./pago-list.component.css']
})
export class PagoListComponent implements OnInit {
  pagos: PagoInfoDto[] = [];
  pagosFiltrados: PagoInfoDto[] = [];
  loading = false;
  
  // Filtros
  fechaInicio: string = this.getPrimerDiaMes();
  fechaFin: string = new Date().toISOString().split('T')[0];
  metodoPagoFiltro: string = 'TODOS';
  
  // Valores para filtro de métodos de pago
  metodosPago = ['TODOS', ...Object.values(MetodoPago)];

  constructor(
    private pagoService: PagoService,
    private router: Router,
    private notificationService: NotificacionService
  ) { }

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.loading = true;
    
    // Si tenemos filtros aplicados por fecha, usamos getByPeriodo
    if (this.fechaInicio && this.fechaFin) {
      this.pagoService.getByPeriodo(this.fechaInicio, this.fechaFin).subscribe({
        next: (pagos) => {
          this.pagos = pagos;
          this.aplicarFiltros();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar pagos por periodo:', error);
          this.notificationService.error('Error al cargar pagos');
          this.loading = false;
        }
      });
    } else {
      // Si no hay filtros de fecha, obtenemos todos los pagos
      this.pagoService.getAll().subscribe({
        next: (pagos) => {
          this.pagos = pagos;
          this.aplicarFiltros();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar pagos:', error);
          this.notificationService.error('Error al cargar pagos');
          this.loading = false;
        }
      });
    }
  }

  aplicarFiltros(): void {
    let resultado = [...this.pagos];
    
    // Filtrar por método de pago si hay alguno seleccionado
    if (this.metodoPagoFiltro !== 'TODOS') {
      resultado = resultado.filter(pago => pago.metodoPago === this.metodoPagoFiltro);
    }
    
    this.pagosFiltrados = resultado;
  }

  buscarPagos(): void {
    // Validar fechas
    if (!this.fechaInicio || !this.fechaFin) {
      this.notificationService.advertencia('Por favor ingrese fechas válidas');
      return;
    }
    
    // Validar que fecha inicio sea menor o igual a fecha fin
    if (this.fechaInicio > this.fechaFin) {
      this.notificationService.advertencia('La fecha de inicio debe ser menor o igual a la fecha de fin');
      return;
    }
    
    this.cargarPagos();
  }

  limpiarFiltros(): void {
    this.fechaInicio = this.getPrimerDiaMes();
    this.fechaFin = new Date().toISOString().split('T')[0];
    this.metodoPagoFiltro = 'TODOS';
    this.cargarPagos();
  }

  nuevoPago(): void {
    this.router.navigate(['/pagos/nuevo']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/pagos', id]);
  }

  formatFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString();
  }

  // Método para obtener el primer día del mes actual en formato ISO (YYYY-MM-DD)
  private getPrimerDiaMes(): string {
    const fecha = new Date();
    fecha.setDate(1);
    return fecha.toISOString().split('T')[0];
  }

  getTotalPagos(): number {
    return this.pagosFiltrados.reduce((total, pago) => total + pago.monto, 0);
  }
}
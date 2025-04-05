import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InscripcionService } from '../../../services/inscripcion.service';
import { PagoService } from '../../../services/pago.service';
import { InscripcionInfoDto, EstadoPago, PagoInfoDto } from '../../../models';
import { NotificacionService } from '../../../services/notification.service';

@Component({
  selector: 'app-inscripcion-detalle',
  templateUrl: './inscripcion-detalle.component.html',
  styleUrls: ['./inscripcion-detalle.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class InscripcionDetalleComponent implements OnInit {
  inscripcionId!: number;
  inscripcion?: InscripcionInfoDto;
  pagos: PagoInfoDto[] = [];
  loading = false;
  
  // Mapeos para UI
  estadoPagoClasses: { [key: string]: string } = {
    [EstadoPago.ACTIVO]: 'bg-green-100 text-green-800',
    [EstadoPago.INACTIVO]: 'bg-red-100 text-red-800',
    [EstadoPago.PROXIMO_A_VENCER]: 'bg-yellow-100 text-yellow-800',
    [EstadoPago.PENDIENTE]: 'bg-blue-100 text-blue-800'
  };
  
  nombresDias: { [key: string]: string } = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes',
    'SATURDAY': 'Sábado',
    'SUNDAY': 'Domingo'
  };

  constructor(
    private inscripcionService: InscripcionService,
    private pagoService: PagoService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificacionService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.inscripcionId = +params['id'];
      this.loadInscripcion();
      this.loadPagos();
    });
  }

  loadInscripcion(): void {
    this.loading = true;
    this.inscripcionService.getById(this.inscripcionId).subscribe({
      next: (inscripcion) => {
        this.inscripcion = inscripcion;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar inscripción:', error);
        this.notificationService.error('Error al cargar inscripción');
        this.loading = false;
        this.router.navigate(['/inscripciones']);
      }
    });
  }

  loadPagos(): void {
    this.pagoService.getByInscripcionId(this.inscripcionId).subscribe({
      next: (pagos) => {
        this.pagos = pagos;
      },
      error: (error) => {
        console.error('Error al cargar pagos:', error);
      }
    });
  }

  renovarInscripcion(): void {
    this.router.navigate(['/inscripciones', this.inscripcionId, 'renovar']);
  }

  registrarPago(): void {
    this.router.navigate(['/pagos/nuevo'], { 
      queryParams: { 
        inscripcionId: this.inscripcionId,
        usuarioId: this.inscripcion?.usuarioId
      } 
    });
  }

  cancelarInscripcion(): void {
    if (confirm('¿Está seguro que desea cancelar esta inscripción?')) {
      this.loading = true;
      
      this.inscripcionService.delete(this.inscripcionId).subscribe({
        next: () => {
          this.notificationService.exito('Inscripción cancelada con éxito');
          this.router.navigate(['/inscripciones']);
        },
        error: (error) => {
          console.error('Error al cancelar inscripción:', error);
          this.notificationService.error('Error al cancelar inscripción');
          this.loading = false;
        }
      });
    }
  }

  verUsuario(): void {
    if (this.inscripcion?.usuarioId) {
      this.router.navigate(['/usuarios', this.inscripcion.usuarioId]);
    }
  }

  getDiasRestantes(): number {
    if (!this.inscripcion?.fechaFin) return 0;
    
    const hoy = new Date();
    const fin = new Date(this.inscripcion.fechaFin);
    hoy.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    
    // Diferencia en milisegundos
    const diferencia = fin.getTime() - hoy.getTime();
    
    // Convertir a días y redondear
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }
  
  getFechaFormateada(fecha?: string | Date): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString();
  }
  
  getTotalPagado(): number {
    return this.pagos.reduce((total, pago) => total + pago.monto, 0);
  }

  formatHora(hora: string): string {
    return hora.substring(0, 5); // Format from "00:00:00" to "00:00"
  }
}
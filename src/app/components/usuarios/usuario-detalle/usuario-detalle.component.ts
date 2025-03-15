import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { UsuarioService } from '../../../services/usuario.service';
import { InscripcionService } from '../../../services/inscripcion.service';
import { AsistenciaService } from '../../../services/asistencia.service';
import { PagoService } from '../../../services/pago.service';
import { 
  EstadoUsuario, 
  UsuarioDetalleDto, 
  EstadoPago, 
  AsistenciaInfoDto,
  PagoInfoDto,
  InscripcionInfoDto
} from '../../../models';

@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.component.html',
  styleUrls: ['./usuario-detalle.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule
  ]
})
export class UsuarioDetalleComponent implements OnInit {
  usuarioId!: number;
  usuario?: UsuarioDetalleDto;
  loading = false;
  pagosRecientes: PagoInfoDto[] = [];
  asistenciasRecientes: AsistenciaInfoDto[] = [];
  
  // Mapeos para UI
  estadoClasses: { [key: string]: string } = {
    [EstadoUsuario.ACTIVO]: 'bg-green-100 text-green-800',
    [EstadoUsuario.INACTIVO]: 'bg-red-100 text-red-800',
    [EstadoUsuario.PENDIENTE]: 'bg-yellow-100 text-yellow-800'
  };
  
  estadoPagoClasses: { [key: string]: string } = {
    [EstadoPago.ACTIVO]: 'bg-green-100 text-green-800',
    [EstadoPago.INACTIVO]: 'bg-red-100 text-red-800',
    [EstadoPago.PROXIMO_A_VENCER]: 'bg-yellow-100 text-yellow-800',
    [EstadoPago.RESERVADO]: 'bg-blue-100 text-blue-800'
  };

  constructor(
    private usuarioService: UsuarioService,
    private inscripcionService: InscripcionService,
    private asistenciaService: AsistenciaService,
    private pagoService: PagoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.usuarioId = +params['id'];
      this.loadUsuario();
    });
  }

  loadUsuario(): void {
    this.loading = true;
    this.usuarioService.getById(this.usuarioId).subscribe({
      next: (usuario: any) => {
        // Algunos backends devuelven un formato específico para la vista detalle
        // Si necesitas adaptar el formato del backend, hazlo aquí
        this.usuario = usuario as UsuarioDetalleDto;
        this.loading = false;
        
        // Cargar datos adicionales
        this.loadAsistenciasRecientes();
        this.loadPagosRecientes();
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.snackBar.open('Error al cargar datos del usuario', 'Cerrar', {
          duration: 5000
        });
        this.loading = false;
        this.router.navigate(['/usuarios']);
      }
    });
  }

  loadAsistenciasRecientes(): void {
    // Obtener último mes
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    
    this.asistenciaService.getByUsuarioIdAndFecha(
      this.usuarioId, 
      fechaInicio.toISOString().split('T')[0], 
      fechaFin.toISOString().split('T')[0]
    ).subscribe({
      next: (asistencias) => {
        this.asistenciasRecientes = asistencias;
      },
      error: (error) => {
        console.error('Error al cargar asistencias:', error);
      }
    });
  }

  loadPagosRecientes(): void {
    this.pagoService.getByUsuarioId(this.usuarioId).subscribe({
      next: (pagos) => {
        this.pagosRecientes = pagos.slice(0, 5); // Solo los 5 más recientes
      },
      error: (error) => {
        console.error('Error al cargar pagos:', error);
      }
    });
  }

  editarUsuario(): void {
    this.router.navigate(['/usuarios', this.usuarioId, 'editar']);
  }

  nuevaInscripcion(): void {
    this.router.navigate(['/inscripciones/nuevo'], { 
      queryParams: { usuarioId: this.usuarioId } 
    });
  }

  renovarInscripcion(inscripcionId: number): void {
    this.inscripcionService.renovar(inscripcionId).subscribe({
      next: () => {
        this.snackBar.open('Inscripción renovada con éxito', 'Cerrar', {
          duration: 3000
        });
        this.loadUsuario(); // Recargar para ver cambios
      },
      error: (error) => {
        console.error('Error al renovar inscripción:', error);
        this.snackBar.open('Error al renovar inscripción', 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  registrarPago(): void {
    if (!this.usuario?.inscripcionActiva?.id) {
      this.snackBar.open('El usuario no tiene una inscripción activa', 'Cerrar', {
        duration: 5000
      });
      return;
    }
    
    this.router.navigate(['/pagos/nuevo'], { 
      queryParams: { 
        inscripcionId: this.usuario.inscripcionActiva.id,
        usuarioId: this.usuarioId
      } 
    });
  }

  getFechaFormateada(fecha: string | Date | undefined): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString();
  }

  calcularPorcentajeAsistencia(): number {
    const presentes = this.asistenciasRecientes.filter(a => a.presente).length;
    return this.asistenciasRecientes.length > 0 
      ? (presentes / this.asistenciasRecientes.length) * 100 
      : 0;
  }

  getDiasRestantes(fechaFin?: string | Date): number {
    if (!fechaFin) return 0;
    
    const hoy = new Date();
    const fin = new Date(fechaFin);
    hoy.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    
    // Diferencia en milisegundos
    const diferencia = fin.getTime() - hoy.getTime();
    
    // Convertir a días y redondear
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }
  
  getTotalPagado(): number {
    return this.pagosRecientes.reduce((total, pago) => total + pago.monto, 0);
  }
}
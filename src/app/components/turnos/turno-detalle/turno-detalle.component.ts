import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TurnoService } from '../../../services/turno.service';
import { TurnoDto, UsuarioInfoDto, TurnoConUsuariosDto, DayOfWeek } from '../../../models';
import { NotificacionService } from '../../../services/notification.service';

@Component({
  selector: 'app-turno-detalle',
  templateUrl: './turno-detalle.component.html',
  styleUrls: ['./turno-detalle.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ]
})
export class TurnoDetalleComponent implements OnInit {
  turnoId!: number;
  turno?: TurnoDto;
  usuariosAsignados: UsuarioInfoDto[] = [];
  loading = false;
  
  // Para traducir los enum a español
  diasSemana: { [key: string]: string } = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes',
    'SATURDAY': 'Sábado',
    'SUNDAY': 'Domingo'
  };

  constructor(
    private turnoService: TurnoService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificacionService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.turnoId = +params['id'];
      this.loadTurno();
    });
  }

  loadTurno(): void {
    this.loading = true;
    this.turnoService.getById(this.turnoId).subscribe({
      next: (turno) => {
        this.turno = turno;
        this.loadUsuariosAsignados(turno.diaSemana);
      },
      error: (error) => {
        console.error('Error al cargar turno:', error);
        this.notificationService.error('Error al cargar datos del turno');
        this.loading = false;
        this.router.navigate(['/turnos']);
      }
    });
  }

  loadUsuariosAsignados(diaSemana: DayOfWeek): void {
    this.turnoService.getConUsuariosByDiaSemana(diaSemana).subscribe({
      next: (turnos: any) => {
        // Buscar el turno actual y obtener sus usuarios asignados
        const turnoConUsuarios = turnos.find((t: any) => t.id === this.turnoId);
        if (turnoConUsuarios && turnoConUsuarios.usuarios) {
          this.usuariosAsignados = turnoConUsuarios.usuarios;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios asignados:', error);
        this.notificationService.error('Error al cargar usuarios asignados al turno');
        this.loading = false;
      }
    });
  }

  editarTurno(): void {
    this.router.navigate(['/turnos', this.turnoId, 'editar']);
  }

  eliminarTurno(): void {
    if (confirm('¿Está seguro de que desea eliminar este turno?')) {
      this.loading = true;
      this.turnoService.delete(this.turnoId).subscribe({
        next: () => {
          this.notificationService.exito('Turno eliminado correctamente');
          this.router.navigate(['/turnos']);
        },
        error: (error) => {
          console.error('Error al eliminar turno:', error);
          this.notificationService.error('Error al eliminar turno. Es posible que tenga inscripciones o clases asociadas.');
          this.loading = false;
        }
      });
    }
  }

  verUsuario(usuarioId: number): void {
    this.router.navigate(['/usuarios', usuarioId]);
  }

  formatHora(hora?: string): string {
    if (!hora) return 'N/A';
    return hora.substring(0, 5); // Format from "00:00:00" to "00:00"
  }
}
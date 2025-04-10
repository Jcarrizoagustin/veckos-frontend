import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TurnoService } from '../../../services/turno.service';
import { DayOfWeek, TurnoDto } from '../../../models';
import { NotificacionService } from '../../../services/notification.service';

@Component({
  selector: 'app-turno-list',
  templateUrl: './turno-list.component.html',
  styleUrls: ['./turno-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class TurnoListComponent implements OnInit {
  turnos: TurnoDto[] = [];
  filteredTurnos: TurnoDto[] = [];
  diaSemanaFilter: DayOfWeek | 'TODOS' = 'TODOS';
  loading = false;

  // Para traducir los enum a español
  diasSemana: { [key: string]: string } = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes'
  };

  daysOfWeek: DayOfWeek[] = [DayOfWeek.MONDAY,DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY]

  constructor(
    private turnoService: TurnoService,
    private router: Router,
    private notificationService: NotificacionService
  ) { }

  ngOnInit(): void {
    this.loadTurnos();
  }

  loadTurnos(): void {
    this.loading = true;
    this.turnoService.getAll().subscribe({
      next: (data) => {
        this.turnos = data;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar turnos:', error);
        this.notificationService.error('Error al cargar turnos');
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    if (this.diaSemanaFilter === 'TODOS') {
      this.filteredTurnos = [...this.turnos];
      return;
    }

    this.filteredTurnos = this.turnos.filter(
      turno => turno.diaSemana === this.diaSemanaFilter
    );
  }

  filtrarPorDia(dia: DayOfWeek | 'TODOS'): void {
    this.diaSemanaFilter = dia;
    this.aplicarFiltros();
  }

  nuevoTurno(): void {
    this.router.navigate(['/turnos/nuevo']);
  }

  editarTurno(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/turnos', id, 'editar']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/turnos', id]);
  }

  eliminarTurno(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Está seguro de que desea eliminar este turno?')) {
      this.loading = true;
      this.turnoService.delete(id).subscribe({
        next: () => {
          this.notificationService.exito('Turno eliminado correctamente');
          this.loadTurnos();
        },
        error: (error) => {
          console.error('Error al eliminar turno:', error);
          this.notificationService.error('Error al eliminar turno. Es posible que tenga inscripciones o clases asociadas.');
          this.loading = false;
        }
      });
    }
  }

  formatHora(hora: string): string {
    return hora.substring(0, 5); // Format from "00:00:00" to "00:00"
  }
}
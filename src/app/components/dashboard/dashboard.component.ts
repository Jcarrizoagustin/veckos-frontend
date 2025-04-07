import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
import { TurnoService } from '../../services/turno.service';
import { DayOfWeek, EstadoPago, TurnoDto } from '../../models';
import { NotificacionService } from '../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class DashboardComponent implements OnInit {
  diaSemanaMock: DayOfWeek[] = [DayOfWeek.MONDAY,DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY]
  loading = true;
  stats: any = {};
  diaSemanaActual: DayOfWeek = this.getDiaSemanaActual();
  turnos: any[] = [];
  
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

  // Para mapear estados a colores de Tailwind
  estadoClasses: { [key: string]: string } = {
    [EstadoPago.PAGA]: 'bg-green-100 text-green-800 border-green-200',
    [EstadoPago.PENDIENTE]: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  constructor(
    private reporteService: ReporteService,
    private turnoService: TurnoService,
    private notificationService: NotificacionService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Cargar estadísticas del dashboard
    this.reporteService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.notificationService.error('Error al cargar estadísticas del dashboard');
        this.loading = false;
      }
    });

    // Cargar turnos para el día actual
    this.loadTurnosByDiaSemana(this.diaSemanaActual);
  }

  loadTurnosByDiaSemana(diaSemana: DayOfWeek): void {
    this.loading = true;
    this.diaSemanaActual = diaSemana;

    this.turnoService.getConUsuariosByDiaSemana(diaSemana).subscribe({
      next: (data: any) => {
        this.turnos = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar turnos:', error);
        this.notificationService.error('Error al cargar turnos');
        this.loading = false;
      }
    });
  }

  private getDiaSemanaActual(): DayOfWeek {
    const day = new Date().getDay();
    // Convertir de 0-6 (domingo-sábado) a DayOfWeek
    const daysMapping: { [key: number]: DayOfWeek } = {
      0: DayOfWeek.SUNDAY,
      1: DayOfWeek.MONDAY,
      2: DayOfWeek.TUESDAY,
      3: DayOfWeek.WEDNESDAY,
      4: DayOfWeek.THURSDAY,
      5: DayOfWeek.FRIDAY,
      6: DayOfWeek.SATURDAY
    };
    return daysMapping[day];
  }

  formatHora(hora: string): string {
    return hora.substring(0, 5); // Format from "00:00:00" to "00:00"
  }
}

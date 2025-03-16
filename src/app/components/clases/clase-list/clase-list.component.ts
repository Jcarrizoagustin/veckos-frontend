import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClaseService } from '../../../services/clase.service';
import { ClaseInfoDto, DayOfWeek } from '../../../models';

@Component({
  selector: 'app-clase-list',
  templateUrl: './clase-list.component.html',
  styleUrls: ['./clase-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class ClaseListComponent implements OnInit {
  clases: ClaseInfoDto[] = [];
  filteredClases: ClaseInfoDto[] = [];
  fechaSeleccionada: Date = new Date(); // Por defecto, fecha actual
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
    private claseService: ClaseService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cargarClasesPorFecha(this.fechaSeleccionada);
  }

  formatFecha(fecha: string | Date): string {
    const date = new Date(fecha);
    return date.toLocaleDateString();
  }
  
  formatHora(hora: string): string {
    return hora.substring(0, 5); // Format from "00:00:00" to "00:00"
  }

  getDiaSemana(fecha: Date): DayOfWeek {
    const day = fecha.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    // Convertir a nuestro enum DayOfWeek
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

  cargarClasesPorFecha(fecha: Date): void {
    this.loading = true;
    
    // Formatear la fecha a string YYYY-MM-DD
    const fechaStr = fecha.toISOString().split('T')[0];
    
    this.claseService.getByFecha(fechaStr).subscribe({
      next: (data) => {
        this.clases = data;
        this.filteredClases = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar clases:', error);
        this.snackBar.open('Error al cargar clases', 'Cerrar', {
          duration: 5000
        });
        this.loading = false;
      }
    });
  }

  onFechaChange(event: any): void {
    this.fechaSeleccionada = event.value;
    this.cargarClasesPorFecha(this.fechaSeleccionada);
  }

  verAsistencias(claseId: number): void {
    this.router.navigate(['/clases', claseId, 'asistencias']);
  }

  getClaseEstado(clase: ClaseInfoDto): string {
    if (clase.cantidadAsistencias === 0) {
      return 'Sin alumnos';
    }
    
    const porcentajePresentes = (clase.cantidadPresentes / clase.cantidadAsistencias) * 100;
    
    if (porcentajePresentes === 0) {
      return '0% asistencia';
    } else if (porcentajePresentes < 50) {
      return `${Math.round(porcentajePresentes)}% asistencia (Baja)`;
    } else if (porcentajePresentes < 80) {
      return `${Math.round(porcentajePresentes)}% asistencia (Media)`;
    } else {
      return `${Math.round(porcentajePresentes)}% asistencia (Alta)`;
    }
  }

  getEstadoClasse(porcentaje: number): string {
    if (porcentaje === 0) {
      return 'bg-gray-100 text-gray-800';
    } else if (porcentaje < 50) {
      return 'bg-red-100 text-red-800';
    } else if (porcentaje < 80) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  }
}
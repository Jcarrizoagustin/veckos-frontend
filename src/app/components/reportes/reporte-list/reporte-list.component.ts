import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reporte-list',
  templateUrl: './reporte-list.component.html',
  styleUrls: ['./reporte-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class ReporteListComponent {
  reportes = [
    {
      id: 'asistencia',
      titulo: 'Reporte de Asistencia',
      descripcion: 'Visualiza la asistencia de los alumnos por período, turno o usuario específico.',
      icono: 'event_available',
      ruta: '/reportes/asistencia'
    },
    {
      id: 'financiero',
      titulo: 'Reporte Financiero',
      descripcion: 'Analiza los ingresos por período, método de pago y plan.',
      icono: 'payments',
      ruta: '/reportes/financiero'
    }/** ,
    {
      id: 'inscripciones',
      titulo: 'Reporte de Inscripciones',
      descripcion: 'Revisa las estadísticas de inscripciones, renovaciones y distribución por plan.',
      icono: 'how_to_reg',
      ruta: '/reportes/inscripciones'
    }*/
  ];

  constructor(private router: Router) {}

  navegarAReporte(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
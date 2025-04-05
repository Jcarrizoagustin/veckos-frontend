import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReporteService } from '../../../services/reporte.service';
import { NotificacionService } from '../../../services/notification.service';

@Component({
  selector: 'app-reporte-inscripciones',
  templateUrl: './reporte-inscripciones.component.html',
  styleUrls: ['./reporte-inscripciones.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class ReporteInscripcionesComponent implements OnInit {
  filtrosForm!: FormGroup;
  reporte: any = null;
  loading = false;
  maxDate = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private reporteService: ReporteService,
    private notificationService: NotificacionService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.filtrosForm = this.formBuilder.group({
      fechaInicio: [this.getPrimerDiaMes(), Validators.required],
      fechaFin: [new Date(), Validators.required]
    });
  }

  generarReporte(): void {
    if (this.filtrosForm.invalid) {
      this.markFormGroupTouched(this.filtrosForm);
      return;
    }

    this.loading = true;
    const formValues = this.filtrosForm.value;
    
    this.reporteService.generarReporteInscripciones(
      this.formatDate(formValues.fechaInicio),
      this.formatDate(formValues.fechaFin)
    ).subscribe({
      next: (data) => {
        this.reporte = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al generar reporte:', error);
        this.notificationService.error('Error al generar reporte de inscripciones');
        this.loading = false;
      }
    });
  }

  exportarPDF(): void {
    this.notificationService.info('Exportación a PDF no implementada en esta versión');
  }

  exportarExcel(): void {
    this.notificationService.info('Exportación a Excel no implementada en esta versión');
  }

  // Helpers
  getPrimerDiaMes(): Date {
    const date = new Date();
    date.setDate(1);
    return date;
  }

  formatDate(date: any): string {
    // Verificar si es string
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    
    // Si es un objeto Date
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    
    // Si no es ninguno de los anteriores
    return '';
  }

  getPorcentaje(valor: number, total: number): number {
    return total > 0 ? (valor / total) * 100 : 0;
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

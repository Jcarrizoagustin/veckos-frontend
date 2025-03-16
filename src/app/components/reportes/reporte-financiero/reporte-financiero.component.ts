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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReporteService } from '../../../services/reporte.service';

@Component({
  selector: 'app-reporte-financiero',
  templateUrl: './reporte-financiero.component.html',
  styleUrls: ['./reporte-financiero.component.css'],
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
    MatNativeDateModule,
    MatCheckboxModule,
    MatTabsModule
  ]
})
export class ReporteFinancieroComponent implements OnInit {
  filtrosForm!: FormGroup;
  reporte: any = null;
  loading = false;
  maxDate = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private reporteService: ReporteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.filtrosForm = this.formBuilder.group({
      fechaInicio: [this.getPrimerDiaMes(), Validators.required],
      fechaFin: [new Date(), Validators.required],
      agruparPorMes: [true],
      agruparPorMetodoPago: [true]
    });
  }

  generarReporte(): void {
    if (this.filtrosForm.invalid) {
      this.markFormGroupTouched(this.filtrosForm);
      return;
    }

    this.loading = true;
    const formValues = this.filtrosForm.value;
    
    this.reporteService.generarReporteFinanciero(
      this.formatDate(formValues.fechaInicio),
      this.formatDate(formValues.fechaFin),
      formValues.agruparPorMes,
      formValues.agruparPorMetodoPago
    ).subscribe({
      next: (data) => {
        this.reporte = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al generar reporte:', error);
        this.snackBar.open('Error al generar reporte financiero', 'Cerrar', {
          duration: 5000
        });
        this.loading = false;
      }
    });
  }

  exportarPDF(): void {
    this.snackBar.open('Exportación a PDF no implementada en esta versión', 'Cerrar', {
      duration: 3000
    });
  }

  exportarExcel(): void {
    this.snackBar.open('Exportación a Excel no implementada en esta versión', 'Cerrar', {
      duration: 3000
    });
  }

  // Helpers
  getPrimerDiaMes(): Date {
    const date = new Date();
    date.setDate(1);
    return date;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
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
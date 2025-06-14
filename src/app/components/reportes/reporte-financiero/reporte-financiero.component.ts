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
import { ReporteService } from '../../../services/reporte.service';
import { ExportarReporteService } from '../../../services/exportar-reporte.service';
import { NotificacionService } from '../../../services/notification.service';
import { CuentaDto } from '../../../models';
import { CuentaService } from '../../../services/cuenta.service';

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
  cuentas: CuentaDto[] = [];
  loadingCuentas: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private reporteService: ReporteService,
    private notificationService: NotificacionService,
    private exportarReporteService: ExportarReporteService,
    private cuentasService: CuentaService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.cargarCuentas();
  }

  initForm(): void {
    this.filtrosForm = this.formBuilder.group({
      fechaInicio: [this.getPrimerDiaMes(), Validators.required],
      fechaFin: [new Date(), Validators.required],
      agruparPorMes: [true],
      agruparPorMetodoPago: [true],
      cuentaId:[''],
    });
  }

  cargarCuentas(): void {
    this.loadingCuentas = true;
    this.cuentasService.getAll().subscribe({
      next: (cuentas) => {
        this.cuentas = cuentas;
        this.loadingCuentas = false;
      },
      error: (error) => {
        console.error('Error al cargar Cuentas:', error);
        this.notificationService.error('Error al cargar las cuentas');
        this.loadingCuentas = false;
      }
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
      formValues.agruparPorMetodoPago,
      formValues.cuentaId
    ).subscribe({
      next: (data) => {
        this.reporte = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al generar reporte:', error);
        this.notificationService.error('Error al generar reporte financiero');
        this.loading = false;
      }
    });
  }

  exportarPDF(): void {
    this.notificationService.info('Exportación a PDF no implementada en esta versión');
  }

  /*exportarExcel(): void {
    this.notificationService.exito('Exportación a Excel no implementada en esta versión', 'Cerrar', {
      duration: 3000
    });
  }*/

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

  formatFecha(fecha: string | Date | undefined): string {
    if (!fecha) return 'N/A';
  
    if (typeof fecha === 'string') {
      const [fechaParte] = fecha.split('T'); // "2025-04-19"
      const [year, month, day] = fechaParte.split('-');
      return `${day}/${month}/${year}`;
    }
  
    return fecha.toLocaleDateString('es-AR');
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

  // Reportes export
  /*exportarExcel(): void {
    this.exportarReporteService.exportarPagosExcel().subscribe(blob => {
      this.descargarArchivo(blob, 'pagos.xlsx');
    });
  }*/
  
  exportarExcelPorPeriodo(): void {
    const formValues = this.filtrosForm.value;
    let fechaInicio = this.formatDate(formValues.fechaInicio);
    let fechaFin = this.formatDate(formValues.fechaFin);
    let cuentaId = this.formatDate(formValues.cuentaId);
    this.exportarReporteService.exportarReportePorPeriodoExcel(fechaInicio, fechaFin,cuentaId).subscribe(blob => {
      this.descargarArchivo(blob, `reporteFinanciero_${fechaInicio}_a_${fechaFin}.xlsx`);
    });
  }
  
  private descargarArchivo(data: Blob, nombreArchivo: string): void {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
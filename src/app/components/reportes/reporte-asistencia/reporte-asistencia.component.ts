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
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioListItemDto, ReporteAsistenciaRequestDto } from '../../../models';
import { NotificacionService } from '../../../services/notification.service';

@Component({
  selector: 'app-reporte-asistencia',
  templateUrl: './reporte-asistencia.component.html',
  styleUrls: ['./reporte-asistencia.component.css'],
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
export class ReporteAsistenciaComponent implements OnInit {
  filtrosForm!: FormGroup;
  usuarios: UsuarioListItemDto[] = [];
  reporte: any = null;
  loading = false;
  tipoReporte: 'general' | 'usuario' = 'general';
  maxDate = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private reporteService: ReporteService,
    private usuarioService: UsuarioService,
    private notificationService: NotificacionService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.cargarUsuarios();
  }

  initForm(): void {
    this.filtrosForm = this.formBuilder.group({
      // Filtros comunes
      fechaInicio: [this.getPrimerDiaMes(), Validators.required],
      fechaFin: [new Date(), Validators.required],
      
      // Filtros específicos por tipo de reporte
      tipoReporte: ['general'],
      usuarioId: [null],
      agruparPorDia: [true],
      incluirSoloPresentes: [false]
    });

    // Cuando cambia el tipo de reporte, actualizamos validaciones
    this.filtrosForm.get('tipoReporte')?.valueChanges.subscribe(tipo => {
      this.tipoReporte = tipo;
      
      if (tipo === 'usuario') {
        this.filtrosForm.get('usuarioId')?.setValidators(Validators.required);
      } else {
        this.filtrosForm.get('usuarioId')?.clearValidators();
      }
      
      this.filtrosForm.get('usuarioId')?.updateValueAndValidity();
    });
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.usuarioService.getActivos().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.notificationService.error('Error al cargar usuarios');
        this.loading = false;
      }
    });
  }

  generarReporte(): void {
    console.log("Gemeramdop reprortes")
    if (this.filtrosForm.invalid) {
      this.markFormGroupTouched(this.filtrosForm);
      return;
    }

    this.loading = true;
    const formValues = this.filtrosForm.value;
    
    // Preparar la solicitud de reporte
    const request: ReporteAsistenciaRequestDto = {
      fechaInicio: this.formatDate(formValues.fechaInicio),
      fechaFin: this.formatDate(formValues.fechaFin),
      agruparPorDia: formValues.agruparPorDia
    };
    
    // Añadir parámetros específicos según el tipo de reporte
    if (formValues.tipoReporte === 'usuario') {
      request.usuarioId = formValues.usuarioId;
      request.incluirSoloPresentes = formValues.incluirSoloPresentes;
    }

    this.reporteService.generarReporteAsistencia(request).subscribe({
      next: (data) => {
        this.reporte = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al generar reporte:', error);
        this.notificationService.error('Error al generar reporte de asistencia');
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

  formatFecha(fecha?: string | Date): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString();
  }
  
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Métodos para templates
  getPorcentajeAsistencia(): number {
    if (!this.reporte) return 0;
    
    if (this.tipoReporte === 'usuario') {
      return this.reporte.porcentajeAsistencia || 0;
    } else {
      return this.reporte.porcentajeAsistenciaPromedio || 0;
    }
  }
}
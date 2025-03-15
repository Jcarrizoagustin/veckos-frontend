import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { TurnoService } from '../../../services/turno.service';
import { DayOfWeek, TurnoDto } from '../../../models';

@Component({
  selector: 'app-turno-form',
  templateUrl: './turno-form.component.html',
  styleUrls: ['./turno-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule
  ]
})
export class TurnoFormComponent implements OnInit {
  turnoForm!: FormGroup;
  isEditMode = false;
  turnoId?: number;
  loading = false;

  // Para mostrar los nombres de los días en español
  diasSemana: { value: DayOfWeek, viewValue: string }[] = [
    { value: DayOfWeek.MONDAY, viewValue: 'Lunes' },
    { value: DayOfWeek.TUESDAY, viewValue: 'Martes' },
    { value: DayOfWeek.WEDNESDAY, viewValue: 'Miércoles' },
    { value: DayOfWeek.THURSDAY, viewValue: 'Jueves' },
    { value: DayOfWeek.FRIDAY, viewValue: 'Viernes' },
    { value: DayOfWeek.SATURDAY, viewValue: 'Sábado' },
    { value: DayOfWeek.SUNDAY, viewValue: 'Domingo' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private turnoService: TurnoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Determinar si estamos en modo edición o creación
    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'nuevo') {
        this.isEditMode = true;
        this.turnoId = +params['id'];
        this.loadTurno(this.turnoId);
      }
    });
  }

  initForm(): void {
    this.turnoForm = this.formBuilder.group({
      diaSemana: [null, [Validators.required]],
      hora: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)]],
      descripcion: ['', [Validators.maxLength(200)]]
    });
  }

  loadTurno(id: number): void {
    this.loading = true;
    this.turnoService.getById(id).subscribe({
      next: (turno) => {
        this.turnoForm.patchValue(turno);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar turno:', error);
        this.snackBar.open('Error al cargar datos del turno', 'Cerrar', {
          duration: 5000
        });
        this.loading = false;
        this.router.navigate(['/turnos']);
      }
    });
  }

  onSubmit(): void {
    if (this.turnoForm.invalid) {
      this.markFormGroupTouched(this.turnoForm);
      return;
    }

    this.loading = true;
    const turno: TurnoDto = this.turnoForm.value;

    if (this.isEditMode && this.turnoId) {
      turno.id = this.turnoId;
      this.turnoService.update(this.turnoId, turno).subscribe({
        next: () => {
          this.snackBar.open('Turno actualizado con éxito', 'Cerrar', {
            duration: 3000
          });
          this.loading = false;
          this.router.navigate(['/turnos']);
        },
        error: (error) => {
          console.error('Error al actualizar turno:', error);
          this.snackBar.open('Error al actualizar turno. Es posible que ya exista un turno en el mismo día y hora.', 'Cerrar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    } else {
      this.turnoService.create(turno).subscribe({
        next: () => {
          this.snackBar.open('Turno creado con éxito', 'Cerrar', {
            duration: 3000
          });
          this.loading = false;
          this.router.navigate(['/turnos']);
        },
        error: (error) => {
          console.error('Error al crear turno:', error);
          this.snackBar.open('Error al crear turno. Es posible que ya exista un turno en el mismo día y hora.', 'Cerrar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/turnos']);
  }

  // Función para marcar todos los campos del formulario como tocados
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
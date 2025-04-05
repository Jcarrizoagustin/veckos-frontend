import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { PlanService } from '../../../services/plan.service';
import { PlanDto } from '../../../models';
import { NotificacionService } from '../../../services/notification.service';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule
  ]
})
export class PlanFormComponent implements OnInit {
  planForm!: FormGroup;
  isEditMode = false;
  planId?: number;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private planService: PlanService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificacionService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Determinar si estamos en modo edición o creación
    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'nuevo') {
        this.isEditMode = true;
        this.planId = +params['id'];
        this.loadPlan(this.planId);
      }
    });
  }

  initForm(): void {
    this.planForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      descripcion: ['', [Validators.maxLength(500)]]
    });
  }

  loadPlan(id: number): void {
    this.loading = true;
    this.planService.getById(id).subscribe({
      next: (plan) => {
        this.planForm.patchValue(plan);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar plan:', error);
        this.notificationService.error('Error al cargar datos del plan');
        this.loading = false;
        this.router.navigate(['/planes']);
      }
    });
  }

  onSubmit(): void {
    if (this.planForm.invalid) {
      this.markFormGroupTouched(this.planForm);
      return;
    }

    this.loading = true;
    const plan: PlanDto = this.planForm.value;

    if (this.isEditMode && this.planId) {
      plan.id = this.planId;
      this.planService.update(this.planId, plan).subscribe({
        next: () => {
          this.notificationService.exito('Plan actualizado con éxito');
          this.loading = false;
          this.router.navigate(['/planes']);
        },
        error: (error) => {
          console.error('Error al actualizar plan:', error);
          this.notificationService.error('Error al actualizar plan');
          this.loading = false;
        }
      });
    } else {
      this.planService.create(plan).subscribe({
        next: () => {
          this.notificationService.exito('Plan creado con éxito');
          this.loading = false;
          this.router.navigate(['/planes']);
        },
        error: (error) => {
          console.error('Error al crear plan:', error);
          this.notificationService.error('Error al crear plan. Es posible que el nombre ya exista.');
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/planes']);
  }

  // Función para marcar todos los campos del formulario como tocados
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CuentaService } from '../../../services/cuenta.service';
import { CuentaDto } from '../../../models';
import { NotificacionService } from '../../../services/notification.service';

@Component({
  selector: 'app-cuenta-form',
  templateUrl: './cuenta-form.component.html',
  styleUrls: ['./cuenta-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CuentaFormComponent implements OnInit {
  cuentaForm!: FormGroup;
  isEditMode = false;
  cuentaId?: number;
  loading = false;
  error: string | null = null;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private cuentaService: CuentaService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificacionService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Determinar si estamos en modo edición o creación
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.cuentaId = +params['id'];
        this.loadCuenta(this.cuentaId);
      }
    });
  }

  initForm(): void {
    this.cuentaForm = this.formBuilder.group({
      cbu: ['', [
        Validators.required
      ]],
      descripcion: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]]
    });
  }

  loadCuenta(id: number): void {
    this.loading = true;
    this.cuentaService.getCuentaById(id).subscribe({
      next: (cuenta) => {
        this.cuentaForm.patchValue(cuenta);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos de la cuenta.';
        this.notificationService.error("Error al cargar la cuenta.");
        console.error('Error fetching cuenta:', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.cuentaForm.invalid) {
      return;
    }
    
    const cuentaData: CuentaDto = {
      ...this.cuentaForm.value
    };
    
    if (this.isEditMode && this.cuentaId) {
      cuentaData.id = this.cuentaId;
      this.updateCuenta(cuentaData);
    } else {
      this.createCuenta(cuentaData);
    }
  }

  createCuenta(cuenta: CuentaDto): void {
    this.loading = true;
    this.cuentaService.createCuenta(cuenta).subscribe({
      next: () => {
        this.notificationService.exito("Cuenta creada con exito");
        this.router.navigate(['/cuentas']);
      },
      error: (err) => {
        this.error = 'Error al crear la cuenta. Por favor, intenta nuevamente.';
        this.notificationService.error("Error al crear una cuenta");
        console.error('Error creating cuenta:', err);
        this.loading = false;
      }
    });
  }

  updateCuenta(cuenta: CuentaDto): void {
    this.loading = true;
    this.cuentaService.updateCuenta(cuenta).subscribe({
      next: () => {
        this.notificationService.exito("Exito al actualizar la cuenta");
        this.router.navigate(['/cuentas']);
      },
      error: (err) => {
        this.error = 'Error al actualizar la cuenta. Por favor, intenta nuevamente.';
        this.notificationService.error("Error al actualizar la cuenta");
        console.error('Error updating cuenta:', err);
        this.loading = false;
      }
    });
  }

  // Getter para acceder fácilmente a los campos del formulario
  get f() { return this.cuentaForm.controls; }

  // Cancelar y volver a la lista
  cancel(): void {
    this.router.navigate(['/cuentas']);
  }
}

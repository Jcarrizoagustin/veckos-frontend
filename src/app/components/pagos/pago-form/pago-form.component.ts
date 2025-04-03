import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PagoService } from '../../../services/pago.service';
import { InscripcionService } from '../../../services/inscripcion.service';
import { UsuarioService } from '../../../services/usuario.service';
import { PagoCrearDto, MetodoPago, InscripcionInfoDto, UsuarioDetalleDto, UsuarioDto, CuentaDto } from '../../../models';
import { CuentaService } from '../../../services/cuenta.service';

@Component({
  selector: 'app-pago-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './pago-form.component.html',
  styleUrls: ['./pago-form.component.css']
})
export class PagoFormComponent implements OnInit {
  pagoForm!: FormGroup;
  loading = false;
  loadingCuentas = false;
  inscripcionId?: number;
  usuarioId?: number;
  inscripcion?: InscripcionInfoDto;
  usuario?: UsuarioDto;
  cuentas: CuentaDto[] = [];
  
  // Métodos de pago disponibles
  metodosPago = Object.values(MetodoPago);

  constructor(
    private formBuilder: FormBuilder,
    private pagoService: PagoService,
    private inscripcionService: InscripcionService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cuentaService: CuentaService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
    
    // Obtener parámetros de URL (inscripcionId y usuarioId)
    this.route.queryParams.subscribe(params => {
      if (params['inscripcionId']) {
        this.inscripcionId = +params['inscripcionId'];
        // Actualizar el valor en el formulario
        this.pagoForm.patchValue({
          inscripcionId: this.inscripcionId
        });
        // Solo deshabilitar el campo de inscripcionId, no todo el formulario
        this.pagoForm.get('inscripcionId')?.disable();
        this.cargarInscripcion();
      }
      
      if (params['usuarioId']) {
        this.usuarioId = +params['usuarioId'];
        this.cargarUsuario();
      }
    });
  }

  initForm(): void {
    this.pagoForm = this.formBuilder.group({
      inscripcionId: ['', [Validators.required]],
      monto: ['', [Validators.required, Validators.min(1)]],
      fechaPago: [new Date().toISOString().split('T')[0], [Validators.required]],
      metodoPago: [MetodoPago.EFECTIVO, [Validators.required]],
      cuentaId: ['', [Validators.required]],
      descripcion: ['']
    });
    
    // No deshabilitamos el formulario inicialmente
    // Solo control de inscripcionId estará deshabilitado si se pasa por parámetro
  }

  loadInitialData(): void {
    this.cargarPlanes();
  }

  cargarPlanes(): void {
    this.loadingCuentas = true;
    this.cuentaService.getAll().subscribe({
      next: (cuentas) => {
        this.cuentas = cuentas;
        this.loadingCuentas = false;
      },
      error: (error) => {
        console.error('Error al cargar planes:', error);
        this.snackBar.open('Error al cargar planes', 'Cerrar', {
          duration: 5000
        });
        this.loadingCuentas = false;
      }
    });
  }

  cargarInscripcion(): void {
    if (!this.inscripcionId) return;
    
    this.loading = true;
    this.inscripcionService.getById(this.inscripcionId).subscribe({
      next: (inscripcion) => {
        this.inscripcion = inscripcion;
        
        // Buscar el precio del plan asociado a la inscripción para sugerir el monto
        if (inscripcion && inscripcion.nombrePlan) {
          // Sugerir un monto basado en el nombre del plan (solo como ejemplo)
          // En una implementación real, podrías consultar el precio real del plan
          let montoSugerido = inscripcion.precioPlan;
          /*if (inscripcion.nombrePlan.includes('Fitness')) {
            montoSugerido = 25000;
          } else if (inscripcion.nombrePlan.includes('Wellness')) {
            montoSugerido = 32000;
          } else if (inscripcion.nombrePlan.includes('Sport')) {
            montoSugerido = 38000;
          }*/
          
          // Solo sugerir el monto si no se ha ingresado uno
          if (!this.pagoForm.get('monto')?.value) {
            this.pagoForm.patchValue({
              monto: montoSugerido
            });
          }
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar inscripción:', error);
        this.snackBar.open('Error al cargar datos de la inscripción', 'Cerrar', {
          duration: 5000
        });
        this.loading = false;
      }
    });
  }

  cargarUsuario(): void {
    if (!this.usuarioId) return;
    
    this.loading = true;
    this.usuarioService.getById(this.usuarioId).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.snackBar.open('Error al cargar datos del usuario', 'Cerrar', {
          duration: 5000
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.pagoForm.invalid) {
      this.markFormGroupTouched(this.pagoForm);
      return;
    }

    this.loading = true;
    
    // Obtener valores del formulario, incluyendo los controles deshabilitados
    const formValues = this.pagoForm.getRawValue();
    
    // Si inscripcionId está vacío pero tenemos this.inscripcionId, usarlo
    if (!formValues.inscripcionId && this.inscripcionId) {
      formValues.inscripcionId = this.inscripcionId;
    }
    
    const pago: PagoCrearDto = formValues;

    this.pagoService.registrar(pago).subscribe({
      next: () => {
        this.snackBar.open('Pago registrado con éxito', 'Cerrar', {
          duration: 3000
        });
        this.loading = false;
        
        // Navegar de vuelta a la inscripción
        if (this.inscripcionId) {
          this.router.navigate(['/inscripciones', this.inscripcionId]);
        } else if (this.usuarioId) {
          this.router.navigate(['/usuarios', this.usuarioId]);
        } else {
          this.router.navigate(['/inscripciones']);
        }
      },
      error: (error) => {
        console.error('Error al registrar pago:', error);
        this.snackBar.open('Error al registrar pago', 'Cerrar', {
          duration: 5000
        });
        this.loading = false;
      }
    });
  }

  cancel(): void {
    // Navegar de vuelta a la página anterior
    if (this.inscripcionId) {
      this.router.navigate(['/inscripciones', this.inscripcionId]);
    } else if (this.usuarioId) {
      this.router.navigate(['/usuarios', this.usuarioId]);
    } else {
      this.router.navigate(['/inscripciones']);
    }
  }

  // Función para marcar todos los campos del formulario como tocados
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
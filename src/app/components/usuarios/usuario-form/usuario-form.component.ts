import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../../services/usuario.service';
import { EstadoUsuario, UsuarioDto } from '../../../models';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm!: FormGroup;
  isEditMode: boolean = false;
  usuarioId?: number;
  loading: boolean = false;
  maxDate: Date = new Date(); // Para el datepicker
  
  estadosUsuario = Object.values(EstadoUsuario);

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
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
        this.usuarioId = +params['id'];
        this.loadUsuario(this.usuarioId);
      }
    });
  }

  initForm(): void {
    this.usuarioForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.maxLength(50)]],
      fechaNacimiento: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]],
      cuil: ['', [Validators.pattern(/^[0-9]{11}$/)]],
      telefono: ['', [Validators.pattern(/^[0-9]{10,15}$/)]],
      correo: ['', [Validators.email]],
      estado: [EstadoUsuario.ACTIVO, [Validators.required]]
    });

    // Bloquear el campo DNI en modo edición
    if (this.isEditMode) {
      this.usuarioForm.get('dni')?.disable();
    }
  }

  loadUsuario(id: number): void {
    this.loading = true;
    this.usuarioService.getById(id).subscribe({
      next: (usuario) => {
        // Convertir fecha string a Date para el datepicker
        if (typeof usuario.fechaNacimiento === 'string') {
          usuario.fechaNacimiento = new Date(usuario.fechaNacimiento);
        }
        
        this.usuarioForm.patchValue(usuario);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.snackBar.open('Error al cargar datos del usuario', 'Cerrar', {
          duration: 5000
        });
        this.loading = false;
        this.router.navigate(['/usuarios']);
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.markFormGroupTouched(this.usuarioForm);
      return;
    }

    this.loading = true;
    const usuario: UsuarioDto = this.usuarioForm.getRawValue();

    if (this.isEditMode && this.usuarioId) {
      this.usuarioService.update(this.usuarioId, usuario).subscribe({
        next: () => {
          this.snackBar.open('Usuario actualizado con éxito', 'Cerrar', {
            duration: 3000
          });
          this.loading = false;
          this.router.navigate(['/usuarios', this.usuarioId]);
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          this.snackBar.open('Error al actualizar usuario', 'Cerrar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    } else {
      this.usuarioService.create(usuario).subscribe({
        next: (newUsuario) => {
          this.snackBar.open('Usuario creado con éxito', 'Cerrar', {
            duration: 3000
          });
          this.loading = false;
          this.router.navigate(['/usuarios', newUsuario.id]);
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          this.snackBar.open('Error al crear usuario. Posiblemente el DNI ya existe.', 'Cerrar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    if (this.isEditMode && this.usuarioId) {
      this.router.navigate(['/usuarios', this.usuarioId]);
    } else {
      this.router.navigate(['/usuarios']);
    }
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

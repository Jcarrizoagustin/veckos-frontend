import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioDetalleDto, EstadoUsuario } from '../../models';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class IngresoComponent {
  ingresoForm: FormGroup;
  usuario: UsuarioDetalleDto | null = null;
  loading = false;
  searchComplete = false;
  errorMessage = '';
  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.ingresoForm = this.formBuilder.group({
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]]
    });
  }

  onSubmit() {
    if (this.ingresoForm.invalid) {
      return;
    }

    this.loading = true;
    this.searchComplete = false;
    this.errorMessage = '';
    this.usuario = null;

    const dni = this.ingresoForm.get('dni')!.value;

    // Buscar usuario por DNI
    this.usuarioService.buscar(dni).subscribe({
      next: (usuarios) => {
        setTimeout(() => {
          this.loading = false;
          this.searchComplete = true;
        },1000)

        if (usuarios && usuarios.length > 0) {
          // Obtener los detalles del primer usuario encontrado
          this.usuarioService.getUsuarioDtoById(usuarios[0].id).subscribe({
            next: (usuario) => {
              this.usuario = usuario;
            },
            error: (error) => {
              console.error('Error al obtener detalles del usuario:', error);
              this.errorMessage = 'Error al obtener detalles del usuario.';
            }
          });
        } else {
          this.errorMessage = 'No se encontró ningún usuario con ese DNI.';
        }
      },
      error: (error) => {
        console.error('Error en la búsqueda:', error);
        this.loading = false;
        this.searchComplete = true;
        this.errorMessage = 'Error al buscar usuario. Por favor, intente nuevamente.';
      }
    });
  }

  clearSearch() {
    this.ingresoForm.reset();
    this.usuario = null;
    this.searchComplete = false;
    this.errorMessage = '';
  }

  getEstadoClasses(): string {
    if (!this.usuario) return '';

    if (this.usuario.tieneInscripcionActiva && 
        (this.usuario.inscripcionActiva?.estadoPago === 'PAGA')) {
      return 'bg-green-100 border-green-500 text-green-800';
    } else {
      return 'bg-red-100 border-red-500 text-red-800';
    }
  }

  getEstadoTexto(): string {
    if (this.usuario?.estadoUsuario === 'ACTIVO') {
      return 'ACTIVO';
    } else {
      return 'INACTIVO';
    }
  }

  getIconoEstado(): string {
    if (!this.usuario) return '';

    if (this.usuario?.estadoUsuario === 'ACTIVO') {
      return 'check_circle';
    } else {
      return 'cancel';
    }
  }

  getDiasRestantes(): number {
    if (!this.usuario?.inscripcionActiva?.fechaFin) return 0;
    
    const hoy = new Date();
    const fin = new Date(this.usuario.inscripcionActiva.fechaFin);
    hoy.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    
    // Diferencia en milisegundos
    const diferencia = fin.getTime() - hoy.getTime();
    
    // Convertir a días y redondear
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }

  formatFecha(fecha?: string | Date): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString();
  }
}
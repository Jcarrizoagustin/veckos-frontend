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
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RutaService } from '../../services/ruta.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ],
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
  readonly RUTA_INGRESO = "ingreso2";
  ingresoForm: FormGroup;
  usuario: UsuarioDetalleDto | null = null;
  loading = false;
  searchComplete = false;
  errorMessage = '';
  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private rutaService: RutaService
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
    
    this.usuarioService.ingreso(dni).subscribe({
     next: (usuario) => {
              this.usuario = usuario;
              this.loading = false;
              this.searchComplete = true;
              this.borrarUsuario();
            },
            error: (error) => {
              if(error.message == "Usuario no encontrado"){
                this.errorMessage = 'No se encontró ningún usuario con ese DNI.';
              }else{
                this.errorMessage = 'Error al buscar usuario. Por favor, intente nuevamente.';
              }
              this.loading = false;
              this.searchComplete = true;
            }
    })
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

  borrarUsuario(){
    setTimeout(()=> {
        this.clearSearch();
              }, 3000)
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

  formatFecha(fecha: string | Date | undefined): string {
    if (!fecha) return 'N/A';
  
    if (typeof fecha === 'string') {
      const [fechaParte] = fecha.split('T'); // "2025-04-19"
      const [year, month, day] = fechaParte.split('-');
      return `${day}/${month}/${year}`;
    }
  
    return fecha.toLocaleDateString('es-AR');
  }

  esRutaIngreso():boolean {
    return this.rutaService.hasPath(this.RUTA_INGRESO,true);
  }
}
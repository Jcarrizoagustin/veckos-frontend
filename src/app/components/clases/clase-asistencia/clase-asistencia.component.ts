import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClaseService } from '../../../services/clase.service';
import { AsistenciaService } from '../../../services/asistencia.service';
import { TurnoService } from '../../../services/turno.service';
import { 
  ClaseInfoDto, 
  AsistenciaInfoDto,
  AsistenciaRegistrarDto,
  UsuarioInfoDto,
  TurnoConUsuariosDto,
  DayOfWeek
} from '../../../models';

@Component({
  selector: 'app-clase-asistencia',
  templateUrl: './clase-asistencia.component.html',
  styleUrls: ['./clase-asistencia.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ]
})
export class ClaseAsistenciaComponent implements OnInit {
  claseId!: number;
  clase?: ClaseInfoDto;
  asistencias: AsistenciaInfoDto[] = [];
  usuariosEnTurno: UsuarioInfoDto[] = [];
  
  // Control de estado para la interfaz
  usuariosPresentes: { [key: number]: boolean } = {}; // Mapa de ID de usuario a presente/ausente
  loading = false;
  loadingAsistencias = false;
  guardando = false;
  
  constructor(
    private claseService: ClaseService,
    private asistenciaService: AsistenciaService,
    private turnoService: TurnoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.claseId = +params['id'];
      this.cargarDatosClase();
    });
  }

  cargarDatosClase(): void {
    this.loading = true;
    
    // 1. Cargar la información de la clase
    this.claseService.getById(this.claseId).subscribe({
      next: (clase) => {
        this.clase = clase;
        
        // 2. Cargar los usuarios asignados al turno
        this.cargarUsuariosDelTurno(clase.turnoId, clase.diaSemana);
        
        // 3. Cargar las asistencias existentes para esta clase
        this.cargarAsistencias();
      },
      error: (error) => {
        console.error('Error al cargar la clase:', error);
        this.snackBar.open('Error al cargar la información de la clase', 'Cerrar', {
          duration: 5000
        });
        this.loading = false;
        this.router.navigate(['/clases']);
      }
    });
  }

  cargarUsuariosDelTurno(turnoId: number, diaSemana: DayOfWeek): void {
    this.turnoService.getConUsuariosByDiaSemana(diaSemana).subscribe({
      next: (turnos: TurnoConUsuariosDto[]) => {
        // Buscar el turno específico
        const turnoConUsuarios = turnos.find(t => t.id === turnoId);
        
        if (turnoConUsuarios && turnoConUsuarios.usuarios) {
          this.usuariosEnTurno = turnoConUsuarios.usuarios;
          
          // Inicializar el mapa de asistencias (por defecto, todos ausentes)
          this.usuariosEnTurno.forEach(usuario => {
            this.usuariosPresentes[usuario.id] = false;
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar usuarios del turno:', error);
        this.snackBar.open('Error al cargar usuarios asignados al turno', 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  cargarAsistencias(): void {
    this.loadingAsistencias = true;
    
    this.asistenciaService.getByClaseId(this.claseId).subscribe({
      next: (asistencias) => {
        this.asistencias = asistencias;
        
        // Actualizar el mapa de presentes con las asistencias existentes
        asistencias.forEach(asistencia => {
          // Buscar el ID del usuario desde la asistencia
          const usuarioId = this.obtenerUsuarioIdDesdeAsistencia(asistencia);
          if (usuarioId) {
            this.usuariosPresentes[usuarioId] = asistencia.presente;
          }
        });
        
        this.loadingAsistencias = false;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar asistencias:', error);
        this.snackBar.open('Error al cargar el registro de asistencias', 'Cerrar', {
          duration: 5000
        });
        this.loadingAsistencias = false;
        this.loading = false;
      }
    });
  }

  // Función para extraer el ID de usuario desde una asistencia
  obtenerUsuarioIdDesdeAsistencia(asistencia: AsistenciaInfoDto): number | null {
    // Intentar encontrar el usuario por nombre y apellido
    const usuario = this.usuariosEnTurno.find(u => 
      `${u.nombre} ${u.apellido}` === `${asistencia.nombreUsuario} ${asistencia.apellidoUsuario}`
    );
    
    return usuario ? usuario.id : null;
  }

  toggleAsistencia(usuarioId: number): void {
    this.usuariosPresentes[usuarioId] = !this.usuariosPresentes[usuarioId];
  }

  guardarAsistencias(): void {
    this.guardando = true;
    
    // Crear un array con los IDs de los usuarios presentes para enviar al backend
    const usuariosIds = Object.keys(this.usuariosPresentes).map(Number);
    const usuariosPresentes = usuariosIds.filter(id => this.usuariosPresentes[id]);
    
    // Registrar asistencias por clase (endpoint que recibe la clase y los usuarios presentes)
    this.asistenciaService.registrarPorClase(this.claseId, usuariosPresentes).subscribe({
      next: (response) => {
        this.snackBar.open('Asistencias registradas correctamente', 'Cerrar', {
          duration: 3000
        });
        this.guardando = false;
        this.cargarAsistencias(); // Recargar para mostrar los cambios
      },
      error: (error) => {
        console.error('Error al registrar asistencias:', error);
        this.snackBar.open('Error al registrar las asistencias', 'Cerrar', {
          duration: 5000
        });
        this.guardando = false;
      }
    });
  }

  getCantidadPresentes(): number {
    return Object.values(this.usuariosPresentes).filter(presente => presente).length;
  }

  getCantidadTotal(): number {
    return Object.keys(this.usuariosPresentes).length;
  }

  getPorcentajeAsistencia(): number {
    const total = this.getCantidadTotal();
    if (total === 0) return 0;
    
    return Math.round((this.getCantidadPresentes() / total) * 100);
  }

  formatFecha(fecha?: string | Date): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString();
  }
  
  formatHora(hora?: string): string {
    if (!hora) return '';
    return hora.substring(0, 5); // Format from "00:00:00" to "00:00"
  }

  volver(): void {
    this.router.navigate(['/clases']);
  }
}

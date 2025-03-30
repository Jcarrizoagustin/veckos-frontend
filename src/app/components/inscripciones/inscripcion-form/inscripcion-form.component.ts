import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InscripcionService } from '../../../services/inscripcion.service';
import { UsuarioService } from '../../../services/usuario.service';
import { PlanService } from '../../../services/plan.service';
import { TurnoService } from '../../../services/turno.service';
import { 
  DetalleInscripcionDto, 
  DayOfWeek, 
  UsuarioDto, 
  UsuarioListItemDto,
  PlanDto, 
  TurnoDto, 
  InscripcionCrearDto 
} from '../../../models';

@Component({
  selector: 'app-inscripcion-form',
  templateUrl: './inscripcion-form.component.html',
  styleUrls: ['./inscripcion-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule
  ]
})
export class InscripcionFormComponent implements OnInit {
  // Stepper forms
  usuarioForm!: FormGroup;
  planForm!: FormGroup;
  turnosForm!: FormGroup;
  confirmacionForm!: FormGroup;
  
  // Data para formularios
  usuarios: UsuarioListItemDto[] = [];
  planes: PlanDto[] = [];
  turnos: { [key: string]: TurnoDto[] } = {}; 
  
  // Modo formulario
  isRenovacion = false;
  inscripcionId: number | null = null;
  usuarioIdSeleccionado: number | null = null;
  
  // Estado del formulario
  loading = false;
  loadingUsuarios = false;
  loadingPlanes = false;
  loadingTurnos = false;
  
  // Arrays para UI
  diasSemana = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY
  ];
  
  // Nombres legibles para UI
  nombresDias: { [key: string]: string } = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes'
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private inscripcionService: InscripcionService,
    private usuarioService: UsuarioService,
    private planService: PlanService,
    private turnoService: TurnoService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadInitialData();
    
    // Verificar si es renovación o si viene con usuario preseleccionado
    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'nuevo') {
        this.isRenovacion = true;
        this.inscripcionId = +params['id'];
        this.cargarDatosInscripcion(this.inscripcionId);
      }
    });
    
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['usuarioId']) {
        this.usuarioIdSeleccionado = +queryParams['usuarioId'];
        this.usuarioForm.get('usuarioId')?.setValue(this.usuarioIdSeleccionado);
      }
    });
    
    // Escuchar cambios en la frecuencia para validar el número de días seleccionados
    this.planForm.get('frecuencia')?.valueChanges.subscribe(() => {
      this.diasSeleccionados.updateValueAndValidity();
    });
  }

  initForms(): void {
    // Formulario para selección de usuario
    this.usuarioForm = this.formBuilder.group({
      usuarioId: ['', Validators.required]
    });
    
    // Formulario para selección de plan y frecuencia
    this.planForm = this.formBuilder.group({
      planId: ['', [Validators.required]],
      frecuencia: [3, [Validators.required, Validators.min(3), Validators.max(5)]]
    });
    
    // Formulario para selección de turnos
    this.turnosForm = this.formBuilder.group({
      diasSeleccionados: this.formBuilder.array([], [Validators.required, this.validarCantidadDias.bind(this)]),
      seleccionesTurnos: this.formBuilder.array([])
    });
    
    // Formulario para confirmación de datos
    this.confirmacionForm = this.formBuilder.group({
      aceptaTerminos: [false, Validators.requiredTrue]
    });
  }

  loadInitialData(): void {
    this.cargarUsuarios();
    this.cargarPlanes();
    this.cargarTurnos();
  }

  cargarUsuarios(): void {
    this.loadingUsuarios = true;
    this.usuarioService.getPendientes().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loadingUsuarios = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', {
          duration: 5000
        });
        this.loadingUsuarios = false;
      }
    });
  }

  cargarPlanes(): void {
    this.loadingPlanes = true;
    this.planService.getAll().subscribe({
      next: (planes) => {
        this.planes = planes;
        this.loadingPlanes = false;
      },
      error: (error) => {
        console.error('Error al cargar planes:', error);
        this.snackBar.open('Error al cargar planes', 'Cerrar', {
          duration: 5000
        });
        this.loadingPlanes = false;
      }
    });
  }

  cargarTurnos(): void {
    this.loadingTurnos = true;
    
    // Inicializamos el objeto de turnos por día
    this.diasSemana.forEach(dia => {
      this.turnos[dia] = [];
    });
    
    // Cargar los turnos para cada día de la semana
    const promises = this.diasSemana.map(dia => 
      this.turnoService.getByDiaSemana(dia).toPromise()
    );
    
    Promise.all(promises)
      .then(resultados => {
        resultados.forEach((turnos, index) => {
          if (turnos) {
            this.turnos[this.diasSemana[index]] = turnos;
          }
        });
        this.loadingTurnos = false;
      })
      .catch(error => {
        console.error('Error al cargar turnos:', error);
        this.snackBar.open('Error al cargar turnos', 'Cerrar', {
          duration: 5000
        });
        this.loadingTurnos = false;
      });
  }

  cargarDatosInscripcion(inscripcionId: number): void {
    this.loading = true;
    this.inscripcionService.getById(inscripcionId).subscribe({
      next: (inscripcion) => {
        // Cargar datos del usuario
        this.usuarioForm.get('usuarioId')?.setValue(inscripcion?.usuarioId);
        
        // Cargar datos del plan
        this.planForm.get('planId')?.setValue(inscripcion?.planId);
        this.planForm.get('frecuencia')?.setValue(inscripcion.frecuencia);
        
        // Cargar datos de turnos
        if (inscripcion.detalles && inscripcion.detalles.length > 0) {
          // Reconstruir selección de días y turnos
          const diasArray = this.diasSeleccionados;
          const turnosArray = this.seleccionesTurnos;
          
          // Limpiar arrays
          while (diasArray.length) {
            diasArray.removeAt(0);
          }
          while (turnosArray.length) {
            turnosArray.removeAt(0);
          }
          
          // Agregar días seleccionados
          inscripcion.detalles.forEach(detalle => {
            diasArray.push(this.formBuilder.control(detalle.diaSemana));
          });
          
          // Actualizar selecciones de turnos
          this.onChangeDiasSeleccionados();
          
          // Asignar valores de turnoId
          inscripcion.detalles.forEach((detalle, index) => {
            if (index < turnosArray.length) {
              turnosArray.at(index).get('turnoId')?.setValue(detalle.turnoId);
            }
          });
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos de inscripción:', error);
        this.snackBar.open('Error al cargar datos de inscripción', 'Cerrar', {
          duration: 5000
        });
        this.loading = false;
        this.router.navigate(['/inscripciones']);
      }
    });
  }

  // Validador personalizado para verificar cantidad de días seleccionados
  validarCantidadDias(formArray: FormArray): { [key: string]: any } | null {
    const frecuencia = this.planForm?.get('frecuencia')?.value;
    
    if (!frecuencia || formArray.length !== frecuencia) {
      return { cantidadIncorrecta: true };
    }
    return null;
  }

  // Getters para acceder a los FormArrays
  get diasSeleccionados(): FormArray {
    return this.turnosForm.get('diasSeleccionados') as FormArray;
  }
  
  get seleccionesTurnos(): FormArray {
    return this.turnosForm.get('seleccionesTurnos') as FormArray;
  }

  // Manejar cambio en días seleccionados
  onChangeDiasSeleccionados(): void {
    const diasArray = this.diasSeleccionados;
    const seleccionesArray = this.seleccionesTurnos;
    
    // Limpiar array de selecciones de turnos
    while (seleccionesArray.length > 0) {
      seleccionesArray.removeAt(0);
    }
    
    // Crear grupos de formulario para cada día seleccionado
    const diasSeleccionados = diasArray.value;
    diasSeleccionados.forEach((dia: DayOfWeek) => {
      const turnoGroup = this.formBuilder.group({
        diaSemana: [dia],
        turnoId: ['', Validators.required]
      });
      seleccionesArray.push(turnoGroup);
    });
  }

  isDiaSeleccionado(dia: DayOfWeek): boolean {
    return this.diasSeleccionados.value.includes(dia);
  }

  toggleDia(dia: DayOfWeek): void {
    const diasArray = this.diasSeleccionados;
    const index = diasArray.value.indexOf(dia);
    
    if (index === -1) {
      // Verificar si ya alcanzamos el máximo de frecuencia
      const frecuencia = this.planForm.get('frecuencia')?.value;
      if (diasArray.length < frecuencia) {
        diasArray.push(this.formBuilder.control(dia));
        
        // Actualizar selecciones de turnos
        this.onChangeDiasSeleccionados();
      } else {
        this.snackBar.open(`Solo puede seleccionar ${frecuencia} días`, 'Cerrar', {
          duration: 3000
        });
        return;
      }
    } else {
      diasArray.removeAt(index);
      
      // Actualizar selecciones de turnos
      this.onChangeDiasSeleccionados();
    }
  }

  // Avanzar al siguiente paso
  nextStep(stepper: any): void {
    console.log('Current seleccionesTurnos:', this.seleccionesTurnos.value);
    console.log('Form Data:', {
      usuario: this.usuarioForm.value,
      plan: this.planForm.value,
      turnos: this.turnosForm.value
    });
    
    // Depurar estado del formulario antes de avanzar
    if (stepper.selectedIndex === 2) { // Estamos en el paso de turnos
      if (this.turnosForm.invalid) {
        this.markFormGroupTouched(this.turnosForm);
        this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', {
          duration: 3000
        });
        return;
      }
    }
    
    // Si estamos avanzando al paso 4 (confirmación), cargar datos para el resumen
    if (stepper.selectedIndex === 2 && !this.turnosForm.invalid) {
      // Forzar actualización de datos antes de mostrar el resumen
      console.log('Preparando datos para resumen...');
      console.log('Usuarios:', this.usuarios);
      console.log('Planes:', this.planes);
      console.log('Turnos:', this.turnos);
    }
    
    stepper.next();
  }

  // Volver al paso anterior
  prevStep(stepper: any): void {
    stepper.previous();
  }

  // Obtener resumen para confirmación
  getResumenUsuario(): string {
    const usuarioId = this.usuarioForm.get('usuarioId')?.value;
    if (!usuarioId) return 'No seleccionado';
    
    // Convertir a número para asegurar una comparación correcta
    const usuarioIdNum = Number(usuarioId);
    const usuario = this.usuarios.find(u => u.id === usuarioIdNum);
    
    console.log('Usuario ID:', usuarioIdNum, 'Usuario encontrado:', usuario);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'No seleccionado';
  }
  
  getResumenPlan(): string {
    const planId = this.planForm.get('planId')?.value;
    if (!planId) return 'No seleccionado';
    
    // Convertir a número para asegurar una comparación correcta
    const planIdNum = Number(planId);
    const plan = this.planes.find(p => p.id === planIdNum);
    
    console.log('Plan ID:', planIdNum, 'Plan encontrado:', plan);
    return plan ? plan.nombre : 'No seleccionado';
  }
  
  getResumenFrecuencia(): string {
    const frecuencia = this.planForm.get('frecuencia')?.value;
    return `${frecuencia} días por semana`;
  }
  
  getResumenTurnos(): string[] {
    const selecciones = this.seleccionesTurnos.value;
    console.log('Selecciones de turnos:', selecciones);
    console.log('Turnos disponibles:', this.turnos);
    
    return selecciones.map((seleccion: any) => {
      const dia = this.nombresDias[seleccion.diaSemana];
      
      // Convertir a número para asegurar una comparación correcta
      const turnoId = Number(seleccion.turnoId);
      
      // Buscar en el array de turnos correspondiente al día
      const turnosDelDia = this.turnos[seleccion.diaSemana] || [];
      const turno = turnosDelDia.find(t => Number(t.id) === turnoId);
      
      console.log('Día:', seleccion.diaSemana, 'Turno ID:', turnoId, 'Turno encontrado:', turno);
      const hora = turno ? turno.hora : 'No seleccionado';
      return `${dia} - ${hora}`;
    });
  }

  // Función para marcar todos los campos del formulario como tocados
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          if (control.at(i) instanceof FormGroup) {
            this.markFormGroupTouched(control.at(i) as FormGroup);
          } else {
            (control.at(i) as FormControl).markAsTouched();
          }
        }
      }
    });
  }

  // Submitting del formulario
  onSubmit(): void {
    if (this.usuarioForm.invalid || this.planForm.invalid || this.turnosForm.invalid || this.confirmacionForm.invalid) {
      this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', {
        duration: 5000
      });
      return;
    }
    
    this.loading = true;
    
    // Construir objeto de inscripción
    const inscripcion: InscripcionCrearDto = {
      usuarioId: this.usuarioForm.get('usuarioId')?.value,
      planId: Number(this.planForm.get('planId')?.value),
      frecuencia: this.planForm.get('frecuencia')?.value,
      detalles: this.seleccionesTurnos.value.map((seleccion: any) => ({
        turnoId: seleccion.turnoId,
        diaSemana: seleccion.diaSemana
      }))
    };
    
    console.log('Datos a enviar:', inscripcion);
    
    // Enviar datos según sea creación o renovación
    if (this.isRenovacion && this.inscripcionId) {
      this.inscripcionService.renovarConCambios(this.inscripcionId, inscripcion).subscribe({
        next: (response) => {
          this.snackBar.open('Inscripción renovada con éxito', 'Cerrar', {
            duration: 3000
          });
          this.loading = false;
          this.router.navigate(['/inscripciones', response.id]);
        },
        error: (error) => {
          console.error('Error al renovar inscripción:', error);
          this.snackBar.open('Error al renovar inscripción', 'Cerrar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    } else {
      this.inscripcionService.create(inscripcion).subscribe({
        next: (response) => {
          this.snackBar.open('Inscripción creada con éxito', 'Cerrar', {
            duration: 3000
          });
          this.loading = false;
          this.router.navigate(['/inscripciones', response.id]);
        },
        error: (error) => {
          console.error('Error al crear inscripción:', error);
          this.snackBar.open('Error al crear inscripción', 'Cerrar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    }
  }
  
  // Navegación
  cancel(): void {
    this.router.navigate(['/inscripciones']);
  }
}
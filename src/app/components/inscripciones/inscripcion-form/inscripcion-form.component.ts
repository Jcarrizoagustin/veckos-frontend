import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
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
  planes: PlanDto[] = [{
    id: 1,
    nombre: "Fitness",
    precio: 28999,
    descripcion: "Plan inicial"
  }];
  turnos: { [key: string]: TurnoDto[] } = {
    [DayOfWeek.MONDAY]:[{
      id:1,
      diaSemana: DayOfWeek.MONDAY,
      hora:"7:30",
      descripcion:"",
    }],
    [DayOfWeek.TUESDAY]:[{
      id:2,
      diaSemana: DayOfWeek.TUESDAY,
      hora:"7:30",
      descripcion:"",
    }],
    [DayOfWeek.WEDNESDAY]:[{
      id:3,
      diaSemana: DayOfWeek.WEDNESDAY,
      hora:"7:30",
      descripcion:"",
    }],
    [DayOfWeek.THURSDAY]:[{
      id:4,
      diaSemana: DayOfWeek.THURSDAY,
      hora:"7:30",
      descripcion:"",
    }],
    [DayOfWeek.FRIDAY]:[{
      id:5,
      diaSemana: DayOfWeek.FRIDAY,
      hora:"7:30",
      descripcion:"",
    }],
  }; // Turnos por día de la semana
  
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
  }

  initForms(): void {
    // Formulario para selección de usuario
    this.usuarioForm = this.formBuilder.group({
      usuarioId: ['', Validators.required]
    });
    
    // Formulario para selección de plan y frecuencia
    this.planForm = this.formBuilder.group({
      planId: ['', Validators.required],
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
    this.usuarioService.getActivos().subscribe({
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
    
    // Cargamos los turnos para cada día
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
          const diasArray = this.turnosForm.get('diasSeleccionados') as FormArray;
          const turnosArray = this.turnosForm.get('seleccionesTurnos') as FormArray;
          
          // Limpiar arrays
          while (diasArray.length) {
            diasArray.removeAt(0);
          }
          while (turnosArray.length) {
            turnosArray.removeAt(0);
          }
          
          // Agregar días y turnos seleccionados
          inscripcion.detalles.forEach(detalle => {
            diasArray.push(this.formBuilder.control(detalle.diaSemana));
            
            const turnoGroup = this.formBuilder.group({
              diaSemana: [detalle.diaSemana],
              turnoId: [detalle.turnoId]
            });
            turnosArray.push(turnoGroup);
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
    const frecuencia = this.planForm.get('frecuencia')?.value;
    if (formArray.length !== frecuencia) {
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
    while (seleccionesArray.length) {
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
      } else {
        this.snackBar.open(`Solo puede seleccionar ${frecuencia} días`, 'Cerrar', {
          duration: 3000
        });
        return;
      }
    } else {
      diasArray.removeAt(index);
    }
    
    // Actualizar selecciones de turnos
    this.onChangeDiasSeleccionados();
  }

  // Avanzar al siguiente paso
  nextStep(stepper: any): void {
    stepper.next();
  }

  // Volver al paso anterior
  prevStep(stepper: any): void {
    stepper.previous();
  }

  // Obtener resumen para confirmación
  getResumenUsuario(): string {
    const usuarioId = this.usuarioForm.get('usuarioId')?.value;
    const usuario = this.usuarios.find(u => u.id === usuarioId);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'No seleccionado';
  }
  
  getResumenPlan(): string {
    const planId = this.planForm.get('planId')?.value;
    const plan = this.planes.find(p => p.id === planId);
    return plan ? plan.nombre : 'No seleccionado';
  }
  
  getResumenFrecuencia(): string {
    const frecuencia = this.planForm.get('frecuencia')?.value;
    return `${frecuencia} días por semana`;
  }
  
  getResumenTurnos(): string[] {
    const selecciones = this.seleccionesTurnos.value;
    return selecciones.map((seleccion: any) => {
      const dia = this.nombresDias[seleccion.diaSemana];
      const turnoId = seleccion.turnoId;
      const turno = this.turnos[seleccion.diaSemana]?.find(t => t.id === turnoId);
      const hora = turno ? turno.hora : 'No seleccionado';
      return `${dia} - ${hora}`;
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
      planId: this.planForm.get('planId')?.value,
      frecuencia: this.planForm.get('frecuencia')?.value,
      detalles: this.seleccionesTurnos.value.map((seleccion: any) => ({
        turnoId: seleccion.turnoId,
        diaSemana: seleccion.diaSemana
      }))
    };
    
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

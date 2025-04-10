// Auth
export interface LoginDto {
    username: string;
    password: string;
  }
  
  export interface JwtResponseDto {
    token: string;
    type: string;
    username: string;
    roles: string[];
  }
  
  export interface RegisterDto {
    nombre: string;
    apellido: string;
    username: string;
    password: string;
    email: string;
    roles?: string[];
  }
  
  // Usuario
  export enum EstadoUsuario {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO',
    PENDIENTE = 'PENDIENTE'
  }
  
  export interface UsuarioDto {
    id?: number;
    nombre: string;
    apellido: string;
    fechaNacimiento: Date | string;
    dni: string;
    cuil?: string;
    telefono?: string;
    correo?: string;
    estado?: EstadoUsuario;
  }
  
  export interface UsuarioListItemDto {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    edad: number;
    planActivo: string;
    estado: EstadoUsuario;
  }
  
  export interface UsuarioDetalleDto {
    id: number;
    nombre: string;
    apellido: string;
    fechaNacimiento: Date | string;
    dni: string;
    cuil?: string;
    telefono?: string;
    correo?: string;
    fechaAlta: Date | string;
    inscripcionActiva?: InscripcionInfoDto;
    estadoUsuario: EstadoUsuario,
    edad: number;
    tieneInscripcionActiva: boolean;
  }
  
  // Plan
  export interface PlanDto {
    id: number;
    nombre: string;
    precio: number;
    descripcion?: string;
  }
  
  // Turno
  export interface TurnoDto {
    id: number;
    diaSemana: DayOfWeek;
    hora: string;
    descripcion?: string;
  }
  
  export interface TurnoConUsuariosDto {
    id: number;
    diaSemana: DayOfWeek;
    hora: string;
    descripcion?: string;
    usuarios: UsuarioInfoDto[];
    cantidadUsuarios: number;
  }
  
  // Inscripción
  export enum EstadoPago {
    PAGA = 'PAGA',
    PENDIENTE = 'PENDIENTE'
  }

  export enum EstadoInscripcion {
    EN_CURSO = "EN_CURSO",
    COMPLETADA = "COMPLETADA"
  }
  
  export interface InscripcionInfoDto {
    id: number;
    usuarioId: number;
    nombreUsuario: string;
    apellidoUsuario: string;
    nombrePlan: string;
    planId: number;
    precioPlan: number;
    fechaInicio: Date | string;
    fechaFin: Date | string;
    frecuencia: number;
    estadoPago: EstadoPago;
    estadoInscripcion: EstadoInscripcion
    ultimoPago?: Date | string;
    detalles: DetalleInscripcionInfoDto[];
  }
  
  export interface DetalleInscripcionInfoDto {
    id: number;
    diaSemana: DayOfWeek;
    turnoId: number;
    horaTurno: string;
  }
  
  export interface DetalleInscripcionDto {
    turnoId: number;
    diaSemana: DayOfWeek;
  }
  
  export interface InscripcionCrearDto {
    usuarioId: number;
    planId: number;
    fechaInicio?: Date | string;
    frecuencia: number;
    detalles: DetalleInscripcionDto[];
  }
  
  // Clase
  export interface ClaseDto {
    id?: number;
    turnoId: number;
    fecha: Date | string;
    descripcion?: string;
  }
  
  export interface ClaseInfoDto {
    id: number;
    turnoId: number;
    diaSemana: DayOfWeek;
    hora: string;
    fecha: Date | string;
    descripcion?: string;
    cantidadAsistencias: number;
    cantidadPresentes: number;
  }
  
  // Asistencia
  export interface AsistenciaRegistrarDto {
    claseId: number;
    usuarioId: number;
    presente: boolean;
  }
  
  export interface AsistenciaInfoDto {
    id: number;
    claseId: number;
    fechaClase: Date | string;
    horaClase: string;
    nombreUsuario: string;
    apellidoUsuario: string;
    presente: boolean;
    fechaRegistro: Date | string;
  }
  
  // Pago
  export enum MetodoPago {
    EFECTIVO = 'EFECTIVO',
    TRANSFERENCIA = 'TRANSFERENCIA'
  }
  
  export interface PagoCrearDto {
    inscripcionId: number;
    monto: number;
    fechaPago?: Date | string;
    metodoPago: MetodoPago;
    cuentaId: number;
    descripcion?: string;
  }
  
  export interface PagoInfoDto {
    id: number;
    inscripcionId: number;
    nombreUsuario: string;
    apellidoUsuario: string;
    dniUsuario: string;
    cuilUsuario: string;
    nombrePlan: string;
    monto: number;
    fechaPago: Date | string;
    metodoPago: MetodoPago;
    cbuCuenta: string;
    descripcionCuenta: string;
    descripcion?: string;
  }

  //Cuenta

  export interface CuentaDto {
    id:number,
    cbu:string,
    descripcion: string
  }
  
  // Common
  export enum DayOfWeek {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
  }
  
  export interface MessageResponseDto {
    message: string;
  }
  
  export interface UsuarioInfoDto {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    telefono?: string;
    fechaNacimiento: Date | string;
    estado: EstadoUsuario;
    fechaAlta: Date | string;
  }
  
  export interface ReporteAsistenciaRequestDto {
    usuarioId?: number;
    fechaInicio: Date | string;
    fechaFin: Date | string;
    agruparPorDia?: boolean;
    agruparPorUsuario?: boolean;
    incluirSoloPresentes?: boolean;
  }
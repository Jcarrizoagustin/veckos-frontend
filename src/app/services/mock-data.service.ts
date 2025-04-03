import { Injectable } from '@angular/core';
import { 
  EstadoUsuario, 
  UsuarioDto, 
  UsuarioListItemDto, 
  UsuarioDetalleDto,
  PlanDto,
  DayOfWeek,
  TurnoDto, 
  TurnoConUsuariosDto,
  InscripcionInfoDto,
  EstadoPago,
  ClaseDto,
  ClaseInfoDto,
  AsistenciaInfoDto,
  PagoInfoDto,
  MetodoPago,
  DetalleInscripcionInfoDto,
  UsuarioInfoDto
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  constructor() { }

  // ========== USUARIOS ==========

  // Lista básica de usuarios
  getMockUsuarios(): UsuarioListItemDto[] {
    return [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '32456789',
        edad: 28,
        planActivo: 'Plan Fitness',
        estado: EstadoUsuario.INACTIVO
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'González',
        dni: '29876543',
        edad: 34,
        planActivo: 'Plan Wellness',
        estado: EstadoUsuario.ACTIVO
      },
      {
        id: 3,
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        dni: '35789012',
        edad: 25,
        planActivo: 'Plan Sport',
        estado: EstadoUsuario.PROXIMO_A_VENCER
      },
      {
        id: 4,
        nombre: 'Laura',
        apellido: 'Fernández',
        dni: '27654321',
        edad: 41,
        planActivo: 'Plan Sport',
        estado: EstadoUsuario.INACTIVO
      },
      {
        id: 5,
        nombre: 'Martín',
        apellido: 'López',
        dni: '36901234',
        edad: 22,
        planActivo: 'Plan Sport',
        estado: EstadoUsuario.ACTIVO
      }
    ];
  }

  // Usuarios activos
  getMockUsuariosActivos(): UsuarioListItemDto[] {
    return this.getMockUsuarios().filter(u => u.estado === EstadoUsuario.ACTIVO);
  }

  // Detalle completo de un usuario
  getMockUsuarioDetalle(id: number): UsuarioDetalleDto {
    const mockDetalles = [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNacimiento: '1995-05-15',
        dni: '32456789',
        cuil: '20324567890',
        telefono: '1122334455',
        correo: 'juan.perez@email.com',
        estado: EstadoUsuario.INACTIVO,
        fechaAlta: '2023-01-10T10:00:00',
        edad: 28,
        tieneInscripcionActiva: false,
        inscripcionActiva: {
          id: 101,
          usuarioId: 1,
          nombreUsuario: 'Juan',
          apellidoUsuario: 'Pérez',
          nombrePlan: 'Plan Fitness',
          planId: 1,
          precioPlan:29999,
          fechaInicio: '2023-02-01',
          fechaFin: '2023-03-01',
          frecuencia: 3,
          estadoPago: EstadoPago.ACTIVO,
          ultimoPago: '2023-02-01',
          detalles: [
            {
              id: 201,
              diaSemana: DayOfWeek.MONDAY,
              turnoId: 1,
              horaTurno: '08:00'
            },
            {
              id: 202,
              diaSemana: DayOfWeek.WEDNESDAY,
              turnoId: 3,
              horaTurno: '08:00'
            },
            {
              id: 203,
              diaSemana: DayOfWeek.FRIDAY,
              turnoId: 5,
              horaTurno: '08:00'
            }
          ]
        }
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'González',
        fechaNacimiento: '1989-08-22',
        dni: '29876543',
        cuil: '27298765432',
        telefono: '1156789012',
        correo: 'maria.gonzalez@email.com',
        estado: EstadoUsuario.ACTIVO,
        fechaAlta: '2022-11-05T14:30:00',
        edad: 34,
        tieneInscripcionActiva: true,
        inscripcionActiva: {
          id: 102,
          usuarioId: 2,
          nombreUsuario: 'María',
          apellidoUsuario: 'González',
          nombrePlan: 'Plan Wellness',
          planId: 2,
          precioPlan:29999,
          fechaInicio: '2023-01-15',
          fechaFin: '2023-02-15',
          frecuencia: 5,
          estadoPago: EstadoPago.ACTIVO,
          ultimoPago: '2023-01-15',
          detalles: [
            {
              id: 204,
              diaSemana: DayOfWeek.MONDAY,
              turnoId: 2,
              horaTurno: '18:00'
            },
            {
              id: 205,
              diaSemana: DayOfWeek.TUESDAY,
              turnoId: 7,
              horaTurno: '18:00'
            },
            {
              id: 206,
              diaSemana: DayOfWeek.WEDNESDAY,
              turnoId: 12,
              horaTurno: '18:00'
            },
            {
              id: 207,
              diaSemana: DayOfWeek.THURSDAY,
              turnoId: 17,
              horaTurno: '18:00'
            },
            {
              id: 208,
              diaSemana: DayOfWeek.FRIDAY,
              turnoId: 22,
              horaTurno: '18:00'
            }
          ]
        }
      },
      {
        id: 3,
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        fechaNacimiento: '1998-03-10',
        dni: '35789012',
        cuil: '20357890123',
        telefono: '1145678901',
        correo: 'carlos.rodriguez@email.com',
        estado: EstadoUsuario.ACTIVO,
        fechaAlta: '2022-12-20T09:15:00',
        edad: 25,
        tieneInscripcionActiva: true,
        inscripcionActiva: {
          id: 103,
          usuarioId: 3,
          nombreUsuario: 'Carlos',
          apellidoUsuario: 'Rodríguez',
          nombrePlan: 'Plan Sport',
          planId: 3,
          precioPlan:29999,
          fechaInicio: '2023-01-01',
          fechaFin: '2023-02-01',
          frecuencia: 3,
          estadoPago: EstadoPago.PROXIMO_A_VENCER,
          ultimoPago: '2023-01-01',
          detalles: [
            {
              id: 209,
              diaSemana: DayOfWeek.TUESDAY,
              turnoId: 8,
              horaTurno: '19:30'
            },
            {
              id: 210,
              diaSemana: DayOfWeek.THURSDAY,
              turnoId: 18,
              horaTurno: '19:30'
            },
            {
              id: 211,
              diaSemana: DayOfWeek.SATURDAY,
              turnoId: 25,
              horaTurno: '10:00'
            }
          ]
        }
      },
      {
        id: 4,
        nombre: 'Laura',
        apellido: 'Fernández',
        fechaNacimiento: '1982-11-18',
        dni: '27654321',
        cuil: '27276543210',
        telefono: '1189012345',
        correo: 'laura.fernandez@email.com',
        estado: EstadoUsuario.INACTIVO,
        fechaAlta: '2021-09-15T16:45:00',
        edad: 41,
        tieneInscripcionActiva: false,
        inscripcionActiva: undefined
      },
      {
        id: 5,
        nombre: 'Martín',
        apellido: 'López',
        fechaNacimiento: '2001-07-25',
        dni: '36901234',
        cuil: '20369012345',
        telefono: '1123456789',
        correo: 'martin.lopez@email.com',
        estado: EstadoUsuario.ACTIVO,
        fechaAlta: '2023-01-05T11:20:00',
        edad: 22,
        tieneInscripcionActiva: true,
        inscripcionActiva: {
          id: 105,
          usuarioId: 5,
          nombreUsuario: 'Martín',
          apellidoUsuario: 'López',
          nombrePlan: 'Plan Sport',
          planId: 3,
          precioPlan:29999,
          fechaInicio: '2023-01-05',
          fechaFin: '2023-02-05',
          frecuencia: 5,
          estadoPago: EstadoPago.ACTIVO,
          ultimoPago: '2023-01-05',
          detalles: [
            {
              id: 212,
              diaSemana: DayOfWeek.MONDAY,
              turnoId: 1,
              horaTurno: '08:00'
            },
            {
              id: 213,
              diaSemana: DayOfWeek.TUESDAY,
              turnoId: 6,
              horaTurno: '08:00'
            },
            {
              id: 214,
              diaSemana: DayOfWeek.WEDNESDAY,
              turnoId: 11,
              horaTurno: '08:00'
            },
            {
              id: 215,
              diaSemana: DayOfWeek.THURSDAY,
              turnoId: 16,
              horaTurno: '08:00'
            },
            {
              id: 216,
              diaSemana: DayOfWeek.FRIDAY,
              turnoId: 21,
              horaTurno: '08:00'
            }
          ]
        }
      }
    ];
    return mockDetalles[0]
    //return mockDetalles.find(u => u.id === id) || mockDetalles[0];
  }

  // ========== PLANES ==========

  // Lista de planes
  getMockPlanes(): PlanDto[] {
    return [
      {
        id: 1,
        nombre: 'Plan Fitness',
        precio: 25000,
        descripcion: 'Plan básico con acceso a sala de musculación y clases grupales básicas.'
      },
      {
        id: 2,
        nombre: 'Plan Wellness',
        precio: 32000,
        descripcion: 'Plan intermedio con acceso a todas las instalaciones y clases grupales.'
      },
      {
        id: 3,
        nombre: 'Plan Sport',
        precio: 38000,
        descripcion: 'Plan premium con acceso ilimitado a todas las instalaciones, clases y servicios exclusivos.'
      }
    ];
  }

  // Obtener un plan por ID
  getMockPlanById(id: number): PlanDto {
    const planes = this.getMockPlanes();
    return planes.find(p => p.id === id) || planes[0];
  }

  // ========== TURNOS ==========

  // Lista de turnos
  getMockTurnos(): TurnoDto[] {
    return [
      // Lunes
      { id: 1, diaSemana: DayOfWeek.MONDAY, hora: '08:00', descripcion: 'Mañana' },
      { id: 2, diaSemana: DayOfWeek.MONDAY, hora: '18:00', descripcion: 'Tarde' },
      // Martes
      { id: 6, diaSemana: DayOfWeek.TUESDAY, hora: '08:00', descripcion: 'Mañana' },
      { id: 7, diaSemana: DayOfWeek.TUESDAY, hora: '18:00', descripcion: 'Tarde' },
      { id: 8, diaSemana: DayOfWeek.TUESDAY, hora: '19:30', descripcion: 'Noche' },
      // Miércoles
      { id: 11, diaSemana: DayOfWeek.WEDNESDAY, hora: '08:00', descripcion: 'Mañana' },
      { id: 12, diaSemana: DayOfWeek.WEDNESDAY, hora: '18:00', descripcion: 'Tarde' },
      // Jueves
      { id: 16, diaSemana: DayOfWeek.THURSDAY, hora: '08:00', descripcion: 'Mañana' },
      { id: 17, diaSemana: DayOfWeek.THURSDAY, hora: '18:00', descripcion: 'Tarde' },
      { id: 18, diaSemana: DayOfWeek.THURSDAY, hora: '19:30', descripcion: 'Noche' },
      // Viernes
      { id: 21, diaSemana: DayOfWeek.FRIDAY, hora: '08:00', descripcion: 'Mañana' },
      { id: 22, diaSemana: DayOfWeek.FRIDAY, hora: '18:00', descripcion: 'Tarde' },
      // Sábado
      { id: 25, diaSemana: DayOfWeek.SATURDAY, hora: '10:00', descripcion: 'Mañana' }
    ];
  }

  // Obtener turnos por día de la semana
  getMockTurnosByDiaSemana(diaSemana: DayOfWeek): TurnoDto[] {
    return this.getMockTurnos().filter(t => t.diaSemana === diaSemana);
  }

  // Obtener turnos con usuarios por día de la semana
  getMockTurnosConUsuariosByDiaSemana(diaSemana: DayOfWeek): TurnoConUsuariosDto[] {
    const turnos = this.getMockTurnosByDiaSemana(diaSemana);
    const usuarios = this.getMockUsuarios();
    
    // Crear usuarios mock para cada turno
    return turnos.map(turno => {
      // Asignar algunos usuarios aleatoriamente a este turno
      const usuariosAsignados = usuarios
        .filter(() => Math.random() > 0.3) // Filtro aleatorio para variar la cantidad
        .map(usuario => ({
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          dni: usuario.dni,
          telefono: `11${Math.floor(10000000 + Math.random() * 90000000)}`,
          fechaNacimiento: new Date(1980 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          estado: usuario.estado,
          fechaAlta: new Date(2020 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          inscripcionActiva: {
            estadoPago: usuario.estado === EstadoUsuario.ACTIVO ? EstadoPago.ACTIVO : 
                        usuario.estado === EstadoUsuario.PROXIMO_A_VENCER ? EstadoPago.PROXIMO_A_VENCER : EstadoPago.INACTIVO
          }
        } as UsuarioInfoDto));

      return {
        id: turno.id,
        diaSemana: turno.diaSemana,
        hora: turno.hora,
        descripcion: turno.descripcion,
        usuarios: usuariosAsignados,
        cantidadUsuarios: usuariosAsignados.length
      };
    });
  }

  // ========== INSCRIPCIONES ==========

  // Lista de inscripciones
  getMockInscripciones(): InscripcionInfoDto[] {
    return [
      {
        id: 101,
        usuarioId: 1,
        nombreUsuario: 'Juan',
        apellidoUsuario: 'Pérez',
        nombrePlan: 'Plan Fitness',
        planId: 1,
        precioPlan: 34999,
        fechaInicio: '2023-02-01',
        fechaFin: '2023-03-01',
        frecuencia: 3,
        estadoPago: EstadoPago.ACTIVO,
        ultimoPago: '2023-02-01',
        detalles: [
          {
            id: 201,
            diaSemana: DayOfWeek.MONDAY,
            turnoId: 1,
            horaTurno: '08:00'
          },
          {
            id: 202,
            diaSemana: DayOfWeek.WEDNESDAY,
            turnoId: 11,
            horaTurno: '08:00'
          },
          {
            id: 203,
            diaSemana: DayOfWeek.FRIDAY,
            turnoId: 21,
            horaTurno: '08:00'
          }
        ]
      },
      {
        id: 102,
        usuarioId: 2,
        nombreUsuario: 'María',
        apellidoUsuario: 'González',
        nombrePlan: 'Plan Wellness',
        planId: 2,
        precioPlan: 29999,
        fechaInicio: '2023-01-15',
        fechaFin: '2023-02-15',
        frecuencia: 5,
        estadoPago: EstadoPago.ACTIVO,
        ultimoPago: '2023-01-15',
        detalles: [
          {
            id: 204,
            diaSemana: DayOfWeek.MONDAY,
            turnoId: 2,
            horaTurno: '18:00'
          },
          {
            id: 205,
            diaSemana: DayOfWeek.TUESDAY,
            turnoId: 7,
            horaTurno: '18:00'
          },
          {
            id: 206,
            diaSemana: DayOfWeek.WEDNESDAY,
            turnoId: 12,
            horaTurno: '18:00'
          },
          {
            id: 207,
            diaSemana: DayOfWeek.THURSDAY,
            turnoId: 17,
            horaTurno: '18:00'
          },
          {
            id: 208,
            diaSemana: DayOfWeek.FRIDAY,
            turnoId: 22,
            horaTurno: '18:00'
          }
        ]
      },
      {
        id: 103,
        usuarioId: 3,
        nombreUsuario: 'Carlos',
        apellidoUsuario: 'Rodríguez',
        nombrePlan: 'Plan Sport',
        planId: 3,
        precioPlan: 38999,
        fechaInicio: '2023-01-01',
        fechaFin: '2023-02-01',
        frecuencia: 3,
        estadoPago: EstadoPago.PROXIMO_A_VENCER,
        ultimoPago: '2023-01-01',
        detalles: [
          {
            id: 209,
            diaSemana: DayOfWeek.TUESDAY,
            turnoId: 8,
            horaTurno: '19:30'
          },
          {
            id: 210,
            diaSemana: DayOfWeek.THURSDAY,
            turnoId: 18,
            horaTurno: '19:30'
          },
          {
            id: 211,
            diaSemana: DayOfWeek.SATURDAY,
            turnoId: 25,
            horaTurno: '10:00'
          }
        ]
      },
      {
        id: 104,
        usuarioId: 4,
        nombreUsuario: 'Laura',
        apellidoUsuario: 'Fernández',
        nombrePlan: 'Plan Fitness',
        planId: 1,
        precioPlan: 34999,
        fechaInicio: '2022-12-01',
        fechaFin: '2023-01-01',
        frecuencia: 3,
        estadoPago: EstadoPago.INACTIVO,
        ultimoPago: '2022-12-01',
        detalles: [
          {
            id: 212,
            diaSemana: DayOfWeek.MONDAY,
            turnoId: 1,
            horaTurno: '08:00'
          },
          {
            id: 213,
            diaSemana: DayOfWeek.WEDNESDAY,
            turnoId: 11,
            horaTurno: '08:00'
          },
          {
            id: 214,
            diaSemana: DayOfWeek.FRIDAY,
            turnoId: 21,
            horaTurno: '08:00'
          }
        ]
      },
      {
        id: 105,
        usuarioId: 5,
        nombreUsuario: 'Martín',
        apellidoUsuario: 'López',
        nombrePlan: 'Plan Sport',
        planId: 3,
        precioPlan: 38999,
        fechaInicio: '2023-01-05',
        fechaFin: '2023-02-05',
        frecuencia: 5,
        estadoPago: EstadoPago.ACTIVO,
        ultimoPago: '2023-01-05',
        detalles: [
          {
            id: 215,
            diaSemana: DayOfWeek.MONDAY,
            turnoId: 1,
            horaTurno: '08:00'
          },
          {
            id: 216,
            diaSemana: DayOfWeek.TUESDAY,
            turnoId: 6,
            horaTurno: '08:00'
          },
          {
            id: 217,
            diaSemana: DayOfWeek.WEDNESDAY,
            turnoId: 11,
            horaTurno: '08:00'
          },
          {
            id: 218,
            diaSemana: DayOfWeek.THURSDAY,
            turnoId: 16,
            horaTurno: '08:00'
          },
          {
            id: 219,
            diaSemana: DayOfWeek.FRIDAY,
            turnoId: 21,
            horaTurno: '08:00'
          }
        ]
      }
    ];
  }

  // Obtener inscripción por ID
  getMockInscripcionById(id: number): InscripcionInfoDto {
    const inscripciones = this.getMockInscripciones();
    return inscripciones.find(i => i.id === id) || inscripciones[0];
  }

  // Obtener inscripciones por usuario ID
  getMockInscripcionesByUsuarioId(usuarioId: number): InscripcionInfoDto[] {
    return this.getMockInscripciones().filter(i => i.usuarioId === usuarioId);
  }

  // Obtener inscripciones por estado
  getMockInscripcionesByEstado(estado: EstadoPago): InscripcionInfoDto[] {
    return this.getMockInscripciones().filter(i => i.estadoPago === estado);
  }

  // ========== CLASES ==========

  // Lista de clases
  getMockClases(): ClaseInfoDto[] {
    // Generar fechas para las clases (últimos 30 días)
    const today = new Date();
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    // Generar clases para cada turno en cada fecha
    const turnos = this.getMockTurnos();
    const clases: ClaseInfoDto[] = [];
    let idCounter = 1;

    dates.forEach(fecha => {
      const fechaDate = new Date(fecha);
      const diaSemana = [
        DayOfWeek.SUNDAY,
        DayOfWeek.MONDAY,
        DayOfWeek.TUESDAY,
        DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY,
        DayOfWeek.FRIDAY,
        DayOfWeek.SATURDAY
      ][fechaDate.getDay()];

      // Filtrar turnos para este día de la semana
      const turnosDelDia = turnos.filter(t => t.diaSemana === diaSemana);

      // Crear una clase para cada turno de este día
      turnosDelDia.forEach(turno => {
        // Generar estadísticas aleatorias
        const cantidadAsistencias = Math.floor(Math.random() * 15) + 5;
        const cantidadPresentes = Math.floor(Math.random() * cantidadAsistencias);

        clases.push({
          id: idCounter++,
          turnoId: turno.id,
          diaSemana: turno.diaSemana,
          hora: turno.hora,
          fecha: fecha,
          descripcion: turno.descripcion,
          cantidadAsistencias,
          cantidadPresentes
        });
      });
    });

    return clases;
  }

  // Obtener clases por turno ID
  getMockClasesByTurnoId(turnoId: number): ClaseInfoDto[] {
    return this.getMockClases().filter(c => c.turnoId === turnoId);
  }

  // Obtener clases por fecha
  getMockClasesByFecha(fecha: string): ClaseInfoDto[] {
    return this.getMockClases().filter(c => c.fecha === fecha);
  }

  // Obtener clases en un período
  getMockClasesByPeriodo(fechaInicio: string, fechaFin: string): ClaseInfoDto[] {
    return this.getMockClases().filter(c => c.fecha >= fechaInicio && c.fecha <= fechaFin);
  }

  // ========== ASISTENCIAS ==========

  // Generar asistencias para un usuario
  getMockAsistenciasByUsuarioId(usuarioId: number): AsistenciaInfoDto[] {
    // Obtener clases de los últimos 30 días
    const clases = this.getMockClases();
    const asistencias: AsistenciaInfoDto[] = [];
    let idCounter = 1;

    // Inscripción del usuario para conocer sus días y turnos
    const inscripcion = this.getMockInscripcionesByUsuarioId(usuarioId)[0];
    
    if (!inscripcion) return [];

    // Filtrar clases que corresponden a los turnos de la inscripción
    const turnoIds = inscripcion.detalles.map(d => d.turnoId);
    const clasesUsuario = clases.filter(c => turnoIds.includes(c.turnoId));

    // Generar asistencias para esas clases (con probabilidad de ausencia)
    clasesUsuario.forEach(clase => {
      // Generar registro aleatorio (80% de probabilidad de asistencia)
      const presente = Math.random() > 0.2;
      
      asistencias.push({
        id: idCounter++,
        claseId: clase.id,
        fechaClase: clase.fecha,
        horaClase: clase.hora,
        nombreUsuario: inscripcion.nombreUsuario,
        apellidoUsuario: inscripcion.apellidoUsuario,
        presente,
        fechaRegistro: `${clase.fecha}T${clase.hora}:00`
      });
    });

    return asistencias;
  }

  // Asistencias por clase
  /*getMockAsistenciasByClaseId(claseId: number): AsistenciaInfoDto[] {
    // Buscar la clase
    const clases = this.getMockClases();
    const clase = clases.find(c => c.id === claseId);
    
    if (!clase) return [];

    // Generar asistencias para esta clase (para múltiples usuarios)
    const asistencias: AsistenciaInfoDto[] = [];
    let idCounter = 1;
    const usuarios = this.getMockUsuarios();

    // Seleccionar algunos usuarios aleatorios
    const selectedUsers = usuarios.filter(() => Math.random() > 0.3);

    selectedUsers.forEach(usuario => {
      // Generar registro aleatorio (80% de probabilidad de asistencia)
      const presente = Math.random() > 0.2;
      
      asistencias.push({
        id: idCounter++,
        claseId: clase.id,
        fechaClase: clase.fecha,
        horaClase: clase.hora,
        nombreUsuario: usuario.nombre,
        apellidoUsuario: usuario.apellido,
        presente,
        fechaRegistro: `${clase.fecha}T${clase.hora}:00`
      });
    });

    return asistencias;
  }*/

  // ========== PAGOS ==========

  // Lista de pagos
  getMockPagos(): PagoInfoDto[] {
    const pagos: PagoInfoDto[] = [];
    let idCounter = 1;

    // Generar pagos para cada inscripción
    this.getMockInscripciones().forEach(inscripcion => {
      // Fecha del último pago
      const fechaPago = inscripcion.ultimoPago || inscripcion.fechaInicio;
      
      // Precio del plan
      const plan = this.getMockPlanById(inscripcion.planId);
      
      // Método de pago aleatorio
      const metodosPago = [
        MetodoPago.EFECTIVO,
        MetodoPago.TRANSFERENCIA
      ];
      const metodoPago = metodosPago[Math.floor(Math.random() * metodosPago.length)];

      pagos.push({
        id: idCounter++,
        inscripcionId: inscripcion.id,
        nombreUsuario: inscripcion.nombreUsuario,
        apellidoUsuario: inscripcion.apellidoUsuario,
        nombrePlan: inscripcion.nombrePlan,
        monto: plan.precio,
        fechaPago,
        metodoPago,
        cuenta: "52525205050505050 Naranja X",
        descripcion: `Pago de mensualidad - ${inscripcion.nombrePlan}`
      });
    });

    return pagos;
  }

  // Pagos por inscripción
  getMockPagosByInscripcionId(inscripcionId: number): PagoInfoDto[] {
    return this.getMockPagos().filter(p => p.inscripcionId === inscripcionId);
  }

  // Pagos por usuario
  getMockPagosByUsuarioId(usuarioId: number): PagoInfoDto[] {
    // Obtener inscripciones del usuario
    const inscripciones = this.getMockInscripcionesByUsuarioId(usuarioId);
    const inscripcionIds = inscripciones.map(i => i.id);
    
    // Filtrar pagos por esas inscripciones
    return this.getMockPagos().filter(p => inscripcionIds.includes(p.inscripcionId));
  }

  // ========== DASHBOARD ==========

  // Estadísticas para el dashboard
  getMockDashboardStats() {
    return {
      usuariosActivos: this.getMockUsuarios().filter(u => u.estado === EstadoUsuario.ACTIVO).length,
      usuariosProximosAVencer: this.getMockUsuarios().filter(u => u.estado === EstadoUsuario.PROXIMO_A_VENCER).length,
      ingresosMesActual: 120000,
      ingresosMesAnterior: 105000,
      porcentajeCrecimientoIngresos: 14.3,
      asistenciasHoy: 32,
      porcentajeAsistenciaPromedio: 78.5,
      asistenciasUltimaSemana: {
        "Lunes": 35,
        "Martes": 42,
        "Miércoles": 38,
        "Jueves": 45,
        "Viernes": 40,
        "Sábado": 28,
        "Domingo": 0
      },
      distribucionPorPlan: {
        "Plan Fitness": 45,
        "Plan Wellness": 30,
        "Plan Sport": 25
      }
    };
  }

  // ========== CLASES POR FECHA ==========

// Método para obtener clases por fecha específica
getMockClasesByFechaEspecifica(fechaStr: string): ClaseInfoDto[] {
  // Convertir la fecha string a Date
  const fecha = new Date(fechaStr);
  
  // Obtener día de la semana (0 = domingo, 1 = lunes, etc.)
  const diaSemana = fecha.getDay();
  
  // Convertir a nuestro enum DayOfWeek
  const daysMapping: { [key: number]: DayOfWeek } = {
    0: DayOfWeek.SUNDAY,
    1: DayOfWeek.MONDAY,
    2: DayOfWeek.TUESDAY,
    3: DayOfWeek.WEDNESDAY,
    4: DayOfWeek.THURSDAY,
    5: DayOfWeek.FRIDAY,
    6: DayOfWeek.SATURDAY
  };
  
  const diaSemanaEnum = daysMapping[diaSemana];
  
  // Filtrar turnos para ese día de la semana
  const turnosDelDia = this.getMockTurnos().filter(t => t.diaSemana === diaSemanaEnum);
  
  // Crear clases para cada turno
  const clases: ClaseInfoDto[] = [];
  
  turnosDelDia.forEach((turno, index) => {
    // Simular datos de asistencia
    const cantidadAsistencias = Math.floor(Math.random() * 12) + 5; // Entre 5 y 16 asistentes
    const cantidadPresentes = Math.floor(Math.random() * (cantidadAsistencias + 1)); // Entre 0 y cantidadAsistencias
    
    clases.push({
      id: 500 + index,
      turnoId: turno.id,
      diaSemana: turno.diaSemana,
      hora: turno.hora,
      fecha: fechaStr,
      descripcion: turno.descripcion || 'Clase regular',
      cantidadAsistencias,
      cantidadPresentes
    });
  });
  
  return clases;
}

// ========== ASISTENCIAS POR CLASE ==========

// Método para obtener asistencias por clase
getMockAsistenciasByClaseId(claseId: number): AsistenciaInfoDto[] {
  // Primero, intentamos encontrar la clase
  const clases = this.getMockClases();
  const clase = clases.find(c => c.id === claseId);
  
  if (!clase) {
    // Si no encontramos la clase, generamos una clase ficticia
    return this.generarAsistenciasFicticias(claseId, 10);
  }
  
  // Obtenemos los usuarios asignados al turno de la clase
  const turnos = this.getMockTurnosConUsuariosByDiaSemana(clase.diaSemana);
  const turno = turnos.find(t => t.id === clase.turnoId);
  
  if (!turno || !turno.usuarios || turno.usuarios.length === 0) {
    // Si no hay usuarios, generamos asistencias ficticias
    return this.generarAsistenciasFicticias(claseId, 8);
  }
  
  // Generamos asistencias basadas en los usuarios reales del turno
  const asistencias: AsistenciaInfoDto[] = [];
  let idCounter = 1000;
  
  turno.usuarios.forEach(usuario => {
    // 70% de probabilidad de estar presente
    const presente = Math.random() < 0.7;
    
    asistencias.push({
      id: idCounter++,
      claseId,
      fechaClase: clase.fecha,
      horaClase: clase.hora,
      nombreUsuario: usuario.nombre,
      apellidoUsuario: usuario.apellido,
      presente,
      fechaRegistro: new Date().toISOString()
    });
  });
  
  return asistencias;
}

// Método auxiliar para generar asistencias ficticias
private generarAsistenciasFicticias(claseId: number, cantidad: number): AsistenciaInfoDto[] {
  const asistencias: AsistenciaInfoDto[] = [];
  let idCounter = 2000;
  
  // Generar nombres ficticios
  const nombres = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Martín', 'Sofía', 'Luis', 'Valentina'];
  const apellidos = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Fernández', 'Gómez', 'Díaz', 'Sánchez'];
  
  for (let i = 0; i < cantidad; i++) {
    const nombreIndex = Math.floor(Math.random() * nombres.length);
    const apellidoIndex = Math.floor(Math.random() * apellidos.length);
    const presente = Math.random() < 0.7; // 70% de probabilidad de estar presente
    
    asistencias.push({
      id: idCounter++,
      claseId,
      fechaClase: new Date().toISOString().split('T')[0],
      horaClase: `${Math.floor(Math.random() * 12) + 7}:${Math.random() < 0.5 ? '00' : '30'}`, // Horario entre 7:00 y 18:30
      nombreUsuario: nombres[nombreIndex],
      apellidoUsuario: apellidos[apellidoIndex],
      presente,
      fechaRegistro: new Date().toISOString()
    });
  }
  
  return asistencias;
}

// ========== MÉTODO PARA REGISTRAR ASISTENCIAS ==========

// Simular registro de asistencias por clase
registrarAsistenciasPorClaseMock(claseId: number, usuariosPresentes: number[]): AsistenciaInfoDto[] {
  // Generamos asistencias actualizadas según los IDs de usuarios presentes
  const asistencias: AsistenciaInfoDto[] = [];
  let idCounter = 3000;
  
  // Obtener la clase
  const clases = this.getMockClases();
  const clase = clases.find(c => c.id === claseId) || {
    id: claseId,
    fecha: new Date().toISOString().split('T')[0],
    hora: '08:00',
    diaSemana: DayOfWeek.MONDAY,
    turnoId: 1
  };
  
  // Obtener usuarios (si existen)
  const usuarios = this.getMockUsuarios();
  
  // Crear asistencias para cada usuario
  usuariosPresentes.forEach(usuarioId => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    
    if (usuario) {
      asistencias.push({
        id: idCounter++,
        claseId,
        fechaClase: clase.fecha,
        horaClase: clase.hora,
        nombreUsuario: usuario.nombre,
        apellidoUsuario: usuario.apellido,
        presente: true,
        fechaRegistro: new Date().toISOString()
      });
    }
  });
  
  // Para los usuarios no presentes
  usuarios.forEach(usuario => {
    if (!usuariosPresentes.includes(usuario.id)) {
      asistencias.push({
        id: idCounter++,
        claseId,
        fechaClase: clase.fecha,
        horaClase: clase.hora,
        nombreUsuario: usuario.nombre,
        apellidoUsuario: usuario.apellido,
        presente: false,
        fechaRegistro: new Date().toISOString()
      });
    }
  });
  
  return asistencias;
}


}
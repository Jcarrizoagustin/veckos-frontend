import { Injectable } from '@angular/core';
import { EstadoUsuario, UsuarioDto, UsuarioListItemDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  constructor() { }

  // Usuarios de prueba
  getMockUsuarios(): UsuarioListItemDto[] {
    return [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '32456789',
        edad: 28,
        planActivo: 'Plan Fitness',
        estado: EstadoUsuario.ACTIVO
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

  // Usuario detalle
  getMockUsuarioDetalle(id: number): any {
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
        estado: EstadoUsuario.ACTIVO,
        fechaAlta: '2023-01-10T10:00:00',
        edad: 28,
        tieneInscripcionActiva: true,
        inscripcionActiva: {
          id: 101,
          nombreUsuario: 'Juan',
          apellidoUsuario: 'Pérez',
          nombrePlan: 'Plan Fitness',
          fechaInicio: '2023-02-01',
          fechaFin: '2023-03-01',
          frecuencia: 3,
          estadoPago: 'ACTIVO',
          ultimoPago: '2023-02-01',
          detalles: [
            {
              id: 201,
              diaSemana: 'MONDAY',
              turnoId: 1,
              horaTurno: '08:00'
            },
            {
              id: 202,
              diaSemana: 'WEDNESDAY',
              turnoId: 3,
              horaTurno: '08:00'
            },
            {
              id: 203,
              diaSemana: 'FRIDAY',
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
          nombreUsuario: 'María',
          apellidoUsuario: 'González',
          nombrePlan: 'Plan Wellness',
          fechaInicio: '2023-01-15',
          fechaFin: '2023-02-15',
          frecuencia: 5,
          estadoPago: 'ACTIVO',
          ultimoPago: '2023-01-15',
          detalles: [
            {
              id: 204,
              diaSemana: 'MONDAY',
              turnoId: 2,
              horaTurno: '18:00'
            },
            {
              id: 205,
              diaSemana: 'TUESDAY',
              turnoId: 7,
              horaTurno: '18:00'
            },
            {
              id: 206,
              diaSemana: 'WEDNESDAY',
              turnoId: 12,
              horaTurno: '18:00'
            },
            {
              id: 207,
              diaSemana: 'THURSDAY',
              turnoId: 17,
              horaTurno: '18:00'
            },
            {
              id: 208,
              diaSemana: 'FRIDAY',
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
          nombreUsuario: 'Carlos',
          apellidoUsuario: 'Rodríguez',
          nombrePlan: 'Plan Sport',
          fechaInicio: '2023-01-01',
          fechaFin: '2023-02-01',
          frecuencia: 3,
          estadoPago: 'PROXIMO_A_VENCER',
          ultimoPago: '2023-01-01',
          detalles: [
            {
              id: 209,
              diaSemana: 'TUESDAY',
              turnoId: 8,
              horaTurno: '19:30'
            },
            {
              id: 210,
              diaSemana: 'THURSDAY',
              turnoId: 18,
              horaTurno: '19:30'
            },
            {
              id: 211,
              diaSemana: 'SATURDAY',
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
        inscripcionActiva: null
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
          nombreUsuario: 'Martín',
          apellidoUsuario: 'López',
          nombrePlan: 'Plan Sport',
          fechaInicio: '2023-01-05',
          fechaFin: '2023-02-05',
          frecuencia: 5,
          estadoPago: 'ACTIVO',
          ultimoPago: '2023-01-05',
          detalles: [
            {
              id: 212,
              diaSemana: 'MONDAY',
              turnoId: 1,
              horaTurno: '08:00'
            },
            {
              id: 213,
              diaSemana: 'TUESDAY',
              turnoId: 6,
              horaTurno: '08:00'
            },
            {
              id: 214,
              diaSemana: 'WEDNESDAY',
              turnoId: 11,
              horaTurno: '08:00'
            },
            {
              id: 215,
              diaSemana: 'THURSDAY',
              turnoId: 16,
              horaTurno: '08:00'
            },
            {
              id: 216,
              diaSemana: 'FRIDAY',
              turnoId: 21,
              horaTurno: '08:00'
            }
          ]
        }
      }
    ];

    return mockDetalles.find(u => u.id === id) || mockDetalles[0];
  }
}

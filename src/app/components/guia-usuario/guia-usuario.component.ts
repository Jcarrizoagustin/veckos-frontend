import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-guia-usuario',
  templateUrl: './guia-usuario.component.html',
  styleUrls: ['./guia-usuario.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule
  ]
})
export class GuiaUsuarioComponent {
  // Funcionalidades principales del sistema
  funcionalidades = [
    {
      titulo: 'Gestión de Usuarios',
      descripcion: 'Registro, edición y visualización de datos de los alumnos del gimnasio.',
      icono: 'person',
      pasos: [
        'Accede a la sección "Usuarios" desde el menú principal.',
        'Para añadir un nuevo usuario, haz clic en "Nuevo Usuario".',
        'Para ver los detalles de un usuario, haz clic en su nombre en la lista.',
        'Para editar la información, usa el botón "Editar" en la vista de detalles.'
      ],
      ruta: '/usuarios'
    },
    {
      titulo: 'Inscripciones',
      descripcion: 'Gestión de inscripciones de alumnos a planes de entrenamiento.',
      icono: 'how_to_reg',
      pasos: [
        'Accede a la sección "Inscripciones" desde el menú principal.',
        'Para registrar una nueva inscripción, haz clic en "Nueva Inscripción".',
        'Selecciona el usuario, plan, frecuencia y turnos.',
        'Para renovar una inscripción, utiliza el botón "Renovar" en la vista de detalles.'
      ],
      ruta: '/inscripciones'
    },
    {
      titulo: 'Turnos',
      descripcion: 'Configuración y gestión de los horarios disponibles para las clases.',
      icono: 'schedule',
      pasos: [
        'Accede a la sección "Turnos" desde el menú principal.',
        'Para añadir un nuevo horario, haz clic en "Nuevo Turno".',
        'Define el día de la semana, la hora y una descripción opcional.',
        'Para ver los alumnos asignados a un turno, haz clic en el turno en la lista.'
      ],
      ruta: '/turnos'
    },
    {
      titulo: 'Planes',
      descripcion: 'Configuración de planes de entrenamiento disponibles para los alumnos.',
      icono: 'fitness_center',
      pasos: [
        'Accede a la sección "Planes" desde el menú principal.',
        'Para añadir un nuevo plan, haz clic en "Nuevo Plan".',
        'Define el nombre, precio y descripción del plan.',
        'Los planes pueden ser asignados a los usuarios durante la inscripción.'
      ],
      ruta: '/planes'
    },
    {
      titulo: 'Asistencias',
      descripcion: 'Registro y control de asistencias de los alumnos a las clases.',
      icono: 'event_available',
      pasos: [
        'Accede a la sección "Clases" desde el menú principal.',
        'Selecciona una fecha para ver las clases programadas.',
        'Haz clic en "Registrar Asistencias" para una clase específica.',
        'Marca los alumnos presentes y guarda los cambios.'
      ],
      ruta: '/clases'
    },
    {
      titulo: 'Reportes',
      descripcion: 'Generación de informes de asistencia, financieros y de inscripciones.',
      icono: 'assessment',
      pasos: [
        'Accede a la sección "Reportes" desde el menú principal.',
        'Selecciona el tipo de reporte que deseas generar.',
        'Define los filtros necesarios (fechas, usuarios, etc.).',
        'Haz clic en "Generar Reporte" para visualizar los resultados.'
      ],
      ruta: '/reportes'
    }
  ];

  // Flujos de trabajo comunes
  flujosTrabajo = [
    {
      titulo: 'Registrar un nuevo alumno',
      pasos: [
        'Ir a "Usuarios" → "Nuevo Usuario"',
        'Completar la información personal del alumno',
        'Guardar el usuario',
        'Ir a "Inscripciones" → "Nueva Inscripción"',
        'Seleccionar el usuario recién creado',
        'Elegir plan, frecuencia y turnos',
        'Confirmar la inscripción'
      ]
    },
    {
      titulo: 'Renovar inscripción de un alumno',
      pasos: [
        'Ir a "Usuarios" y buscar al alumno',
        'Ver los detalles del usuario',
        'Hacer clic en "Renovar Inscripción"',
        'Revisar y confirmar los detalles o realizar cambios',
        'Guardar la renovación',
        'Registrar el pago correspondiente'
      ]
    },
    {
      titulo: 'Registrar asistencias diarias',
      pasos: [
        'Ir a "Clases"',
        'Seleccionar la fecha actual',
        'Para cada clase, hacer clic en "Registrar Asistencias"',
        'Marcar los alumnos presentes',
        'Guardar el registro de asistencias'
      ]
    },
    {
      titulo: 'Generar un reporte de asistencia',
      pasos: [
        'Ir a "Reportes"',
        'Seleccionar "Reporte de Asistencia"',
        'Definir el período de fechas',
        'Elegir si es un reporte general o por usuario',
        'Hacer clic en "Generar Reporte"',
        'Exportar a PDF o Excel si es necesario'
      ]
    }
  ];
}
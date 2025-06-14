import { Pipe, PipeTransform } from '@angular/core';
import { UsuarioListItemDto, EstadoUsuario } from '../models'; // Ajusta la ruta según tu estructura

@Pipe({
  name: 'usuarioSort',
  standalone: true
})
export class UsuarioSortPipe implements PipeTransform {

  transform(usuarios: UsuarioListItemDto[]): UsuarioListItemDto[] {
    if (!usuarios || usuarios.length === 0) {
      return usuarios;
    }

    // Crear una copia del array para no mutar el original
    const usuariosOrdenados = [...usuarios];

    return usuariosOrdenados.sort((a, b) => {
      // 1. Primero ordenar por estado (prioridad)
      const prioridadEstadoA = this.obtenerPrioridadEstado(a.estado);
      const prioridadEstadoB = this.obtenerPrioridadEstado(b.estado);

      if (prioridadEstadoA !== prioridadEstadoB) {
        return prioridadEstadoA - prioridadEstadoB;
      }

      // 2. Si tienen el mismo estado, ordenar por apellido alfabéticamente
      const comparacionApellido = a.apellido.toLowerCase().localeCompare(b.apellido.toLowerCase());
      
      if (comparacionApellido !== 0) {
        return comparacionApellido;
      }

      // 3. Si tienen el mismo apellido, ordenar por nombre alfabéticamente
      return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
    });
  }

  private obtenerPrioridadEstado(estado: EstadoUsuario): number {
    // Definir el orden de prioridad: Activo (1), Pendiente (2), Inactivo (3)
    switch (estado) {
      case EstadoUsuario.ACTIVO:
        return 1;
      case EstadoUsuario.PENDIENTE:
        return 2;
      case EstadoUsuario.INACTIVO:
        return 3;
      default:
        return 4; // Por si hay otros estados no contemplados
    }
  }
}

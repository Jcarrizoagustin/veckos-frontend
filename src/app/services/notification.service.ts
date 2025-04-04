import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum NotificacionTipo {
  EXITO = 'exito',
  ERROR = 'error',
  INFO = 'info',
  ADVERTENCIA = 'advertencia'
}

export interface Notificacion {
  mensaje: string;
  tipo: NotificacionTipo;
  duracion?: number;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private notificaciones = new BehaviorSubject<Notificacion[]>([]);
  private contador = 0;

  constructor() { }

  getNotificaciones(): Observable<Notificacion[]> {
    return this.notificaciones.asObservable();
  }

  mostrar(mensaje: string, tipo: NotificacionTipo = NotificacionTipo.INFO, duracion: number = 3000): void {
    const id = this.contador++;
    const notificacion: Notificacion = { mensaje, tipo, duracion, id };
    
    const notificacionesActuales = this.notificaciones.value;
    this.notificaciones.next([...notificacionesActuales, notificacion]);

    // Remover la notificación después de la duración especificada
    setTimeout(() => {
      this.remover(id);
    }, duracion);
  }

  exito(mensaje: string, duracion: number = 5000): void {
    this.mostrar(mensaje, NotificacionTipo.EXITO, duracion);
  }

  error(mensaje: string, duracion: number = 5000): void {
    this.mostrar(mensaje, NotificacionTipo.ERROR, duracion);
  }

  info(mensaje: string, duracion: number = 5000): void {
    this.mostrar(mensaje, NotificacionTipo.INFO, duracion);
  }

  advertencia(mensaje: string, duracion: number = 5000): void {
    this.mostrar(mensaje, NotificacionTipo.ADVERTENCIA, duracion);
  }

  remover(id: number): void {
    const notificacionesActuales = this.notificaciones.value;
    const notificacionesActualizadas = notificacionesActuales.filter(n => n.id !== id);
    this.notificaciones.next(notificacionesActualizadas);
  }

  limpiarTodas(): void {
    this.notificaciones.next([]);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Notificacion, NotificacionService, NotificacionTipo } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notificaciones: Notificacion[] = [];
  private subscription: Subscription | null = null;

  // Para usar enum en la plantilla
  tipoNotificacion = NotificacionTipo;

  constructor(private notificacionService: NotificacionService) { }

  ngOnInit(): void {
    this.subscription = this.notificacionService.getNotificaciones()
      .subscribe(notificaciones => {
        this.notificaciones = notificaciones;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cerrar(id: number | undefined): void {
    if (id !== undefined) {
      this.notificacionService.remover(id);
    }
  }

  // Helper para obtener el icono según el tipo de notificación
  getIcono(tipo: NotificacionTipo): string {
    switch (tipo) {
      case NotificacionTipo.EXITO:
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        `;
      case NotificacionTipo.ERROR:
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        `;
      case NotificacionTipo.ADVERTENCIA:
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        `;
      case NotificacionTipo.INFO:
      default:
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
    }
  }
}
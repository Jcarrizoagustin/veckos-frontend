import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlanService } from '../../../services/plan.service';
import { PlanDto } from '../../../models';
import { NotificacionService } from '../../../services/notification.service';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class PlanListComponent implements OnInit {
  planes: PlanDto[] = [];
  loading = false;
  orderBy: 'precio' | 'popularidad' | 'ninguno' = 'ninguno';

  constructor(
    private planService: PlanService,
    private router: Router,
    private notificationService: NotificacionService
  ) { }

  ngOnInit(): void {
    this.loadPlanes();
  }

  loadPlanes(): void {
    this.loading = true;
    
    // Elegir qué servicio llamar según el criterio de ordenamiento
    let serviceFn;
    
    switch (this.orderBy) {
      case 'precio':
        serviceFn = this.planService.getPorPrecio();
        break;
      case 'popularidad':
        serviceFn = this.planService.getPorPopularidad();
        break;
      default:
        serviceFn = this.planService.getAll();
    }
    
    serviceFn.subscribe({
      next: (data) => {
        this.planes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar planes:', error);
        this.notificationService.error('Error al cargar planes');
        this.loading = false;
      }
    });
  }

  ordenarPorPrecio(): void {
    this.orderBy = 'precio';
    this.loadPlanes();
  }

  ordenarPorPopularidad(): void {
    this.orderBy = 'popularidad';
    this.loadPlanes();
  }

  ordenarPorDefecto(): void {
    this.orderBy = 'ninguno';
    this.loadPlanes();
  }

  nuevoPlan(): void {
    this.router.navigate(['/planes/nuevo']);
  }

  editarPlan(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/planes', id]);
  }

  verDetalles(id: number): void {
    this.router.navigate(['/planes', id, 'detalle']);
  }

  eliminarPlan(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Está seguro de que desea eliminar este plan?')) {
      this.loading = true;
      this.planService.delete(id).subscribe({
        next: () => {
          this.loadPlanes();
          this.notificationService.exito('Plan eliminado correctamente');
        },
        error: (error) => {
          console.error('Error al eliminar plan:', error);
          this.notificationService.exito('Error al eliminar plan. Es posible que tenga inscripciones asociadas.');
          this.loading = false;
        }
      });
    }
  }
}

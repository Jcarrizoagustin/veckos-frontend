import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlanService } from '../../../services/plan.service';
import { PlanDto } from '../../../models';

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
    private snackBar: MatSnackBar
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
        this.snackBar.open('Error al cargar planes', 'Cerrar', {
          duration: 5000
        });
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
          this.snackBar.open('Plan eliminado correctamente', 'Cerrar', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error al eliminar plan:', error);
          this.snackBar.open('Error al eliminar plan. Es posible que tenga inscripciones asociadas.', 'Cerrar', {
            duration: 5000
          });
          this.loading = false;
        }
      });
    }
  }
}

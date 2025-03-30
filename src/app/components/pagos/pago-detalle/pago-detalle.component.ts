import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PagoService } from '../../../services/pago.service';
import { InscripcionService } from '../../../services/inscripcion.service';
import { PagoInfoDto, InscripcionInfoDto } from '../../../models';

@Component({
  selector: 'app-pago-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './pago-detalle.component.html',
  styleUrls: ['./pago-detalle.component.css']
})
export class PagoDetalleComponent implements OnInit {
  pagoId!: number;
  pago?: PagoInfoDto;
  inscripcion?: InscripcionInfoDto;
  loading = false;

  constructor(
    private pagoService: PagoService,
    private inscripcionService: InscripcionService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pagoId = +params['id'];
      this.cargarPago();
    });
  }

  cargarPago(): void {
    this.loading = true;
    this.pagoService.getById(this.pagoId).subscribe({
      next: (pago) => {
        this.pago = pago;
        this.cargarInscripcion(pago.inscripcionId);
      },
      error: (error) => {
        console.error('Error al cargar pago:', error);
        this.snackBar.open('Error al cargar datos del pago', 'Cerrar', {
          duration: 5000
        });
        this.loading = false;
        this.router.navigate(['/pagos']);
      }
    });
  }

  cargarInscripcion(inscripcionId: number): void {
    this.inscripcionService.getById(inscripcionId).subscribe({
      next: (inscripcion) => {
        this.inscripcion = inscripcion;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar inscripción:', error);
        // No mostramos error aquí porque la inscripción es información adicional
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/pagos']);
  }

  verInscripcion(): void {
    if (this.pago?.inscripcionId) {
      this.router.navigate(['/inscripciones', this.pago.inscripcionId]);
    }
  }

  verUsuario(): void {
    if (this.inscripcion?.usuarioId) {
      this.router.navigate(['/usuarios', this.inscripcion.usuarioId]);
    }
  }

  formatFecha(fecha?: string | Date): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString();
  }
}

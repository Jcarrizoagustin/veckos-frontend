import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CuentaService } from '../../../services/cuenta.service';
import { CuentaDto } from '../../../models';

@Component({
  selector: 'app-cuenta-list',
  templateUrl: './cuenta-list.component.html',
  styleUrls: ['./cuenta-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CuentaListComponent implements OnInit {
  cuentas: CuentaDto[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private cuentaService: CuentaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCuentas();
  }

  loadCuentas(): void {
    this.loading = true;
    this.error = null;
    
    this.cuentaService.getAll().subscribe({
      next: (data) => {
        this.cuentas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las cuentas. Por favor, intenta nuevamente.';
        console.error('Error fetching cuentas:', err);
        this.loading = false;
      }
    });
  }

  createCuenta(): void {
    this.router.navigate(['/cuentas/new']);
  }

  editCuenta(id: number): void {
    this.router.navigate([`/cuentas/edit/${id}`]);
  }

  deleteCuenta(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta cuenta?')) {
      this.cuentaService.deleteCuenta(id).subscribe({
        next: () => {
          this.cuentas = this.cuentas.filter(cuenta => cuenta.id !== id);
        },
        error: (err) => {
          this.error = 'Error al eliminar la cuenta. Por favor, intenta nuevamente.';
          console.error('Error deleting cuenta:', err);
        }
      });
    }
  }
}

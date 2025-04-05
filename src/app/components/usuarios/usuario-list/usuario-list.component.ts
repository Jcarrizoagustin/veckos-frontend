import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { EstadoUsuario, UsuarioDto, UsuarioListItemDto } from '../../../models';
import { NotificacionService } from '../../../services/notification.service';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class UsuarioListComponent implements OnInit {
  usuarios: UsuarioListItemDto[] = [];
  filteredUsuarios: UsuarioListItemDto[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  
  // Para mapear estados a colores de Tailwind
  estadoClasses: { [key: string]: string } = {
    [EstadoUsuario.ACTIVO]: 'bg-green-100 text-green-800',
    [EstadoUsuario.INACTIVO]: 'bg-red-100 text-red-800',
    [EstadoUsuario.PENDIENTE]: 'bg-blue-100 text-blue-800',
    [EstadoUsuario.PROXIMO_A_VENCER]: 'bg-yellow-100 text-yellow-800'
  };

  constructor(
    private usuarioService: UsuarioService,
    private notificationService: NotificacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.filteredUsuarios = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.notificationService.error('Error al cargar usuarios');
        this.loading = false;
      }
    });
  }

  filterUsuarios(): void {
    if (!this.searchTerm) {
      this.filteredUsuarios = [...this.usuarios];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsuarios = this.usuarios.filter(usuario => 
      usuario.nombre.toLowerCase().includes(term) || 
      usuario.apellido.toLowerCase().includes(term) || 
      usuario.dni.toLowerCase().includes(term)
    );
  }

  buscarPorTermino(): void {
    if (!this.searchTerm || this.searchTerm.length < 3) {
      return;
    }

    this.loading = true;
    this.usuarioService.buscar(this.searchTerm).subscribe({
      next: (data) => {
        this.filteredUsuarios = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al buscar usuarios:', error);
        this.notificationService.error('Error al buscar usuarios');
        this.loading = false;
      }
    });
  }

  onSearchClear(): void {
    this.searchTerm = '';
    this.filteredUsuarios = [...this.usuarios];
  }

  viewUsuario(id: number): void {
    this.router.navigate(['/usuarios', id]);
  }

  createUsuario(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }
}
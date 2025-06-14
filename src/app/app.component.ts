import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { AuthService } from './services/auth.service';
import { NotificationComponent } from "./components/notification/notification.component";
import { RutaService } from './services/ruta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
    NotificationComponent
]
})
export class AppComponent {
  readonly RUTA_INGRESO = "ingreso2";
  title = 'Veckos Centro de Entrenamiento';
  
  constructor(
    public authService: AuthService,
    private router: Router,
    private rutaService: RutaService
  ) {}

  logout(): void {
    if(confirm("Seguro que deseas cerrar sesion ?")){
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  esRutaIngreso():boolean {
    return this.rutaService.hasPath(this.RUTA_INGRESO,true);
  }
}

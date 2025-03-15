import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsuarioListComponent } from './components/usuarios/usuario-list/usuario-list.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form/usuario-form.component';
import { UsuarioDetalleComponent } from './components/usuarios/usuario-detalle/usuario-detalle.component';
import { PlanListComponent } from './components/planes/plan-list/plan-list.component';
import { PlanFormComponent } from './components/planes/plan-form/plan-form.component';
import { InscripcionListComponent } from './components/inscripciones/inscripcion-list/inscripcion-list.component';
import { InscripcionFormComponent } from './components/inscripciones/inscripcion-form/inscripcion-form.component';
import { InscripcionDetalleComponent } from './components/inscripciones/inscripcion-detalle/inscripcion-detalle.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'usuarios',
    component: UsuarioListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_OPERADOR'] }
  },
  {
    path: 'usuarios/nuevo',
    component: UsuarioFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'usuarios/:id/editar',
    component: UsuarioFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_OPERADOR'] }
  },
  {
    path: 'usuarios/:id',
    component: UsuarioDetalleComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_OPERADOR'] }
  },
  {
    path: 'planes',
    component: PlanListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_OPERADOR'] }
  },
  {
    path: 'planes/nuevo',
    component: PlanFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'planes/:id',
    component: PlanFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'inscripciones',
    component: InscripcionListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_OPERADOR'] }
  },
  {
    path: 'inscripciones/nuevo',
    component: InscripcionFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'inscripciones/:id/renovar',
    component: InscripcionFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'inscripciones/:id',
    component: InscripcionDetalleComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_OPERADOR'] }
  },
  // Otras rutas aquí
  { 
    path: '**', 
    redirectTo: 'dashboard' 
  }
];
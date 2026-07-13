import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AuthComponent } from './pages/auth/auth';
import { DashboardComponent } from './pages/dashboard/dashboard';
import {ProductosComponent} from "./pages/productos/productos";
import { CategoriasComponent } from './pages/categorias/categorias';
import { ProveedoresComponent } from './pages/proveedores/proveedores';
import { VentasComponent } from './pages/ventas/ventas';
import { ReportesComponent } from './pages/reportes/reportes';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones';
import { UsuariosComponent } from './pages/usuarios/usuarios';
import { EscanerComponent } from './pages/escaner/escaner';
import { ChatbotComponent } from './pages/chatbot/chatbot';
import { SuperadminComponent } from './pages/superadmin/superadmin';
import { superadminGuard } from './pages/superadmin/guards/superadmin.guard';
import { SuperadminUsuariosComponent } from './pages/superadmin-usuarios/superadmin-usuarios';
import { SuperadminEmpresasComponent } from './pages/superadmin-empresas/superadmin-empresas';
import { SuperadminVentasComponent } from './pages/superadmin-ventas/superadmin-ventas';
import { SuperadminHistorialComponent } from './pages/superadmin-historial/superadmin-historial';

export const routes: Routes = [

  { path: '', component: HomeComponent },

  { path: 'login', component: AuthComponent },

  { path: 'dashboard', component: DashboardComponent },

  { path: 'categorias', component: CategoriasComponent },

  { path: 'productos', component: ProductosComponent },

  { path: 'proveedores', component: ProveedoresComponent },

  { path: 'ventas', component: VentasComponent },

  { path: 'reportes', component: ReportesComponent },

  { path: 'notificaciones', component: NotificacionesComponent },

  { path: 'usuarios', component: UsuariosComponent },

  { path: 'escaner', component: EscanerComponent },

  { path: 'chatbot', component: ChatbotComponent },

  {
    path: 'superadmin',
    component: SuperadminComponent,
    canActivate: [superadminGuard]
},
{
    path: 'superadmin/usuarios',
    component: SuperadminUsuariosComponent,
    canActivate: [superadminGuard]
},
{
    path: 'superadmin/empresas',
    component: SuperadminEmpresasComponent,
    canActivate: [superadminGuard]
},

  {
    path: 'superadmin/usuarios',
    component: SuperadminUsuariosComponent,
    canActivate: [superadminGuard]
  },
  {
    path: 'superadmin/ventas',
    component: SuperadminVentasComponent,
    canActivate: [superadminGuard] // Blindaje de seguridad
  },

  {
    path: 'superadmin/ventas',
    component: SuperadminVentasComponent,
    canActivate: [superadminGuard]
  },
  {
    path: 'superadmin/historial',
    component: SuperadminHistorialComponent,
    canActivate: [superadminGuard] // Protección perimetral activa
  },

  { path: '**', redirectTo: 'login' }

];

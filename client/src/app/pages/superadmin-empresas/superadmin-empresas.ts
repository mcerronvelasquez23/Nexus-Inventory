import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SuperadminService } from '../../services/superadmin.services';
import { LogoutButton } from '../../shared/logout-button/logout-button';

@Component({
  selector: 'app-superadmin-empresas',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    LogoutButton
  ],
  templateUrl: './superadmin-empresas.html',
  styleUrls: ['./superadmin-empresas.css'] // Si existe
})
export class SuperadminEmpresasComponent implements OnInit {
  empresas: any[] = [];

  constructor(private superadminService: SuperadminService) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.superadminService.getEmpresasGlobal().subscribe({
      next: (data) => this.empresas = data,
      error: (err) => console.error('Error cargando el catálogo de empresas:', err)
    });
  }

  eliminarEmpresa(nombreEmpresa: string): void {
    // Alerta crítica porque borrará a múltiples usuarios
    if (confirm(`⚠️ ADVERTENCIA CRÍTICA ⚠️\n\n¿Estás completamente seguro de querer borrar la empresa "${nombreEmpresa.toUpperCase()}"?\n\nEsto eliminará de la base de datos a TODOS LOS USUARIOS que pertenezcan a esta empresa sin posibilidad de recuperación.`)) {
      
      this.superadminService.eliminarEmpresaGlobal(nombreEmpresa).subscribe({
        next: (res) => {
          alert(res.mensaje);
          this.cargarEmpresas(); // Refrescamos la lista de tarjetas
        },
        error: (err) => alert(err.error?.mensaje || 'Error crítico al procesar la purga de la empresa.')
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SuperadminService } from '../../services/superadmin.services';
import { LogoutButton } from '../../shared/logout-button/logout-button';

@Component({
  selector: 'app-superadmin-historial',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    LogoutButton
  ],
  templateUrl: './superadmin-historial.html',
  styleUrls: ['./superadmin-historial.css']
})
export class SuperadminHistorialComponent implements OnInit {
  historialVentas: any[] = [];

  // Mapeo exacto de columnas para el componente de Angular Material basado en tu esquema
  displayedColumns: string[] = ['ventaId', 'empresa', 'plan', 'monto', 'estado', 'fechaVenta'];

  constructor(private superadminService: SuperadminService) {}

  ngOnInit(): void {
    this.cargarHistorialCompleto();
  }

  cargarHistorialCompleto(): void {
    this.superadminService.getHistorialGlobal().subscribe({
      next: (resp) => {
        if (resp.success) {
          this.historialVentas = resp.data;
        }
      },
      error: (err) => console.error('Error al mapear la bitácora histórica de ventas:', err)
    });
  }
}

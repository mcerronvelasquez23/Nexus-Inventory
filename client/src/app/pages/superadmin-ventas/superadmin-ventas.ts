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
  selector: 'app-superadmin-ventas',
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
  templateUrl: './superadmin-ventas.html',
  styleUrls: ['./superadmin-ventas.css']
})
export class SuperadminVentasComponent implements OnInit {
  ventasBasico: any[] = [];
  ventasPro: any[] = [];
  ventasEnterprise: any[] = [];

  displayedColumns: string[] = ['numeroVenta', 'ventaEmpresa', 'periodo', 'metodoPago', 'total', 'fechaPago'];

  constructor(private superadminService: SuperadminService) {}

  ngOnInit(): void {
    this.cargarHistorialVentas();
  }

  cargarHistorialVentas(): void {
    this.superadminService.getVentasCategorizadas().subscribe({
      next: (resp) => {
        if (resp.success) {
          this.ventasBasico = resp.data.basico;
          this.ventasPro = resp.data.pro;
          this.ventasEnterprise = resp.data.enterprise;
        }
      },
      error: (err) => console.error('Error al mapear flujos de auditoría financiera:', err)
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NotificacionService }
from '../../services/notificacion.services';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { LogoutButton } from '../../shared/logout-button/logout-button';
import { SidebarFooterComponent } from '../../shared/sidebar-footer/sidebar-footer';

@Component({
  selector: 'app-notificaciones',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    MatButtonModule,
    LogoutButton,
    SidebarFooterComponent
  ],

  templateUrl: './notificaciones.html',
  styleUrls: ['./notificaciones.css']
})
export class NotificacionesComponent
implements OnInit {

  nombreEmpresa = '';

  notificaciones: any[] = [];

  totalCriticos = 0;
  totalProductos = 0;

  displayedColumns: string[] = [
    'producto',
    'tipo',
    'mensaje',
    'fecha'
  ];

  constructor(
    private service: NotificacionService
  ) {}

  ngOnInit(): void {

    this.nombreEmpresa =
      localStorage.getItem('empresa') || '';

    this.cargarNotificaciones();

  }

  cargarNotificaciones(): void {

    this.service
      .listar()
      .subscribe({

        next: (data: any[]) => {

          this.notificaciones = data;

          this.totalCriticos =
            data.filter(
              x => x.tipo === 'CRITICO'
            ).length;

          this.totalProductos =
            data.length;

          console.log(
            'NOTIFICACIONES:',
            data
          );

        },

        error: (error) => {

          console.error(
            'Error cargando notificaciones',
            error
          );

        }

      });

  }

}
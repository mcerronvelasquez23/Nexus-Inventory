import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.services';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { LogoutButton } from '../../shared/logout-button/logout-button';
import { SidebarFooterComponent } from '../../shared/sidebar-footer/sidebar-footer';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
  standalone: true,
  imports: [
  CommonModule,
  RouterModule,
  MatToolbarModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatGridListModule,
  MatSidenavModule,
  MatListModule,
  MatDividerModule,
  MatTableModule,
  LogoutButton,
  SidebarFooterComponent
  ]
})

export class ProductosComponent implements OnInit {

  productos: any[] = [];

  constructor(
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {

  this.cargarDatosSesion();

  this.cargarProductos();

}

    nombreUsuario: string = 'Cargando...';
    nombreEmpresa: string = 'Cargando...';

    displayedColumns: string[] = [
    'codigoBarra',
    'nombre',
    'categoria',
    'proveedor',
    'precioVenta',
    'stock',
    'acciones'
    ];

  cargarDatosSesion(): void {

  const token = localStorage.getItem('token');

  if (token) {

    try {

      const payloadBase64 = token.split('.')[1];

      const payloadDecodificado = JSON.parse(
        atob(payloadBase64)
      );

      this.nombreUsuario =
        payloadDecodificado.nombre || 'Administrador';

      this.nombreEmpresa =
        payloadDecodificado.empresa || 'Empresa S.A.';

    } catch (error) {

      console.error(
        '🔴 Error decodificando token:',
        error
      );

      this.nombreUsuario = 'Usuario';
      this.nombreEmpresa = 'Empresa Desconocida';

    }

  }

}

  cargarProductos(): void {

    this.productoService.listar().subscribe({

      next: (data) => {

        console.log(data);

        this.productos = data;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  eliminarProducto(producto: any): void {
    const confirmar = confirm(
      `¿Desea eliminar el producto "${producto.nombre}"?`
    );
    if (!confirmar) return;
    this.productoService.eliminar(producto._id)
      .subscribe({
        next: () => {
          this.productos = this.productos.filter(
            p => p._id !== producto._id
          );
        },
        error: (err) => {
          console.error(err);
          alert('No se pudo eliminar el producto.');
        }
      });
  }

}
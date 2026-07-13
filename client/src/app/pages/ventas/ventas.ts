import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';

import { jwtDecode } from 'jwt-decode';

import { LogoutButton } from '../../shared/logout-button/logout-button';
import { SidebarFooterComponent } from '../../shared/sidebar-footer/sidebar-footer';
import { VentasService } from '../../services/ventas.services';
import { ChangeDetectorRef } from '@angular/core';

export interface Venta {
  empresa: string;
  cantidadVentas: number;
  ingresosTotales: number;
  ultimoPago: string;
  planActual: string;
  ventaPromedioDiaria: number;
  diasCobertura: number;
  cantidadSugeridaCompra: number;
  estado: string;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    LogoutButton,
    SidebarFooterComponent,
  ],
  templateUrl: './ventas.html',
  styleUrls: ['./ventas.css']
})
export class VentasComponent implements OnInit {

  nombreUsuario = 'Usuario';
  nombreEmpresa = 'Empresa';

  ventas: Venta[] = [];
  productos: any[] = [];

  productoSeleccionado = '';
  cantidad = 1;

  cargando = true;

  totalIngresos = 0;
  totalVentas = 0;

  displayedColumns: string[] = [
    'empresa',
    'planActual',
    'cantidadVentas',
    'ingresosTotales',
    'ventaPromedioDiaria',
    'estado'
  ];

  constructor(
    private http: HttpClient,
    private ventasService: VentasService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.obtenerDatosSesion();
    this.cargarProductos();
    this.obtenerVentas();

  }

  obtenerDatosSesion(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    try {

      const usuario: any = jwtDecode(token);

      if (usuario.empresa) {
        this.nombreEmpresa = usuario.empresa.toUpperCase();
      }

      if (usuario.nombre) {
        this.nombreUsuario = usuario.nombre;
      } else if (usuario.correo) {
        this.nombreUsuario = usuario.correo.split('@')[0];
      }

    } catch (error) {

      console.error(error);

    }

  }

  obtenerVentas(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.ventasService.obtenerVentas()
      .subscribe({

        next: (resp) => {

          console.log(resp);

          this.ventas = resp.ventas || [];

          this.calcularKPIs();

          this.cargando = false;

        },

        error: (err) => {

          console.error(err);

          this.ventas = [];

          this.totalIngresos = 0;

          this.totalVentas = 0;

          this.cargando = false;

        }

      });

  }

  private calcularKPIs(): void {

    this.totalIngresos = this.ventas.reduce(
      (total, venta) => total + (venta.ingresosTotales || 0),
      0
    );

    this.totalVentas = this.ventas.reduce(
      (total, venta) => total + (venta.cantidadVentas || 0),
      0
    );

  }

  cargarProductos(): void {

    // <<< ESTA ERA LA PARTE QUE FALTABA >>>
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>(
      'http://localhost:3000/api/productos',
      { headers }
    ).subscribe({

      next: (productos) => {

        console.log('Productos:', productos);

        this.productos = productos;

      },

      error: (err) => {

        console.error('Error cargando productos:', err);

      }

    });

  }

  registrarVenta(): void {

    if (!this.productoSeleccionado) {

      alert('Seleccione un producto');

      return;

    }

    if (this.cantidad <= 0) {

      alert('Cantidad inválida');

      return;

    }

    this.ventasService.registrarVenta({

      productoId: this.productoSeleccionado,

      cantidad: Number(this.cantidad)

    }).subscribe({

      next: (resp: any) => {

        console.log(resp);

        alert('Venta registrada correctamente');

        this.productoSeleccionado = '';

        this.cantidad = 1;

        this.cargarProductos();

        this.obtenerVentas();

      },

      error: (err) => {

        console.error(err);

        alert(err.error?.mensaje || 'Ocurrió un error');

      }

    });

  }

}
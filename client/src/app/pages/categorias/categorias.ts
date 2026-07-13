import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriasService } from '../../services/categorias.services';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { LogoutButton } from '../../shared/logout-button/logout-button';
import { jwtDecode } from 'jwt-decode';
import { SidebarFooterComponent } from '../../shared/sidebar-footer/sidebar-footer';


@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    LogoutButton,
    SidebarFooterComponent
  ],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class CategoriasComponent implements OnInit {

  nombreEmpresa = 'Cargando...';

  categorias: any[] = [];

  constructor(
    private categoriasService: CategoriasService
  ) {}

  ngOnInit(): void {

    this.obtenerNombreEmpresa();

    this.categoriasService
      .obtenerCategorias()
      .subscribe({
        next: (data) => {
          console.log(data);
          this.categorias = data;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  obtenerNombreEmpresa(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decodificamos el payload del JWT
        const decodificado: any = jwtDecode(token);
        if (decodificado && decodificado.empresa) {
          // Asignamos el nombre de la empresa (puedes transformarlo a Mayúsculas si gustas)
          this.nombreEmpresa = decodificado.empresa.toUpperCase();
        }
      } catch (error) {
        console.error('Error al decodificar el token de sesión:', error);
      }
    }
  }

  obtenerEmoji(nombre: string): string {

    const categoria = nombre.toLowerCase();

    if (categoria.includes('lácteos') || categoria.includes('lacteos'))
      return '🥛';

    if (categoria.includes('bebidas'))
      return '🥤';

    if (categoria.includes('abarrotes'))
      return '🛒';

    if (categoria.includes('carnes'))
      return '🥩';

    if (categoria.includes('verduras'))
      return '🥦';

    if (categoria.includes('frutas'))
      return '🍎';

    if (
      categoria.includes('panadería') ||
      categoria.includes('panaderia')
    )
      return '🍞';

    if (categoria.includes('limpieza'))
      return '🧴';

    if (categoria.includes('higiene'))
      return '🧼';

    if (categoria.includes('mascotas'))
      return '🐶';

    return '📦';
  }

}
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { LogoutButton } from '../../shared/logout-button/logout-button';
import { EscanerService } from '../../services/escaner.services';
import { SidebarFooterComponent } from '../../shared/sidebar-footer/sidebar-footer';

@Component({
  selector: 'app-escaner',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    LogoutButton,
    SidebarFooterComponent
  ],
  templateUrl: './escaner.html',
  styleUrls: ['./escaner.css']
})
export class EscanerComponent implements OnInit {
  nombreEmpresa: string = 'Cargando...';
  
  codigosQR: any[] = [];
  historialEscaneos: any[] = [];

  constructor(
    private escanerService: EscanerService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.cargarDatosSesion();
    this.cargarPantalla();
  }

  cargarDatosSesion(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.nombreEmpresa = payload.empresa || 'Empresa S.A.';
        } catch (error) {
          console.error('Error decodificando sesión:', error);
        }
      }
    }
  }

  cargarPantalla(): void {
    if (typeof window !== 'undefined') {
      this.escanerService.getDatosEscaner().subscribe({
        next: (data) => {
          this.codigosQR = data.codigos;
          this.historialEscaneos = data.historial;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error cargando escáner:', err)
      });
    }
  }

  solicitarImagenQR(qr: any): void {
    // Si ya la generamos, la ocultamos (efecto toggle)
    if (qr.imagenRenderizada) {
      qr.imagenRenderizada = null;
      this.cdr.detectChanges(); // Notificar el cambio al ocultar
      return;
    }

    this.escanerService.generarQRBase64(qr.url_destino).subscribe({
      next: (res) => {
        qr.imagenRenderizada = res.imagenBase64;
        
        // 3. Forzar la detección de cambios para que la imagen aparezca de inmediato
        this.cdr.detectChanges(); 
      },
      error: (err) => alert('Error al generar la imagen del QR.')
    });
  }
}

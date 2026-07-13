import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';
import { ReporteService } from '../../services/reporte.services';
import { LogoutButton } from '../../shared/logout-button/logout-button';
import { SidebarFooterComponent } from '../../shared/sidebar-footer/sidebar-footer';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    LogoutButton,
    SidebarFooterComponent
  ],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})
export class ReportesComponent implements OnInit {
  nombreUsuario: string = 'Cargando...';
  nombreEmpresa: string = 'Cargando...';
  cargando: boolean = false;

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarDatosSesion();
  }

  cargarDatosSesion(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payloadBase64 = token.split('.')[1];
          const payloadDecodificado = JSON.parse(atob(payloadBase64));
          this.nombreUsuario = payloadDecodificado.nombre || 'Administrador';
          this.nombreEmpresa = payloadDecodificado.empresa || 'Empresa S.A.';
        } catch (error) {
          console.error('🔴 Error decodificando el token en reportes:', error);
        }
      }
    }
  }

  generarReporte(): void {
    this.cargando = true;
    this.reporteService.descargarReportePDF().subscribe({
      next: (blob) => {
        const urlDescarga = window.URL.createObjectURL(blob);
        const linkDescarga = document.createElement('a');
        linkDescarga.href = urlDescarga;
        
        const empresaFormateada = this.nombreEmpresa.replace(/\s+/g, '_');
        linkDescarga.download = `Reporte_Inventario_Ventas_${empresaFormateada}.pdf`;
        
        document.body.appendChild(linkDescarga);
        linkDescarga.click();
        
        document.body.removeChild(linkDescarga);
        window.URL.revokeObjectURL(urlDescarga);
        this.cargando = false;
      },
      error: (err) => {
        console.error('🔴 Error al obtener reporte de API:', err);
        alert('Hubo un inconveniente al compilar el reporte PDF.');
        this.cargando = false;
      }
    });
  }
}
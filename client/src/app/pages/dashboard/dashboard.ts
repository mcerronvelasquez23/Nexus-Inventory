import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts'; 
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { LogoutButton } from '../../shared/logout-button/logout-button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SidebarFooterComponent } from '../../shared/sidebar-footer/sidebar-footer';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    BaseChartDirective, 
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    LogoutButton,
    MatSlideToggleModule,
    SidebarFooterComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  nombreUsuario: string = 'Cargando...';
  nombreEmpresa: string = 'Cargando...';
  darkMode = false;

  kpis = { totalProductos: 0, totalVentas: 0, totalUsuarios: 0 };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'bottom' } }
  };

  // Configuraciones previas de gráficos
  public stockChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public stockChartType: ChartType = 'bar';
  public stockChartOptions: ChartConfiguration['options'] = { ...this.chartOptions, indexAxis: 'y' };
  public profitChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public categoryChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  public financialChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public healthChartData: ChartData<'polarArea'> = { labels: [], datasets: [] };

  // 🔥 NUEVO - 6. DATA: Proveedores (Pie Chart)
  public supplierChartData: ChartData<'pie'> = { labels: [], datasets: [] };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarDatosSesion();
    this.cargarDashboardCompleto();
  }

  cargarDatosSesion(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadDecodificado = JSON.parse(atob(payloadBase64));
        this.nombreUsuario = payloadDecodificado.nombre || 'Administrador';
        this.nombreEmpresa = payloadDecodificado.empresa || 'Empresa S.A.';
      } catch (error) {
        console.error('🔴 Error decodificando el token:', error);
      }
    }
  }

  cargarDashboardCompleto(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const apiUrl = 'http://localhost:3000/api/dashboard'; 

    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (res) => {
        this.kpis.totalProductos = res.totalProductos;
        this.kpis.totalVentas = res.totalVentas;
        this.kpis.totalUsuarios = res.totalUsuarios;

        const dataG = res.graficos;

        // 1. Gráfico de Stock Crítico
        this.stockChartData = {
          labels: dataG.proximosAgotarse.map((p: any) => p.nombre),
          datasets: [
            { data: dataG.proximosAgotarse.map((p: any) => p.stock), label: 'Stock Actual', backgroundColor: '#f44336' },
            { data: dataG.proximosAgotarse.map((p: any) => p.stockMinimo), label: 'Stock Mínimo', backgroundColor: '#ff9800' }
          ]
        };

        // 2. Gráfico de Rentabilidad
        this.profitChartData = {
          labels: dataG.productosRentables.map((p: any) => p.nombre),
          datasets: [{ data: dataG.productosRentables.map((p: any) => p.margen), label: 'Margen de Ganancia (S/.)', backgroundColor: '#4caf50' }]
        };

        // 3. Gráfico de Categorías
        this.categoryChartData = {
          labels: dataG.porCategoria.map((c: any) => c._id || 'Sin Categoría'),
          datasets: [{ data: dataG.porCategoria.map((c: any) => c.total), backgroundColor: ['#2196f3', '#9c27b0', '#ffeb3b', '#009688', '#e91e63'] }]
        };

        // 4. Gráfico Financiero
        this.financialChartData = {
          labels: dataG.inversionRetorno.map((c: any) => c._id || 'General'),
          datasets: [
            { data: dataG.inversionRetorno.map((c: any) => c.inversion), label: 'Capital Invertido', backgroundColor: '#607d8b' },
            { data: dataG.inversionRetorno.map((c: any) => c.retornoEstimated || c.retornoEstimado), label: 'Retorno Potencial', backgroundColor: '#00cc99' }
          ]
        };

        // 5. Gráfico de Salud de Stock
        this.healthChartData = {
          labels: ['Crítico (Menor al mínimo)', 'Riesgo (Próximo a agotarse)', 'Estable (Seguro)'],
          datasets: [{
            data: [dataG.saludStock.critico, dataG.saludStock.riesgo, dataG.saludStock.estable],
            backgroundColor: ['rgba(244, 67, 54, 0.7)', 'rgba(255, 152, 0, 0.7)', 'rgba(76, 175, 80, 0.7)']
          }]
        };

        // 🔥 NUEVO - 6. Gráfico de Proveedores
  const datosProveedor = dataG.porProveedor || [];

    if (datosProveedor.length === 0) {
      this.supplierChartData = {
        labels: ['Sin stock de proveedores'],
        datasets: [{
        data: [1],
        backgroundColor: ['#e0e0e0']
        }]
      };
      } else {
          this.supplierChartData = {
              labels: datosProveedor.map((p: any) => p._id || 'Proveedor Desconocido'),
              datasets: [{
              data: datosProveedor.map((p: any) => p.totalStock),
              backgroundColor: ['#ff9800', '#00bcd4', '#4caf50', '#e91e63', '#9c27b0']
            }]
          };
        }

        },
        error: (err) => console.error('🔴 Error cargando gráficos:', err)
      });
    }
  }
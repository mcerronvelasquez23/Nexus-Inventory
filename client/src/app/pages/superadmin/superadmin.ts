import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import { SuperadminService } from '../../services/superadmin.services';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LogoutButton } from '../../shared/logout-button/logout-button';

@Component({
  selector: 'app-superadmin',
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
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    LogoutButton
  ],
  templateUrl: './superadmin.html',
  styleUrls: ['./superadmin.css']
})
export class SuperadminComponent implements OnInit {

  dashboard: any;

  usuarios: any[] = [];
  usuariosOriginal: any[] = [];

  historial: any[] = [];

  displayedColumns = [
    'nombre',
    'correo',
    'empresa',
    'rol',
    'estado'
  ];

  displayedHistorialColumns = [
    'empresa',
    'plan',
    'total',
    'estado',
    'fecha'
  ];

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };

  rolesChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  planesChartData: ChartData<'pie'> = {
    labels: [],
    datasets: []
  };

  ventasChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  ingresosChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  metodosChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };

  estadoChartData: ChartData<'polarArea'> = {
    labels: [],
    datasets: []
  };

  empresaChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  constructor(

  private superadminService: SuperadminService,

  private router: Router

){}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {

    this.superadminService.getDashboard().subscribe({

    next: (resp) => {

      this.dashboard = resp.data;

      this.usuarios = resp.data.usuarios;

      this.usuariosOriginal = [...this.usuarios];

      this.historial = resp.data.historial;

      this.cargarGraficos(resp.data.graficos);

    },

    error: (err) => {

      console.error('Error cargando dashboard', err);

    }

    });

  }
  
  private cargarGraficos(graficos: any): void {

  /* ===========================
      Usuarios por Rol
  ============================ */

  this.rolesChartData = {

    labels: graficos.usuariosRol.map((r: any) => r._id),

    datasets: [

      {

        label: 'Usuarios',

        data: graficos.usuariosRol.map((r: any) => r.total),

        backgroundColor: [

          '#1976d2',

          '#43a047',

          '#ff9800',

          '#9c27b0'

        ]

      }

    ]

  };

  /* ===========================
      Planes Vendidos
  ============================ */

  this.planesChartData = {

    labels: graficos.planesVendidos.map((p: any) => p._id),

    datasets: [

      {

        data: graficos.planesVendidos.map((p: any) => p.cantidad),

        backgroundColor: [

          '#2196f3',

          '#4caf50',

          '#ff9800',

          '#e91e63'

        ]

      }

    ]

  };

  /* ===========================
      Ventas Mensuales
  ============================ */

  this.ventasChartData = {

    labels: graficos.ventasMensuales.map(

      (v: any) => `${v._id.mes}/${v._id.anio}`

    ),

    datasets: [

      {

        label: 'Ventas',

        data: graficos.ventasMensuales.map(

          (v: any) => v.cantidad

        ),

        borderColor: '#1976d2',

        backgroundColor: '#64b5f6',

        fill: false

      }

    ]

  };

  /* ===========================
      Ingresos Mensuales
  ============================ */

  this.ingresosChartData = {

    labels: graficos.ingresosMensuales.map(

      (v: any) => `${v._id.mes}/${v._id.anio}`

    ),

    datasets: [

      {

        label: 'Ingresos',

        data: graficos.ingresosMensuales.map(

          (v: any) => v.ingresos

        ),

        borderColor: '#43a047',

        backgroundColor: '#81c784',

        fill: false

      }

    ]

  };

  /* ===========================
      Métodos de Pago
  ============================ */

  this.metodosChartData = {

    labels: graficos.metodosPago.map((m: any) => m._id),

    datasets: [

      {

        data: graficos.metodosPago.map((m: any) => m.total),

        backgroundColor: [

          '#03a9f4',

          '#8bc34a',

          '#ff9800',

          '#f44336'

        ]

      }

    ]

  };

  /* ===========================
      Estado de Ventas
  ============================ */

  this.estadoChartData = {

    labels: graficos.estadosVenta.map((e: any) => e._id),

    datasets: [

      {

        data: graficos.estadosVenta.map((e: any) => e.total),

        backgroundColor: [

          '#4caf50',

          '#ff9800',

          '#e53935'

        ]

      }

    ]

  };

  /* ===========================
      Top Empresas
  ============================ */

    this.empresaChartData = 
    {
  
        labels: graficos.empresasTop.map((e: any) => e._id),
    
        datasets: 
        [
    
          {
    
            label: 'Ingresos',
    
            data: graficos.empresasTop.map((e: any) => e.monto),
    
            backgroundColor: '#1976d2'
    
          }
    
        ]
    
    };

  }

  filtrarUsuarios(event: Event): void {

    const texto = (event.target as HTMLInputElement)
      .value
      .toLowerCase();

    this.usuarios = this.usuariosOriginal.filter(u =>
  
      u.nombre.toLowerCase().includes(texto) ||
  
      u.correo.toLowerCase().includes(texto) ||
  
      u.empresa.toLowerCase().includes(texto)
  
    );

  }
  
  cerrarSesion(): void {

    localStorage.clear();
  
    this.router.navigate(['/login']);
  
  }

}

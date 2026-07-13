import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Importaciones requeridas de Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UsuarioService, UsuarioEstructura } from '../../services/usuario.services';
import { LogoutButton } from '../../shared/logout-button/logout-button';
import { SidebarFooterComponent } from '../../shared/sidebar-footer/sidebar-footer';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    LogoutButton,
    SidebarFooterComponent
  ],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: UsuarioEstructura[] = [];
  nombreUsuario: string = 'Cargando...';
  nombreEmpresa: string = 'Cargando...';
  
  // Control de permisos RBAC en interfaz
  esAdmin: boolean = false;

  // Modelo del formulario reactivo/plantilla
  nuevoUsuario: Partial<UsuarioEstructura> = {
    nombre: '',
    correo: '',
    password: '',
    rol: 'usuario'
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarDatosSesion();
    this.cargarListaUsuarios();
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
          
          // Activamos permisos avanzados si el rol del token es estrictamente admin
          this.esAdmin = payloadDecodificado.rol === 'admin';
        } catch (error) {
          console.error('🔴 Error decodificando sesión de usuario:', error);
        }
      }
    }
  }

  cargarListaUsuarios(): void {
    if (typeof window !== 'undefined') {
      this.usuarioService.getUsuarios().subscribe({
        next: (data) => {
          this.usuarios = data;
        },
        error: (err) => {
          console.error('🔴 Error al cargar el personal de la empresa:', err);
        }
      });
    }
  }

  registrarUsuario(): void {
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.correo || !this.nuevoUsuario.password || !this.nuevoUsuario.rol) {
      alert('Por favor complete todos los criterios del formulario.');
      return;
    }

    this.usuarioService.insertarUsuario(this.nuevoUsuario).subscribe({
      next: (res) => {
        alert(`Usuario ${res.nombre} incorporado exitosamente.`);
        // Reiniciamos el formulario de alta
        this.nuevoUsuario = { nombre: '', correo: '', password: '', rol: 'usuario' };
        this.cargarListaUsuarios(); // Refrescamos el tablero visual
      },
      error: (err) => {
        console.error('🔴 Error al dar de alta:', err);
        alert(err.error?.mensaje || 'Error al guardar el nuevo perfil.');
      }
    });
  }

  removerUsuario(id: string): void {
    if (confirm('¿Se encuentra completamente seguro de revocar el acceso y remover este perfil del sistema?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          alert('El perfil ha sido removido de la base de datos.');
          this.cargarListaUsuarios();
        },
        error: (err) => {
          console.error('🔴 Error al remover usuario:', err);
          alert(err.error?.mensaje || 'No se pudo culminar la eliminación.');
        }
      });
    }
  }
}
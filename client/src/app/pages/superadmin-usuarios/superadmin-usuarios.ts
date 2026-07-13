import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SuperadminService } from '../../services/superadmin.services';
import { LogoutButton } from '../../shared/logout-button/logout-button';

@Component({
  selector: 'app-superadmin-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    LogoutButton
  ],
  templateUrl: './superadmin-usuarios.html',
  styleUrls: ['./superadmin-usuarios.css']
})
export class SuperadminUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  
  nuevoSuperadmin = {
    nombre: '',
    correo: '',
    password: '',
    empresa: ''
  };

  displayedColumns: string[] = ['nombre', 'correo', 'empresa', 'rol', 'estado', 'intentos', 'acciones'];

  constructor(private superadminService: SuperadminService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.superadminService.getUsuariosGlobal().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error cargando el directorio global de cuentas:', err)
    });
  }

  registrarSuperadmin(): void {
    if (!this.nuevoSuperadmin.nombre || !this.nuevoSuperadmin.correo || !this.nuevoSuperadmin.password || !this.nuevoSuperadmin.empresa) {
      alert('Debe rellenar la totalidad de campos para el alta corporativa.');
      return;
    }

    this.superadminService.crearSuperadmin(this.nuevoSuperadmin).subscribe({
      next: (res) => {
        alert(`Cuenta de Superadmin para ${res.nombre} creada exitosamente.`);
        this.nuevoSuperadmin = { nombre: '', correo: '', password: '', empresa: '' };
        this.cargarUsuarios();
      },
      error: (err) => alert(err.error?.mensaje || 'Fallo de procesamiento interno.')
    });
  }

  desbloquear(id: string): void {
    this.superadminService.desbloquearUsuario(id).subscribe({
      next: () => {
        alert('Credenciales de acceso reestablecidas operativamente.');
        this.cargarUsuarios();
      },
      error: (err) => console.error(err)
    });
  }

  eliminarUsuario(id: string): void {
    if (confirm('¿Confirma la revocación total y purga absoluta de este usuario del ecosistema central?')) {
      this.superadminService.eliminarUsuarioGlobal(id).subscribe({
        next: () => {
          alert('Registro purgado de la infraestructura de almacenamiento.');
          this.cargarUsuarios();
        },
        error: (err) => alert(err.error?.mensaje || 'Conflicto de privilegios de borrado.')
      });
    }
  }
}
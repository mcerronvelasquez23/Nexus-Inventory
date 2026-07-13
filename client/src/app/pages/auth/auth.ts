import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatIcon
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})

  

export class AuthComponent {

  constructor (private Router: Router){}

  volverInicio(): void {
  this.router.navigate(['/']); 
  }

  private http = inject(HttpClient);
  private router = inject(Router);

  loginData = {
    empresa: '',
    correo: '',
    password: ''
  };

  onLogin() {
    const apiUrl = 'http://localhost:3000/api/auth/login';

    this.http.post<any>(apiUrl, this.loginData).subscribe({
      next: (respuesta) => {
        // 1. Guardar token en el almacenamiento local
        localStorage.setItem('token', respuesta.token);

        // 2. Guardar datos del usuario/empresa si los necesitas globalmente
        localStorage.setItem('empresa', respuesta.usuario.empresa);
        localStorage.setItem('rol', respuesta.usuario.rol);

        // 3. Evaluar el rol del usuario para redirigir a la vista correcta
        if (respuesta.usuario.rol === 'superadmin') {
          this.router.navigate(['/superadmin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Error durante el inicio de sesión:', error);
        alert(error.error?.mensaje || 'Credenciales incorrectas o empresa no válida');
      }
    });
  }
}
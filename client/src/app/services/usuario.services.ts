import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioEstructura {
  _id?: string;
  correo: string;
  nombre: string;
  rol: 'usuario' | 'admin';
  empresa: string;
  estado?: boolean;
  ultimoAcceso?: string | Date;
  password?: string;
}

@Injectable({
  providedIn: 'root'
}) 
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  private obtenerTokenSeguro(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  getUsuarios(): Observable<UsuarioEstructura[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.obtenerTokenSeguro()}`);
    return this.http.get<UsuarioEstructura[]>(this.apiUrl, { headers });
  }

  insertarUsuario(usuario: Partial<UsuarioEstructura>): Observable<UsuarioEstructura> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.obtenerTokenSeguro()}`);
    return this.http.post<UsuarioEstructura>(this.apiUrl, usuario, { headers });
  }

  eliminarUsuario(id: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.obtenerTokenSeguro()}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
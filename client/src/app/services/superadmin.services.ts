import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperadminService {
  private readonly API_URL = 'http://localhost:3000/api/superadmin';
  constructor(
    private http: HttpClient
  ) { }
  /**
   * Obtiene el token almacenado
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
  /**
   * Dashboard Principal
   */
  getDashboard(): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/dashboard`,
      {
        headers: this.getHeaders()
      }
    );
  }
  getUsuariosGlobal(): Observable<any[]> {
  return this.http.get<any[]>(`${this.API_URL}/usuarios`, { headers: this.getHeaders() });
  }

  crearSuperadmin(nuevoAdmin: any): Observable<any> {
  return this.http.post<any>(`${this.API_URL}/usuarios`, nuevoAdmin, { headers: this.getHeaders() });
  }

  desbloquearUsuario(id: string): Observable<any> {
  return this.http.put<any>(`${this.API_URL}/usuarios/${id}/desbloquear`, {}, { headers: this.getHeaders() });
  }

  eliminarUsuarioGlobal(id: string): Observable<any> {
  return this.http.delete<any>(`${this.API_URL}/usuarios/${id}`, { headers: this.getHeaders() });
  }

  getEmpresasGlobal(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/empresas`, { headers: this.getHeaders() });
  }

  eliminarEmpresaGlobal(nombreEmpresa: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/empresas/${nombreEmpresa}`, { headers: this.getHeaders() });
  }

  getVentasCategorizadas(): Observable<any> {
  return this.http.get<any>(`${this.API_URL}/ventas`, { headers: this.getHeaders() });
  }

  getHistorialGlobal(): Observable<any> {
  return this.http.get<any>(`${this.API_URL}/historial`, { headers: this.getHeaders() });
  }

}
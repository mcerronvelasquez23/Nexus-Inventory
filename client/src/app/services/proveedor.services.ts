import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proveedor {
  _id?: string;
  empresa: string;
  ruc: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo';
  empresaId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://localhost:3000/api/proveedores';
  private apiProductosUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) {}

  // Función de ayuda para evitar el error de SSR
  private obtenerTokenSeguro(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  getProveedores(): Observable<Proveedor[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.obtenerTokenSeguro()}`);
    return this.http.get<Proveedor[]>(this.apiUrl, { headers });
  }

  insertarProveedor(proveedor: Proveedor): Observable<Proveedor> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.obtenerTokenSeguro()}`);
    return this.http.post<Proveedor>(this.apiUrl, proveedor, { headers });
  }

  comprarYRegistrarProductos(productos: any[]): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.obtenerTokenSeguro()}`);
    return this.http.post<any>(`${this.apiProductosUrl}/bulk-compras`, productos, { headers });
  }
}
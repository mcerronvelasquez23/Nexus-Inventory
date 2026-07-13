import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  // Ajusta el puerto o dominio según tu entorno
  private apiAuthUrl = 'http://localhost:3000/api/auth';
  private apiPlanVentaUrl = 'http://localhost:3000/api/plan-venta';

  constructor(private http: HttpClient) {}

  // Petición para registrar el pago
  registrarVenta(datosVenta: any): Observable<any> {
    return this.http.post(`${this.apiPlanVentaUrl}/registrar`, datosVenta);
  }

  // Petición para registrar el usuario (reutilizando tu auth.controller)
  registrarUsuario(datosUsuario: any): Observable<any> {
    return this.http.post(`${this.apiAuthUrl}/registrar`, datosUsuario);
  }
}
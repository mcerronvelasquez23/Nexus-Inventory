import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private readonly api =
    'http://localhost:3000/api/ventas';

  constructor(
    private http: HttpClient
  ) {}

  private getHeaders(): HttpHeaders {

    const token =
      localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

  }

  obtenerVentas() {

    return this.http.get<any>(
      this.api,
      {
        headers: this.getHeaders()
      }
    );

  }

  registrarVenta(data: any) {

    return this.http.post(
      this.api,
      data,
      {
        headers: this.getHeaders()
      }
    );

  }

}
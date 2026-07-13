import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private apiUrl =
  'http://localhost:3000/api/productos';

  constructor(
    private http: HttpClient
  ) {}

  listar() {

    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders()
      .set(
        'Authorization',
        `Bearer ${token}`
      );

    return this.http.get<any[]>(
      `${this.apiUrl}/alertas-stock`,
      { headers }
    );

  }

}
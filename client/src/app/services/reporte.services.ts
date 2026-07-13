import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = 'http://localhost:3000/api/reportes/generarPDF';

  constructor(private http: HttpClient) {}

  private obtenerTokenSeguro(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  descargarReportePDF(): Observable<Blob> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.obtenerTokenSeguro()}`);
    // Establecemos explícitamente el responseType como blob para capturar el flujo binario
    return this.http.get(this.apiUrl, { headers, responseType: 'blob' });
  }
}
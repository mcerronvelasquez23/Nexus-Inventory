import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EscanerService {
  private apiUrl = 'http://localhost:3000/api/escaner';

  constructor(private http: HttpClient) {}

  private obtenerTokenSeguro(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  getDatosEscaner(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.obtenerTokenSeguro()}`);
    return this.http.get<any>(`${this.apiUrl}/datos`, { headers });
  }

  generarQRBase64(url: string): Observable<{ imagenBase64: string }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.obtenerTokenSeguro()}`);
    return this.http.post<{ imagenBase64: string }>(`${this.apiUrl}/generar-imagen`, { url }, { headers });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:3000/api/chatbot/consultar';

  constructor(private http: HttpClient) {}

  private obtenerTokenSeguro(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  enviarPregunta(pregunta: string): Observable<{respuesta: string}> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.obtenerTokenSeguro()}`);
    return this.http.post<{respuesta: string}>(this.apiUrl, { pregunta }, { headers });
  }
}
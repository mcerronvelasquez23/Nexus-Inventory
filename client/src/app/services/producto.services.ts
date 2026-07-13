import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) {}

  listar() {

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

  return this.http.get<any[]>(
    this.apiUrl,
    { headers }
    );
  }

  eliminar(id: string): Observable<any> {
  
    const token = localStorage.getItem('token');
  
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
  
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      { headers }
    );
  
  }
}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private api =
  'http://localhost:3000/api/categorias';

  constructor(
    private http: HttpClient
  ) {}

  obtenerCategorias() {

  const token =
    localStorage.getItem('token');

  return this.http.get<any[]>(
    'http://localhost:3000/api/categorias',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

}

}
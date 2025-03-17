import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private apiUrl = 'http://localhost:3000/api/profesores';

  constructor(private http: HttpClient) { }

  cargarActividades(nombreProfesor: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/actividades/${nombreProfesor}`);
  }

  buscarEstudiante(filtro: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/buscar-estudiante/${filtro}`);
  }

  registrarActividad(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar-actividad`, data);
  }

  // Nuevo método para obtener todos los profesores
  obtenerProfesores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/todos`);
  }

  // Actualizar el estatus de una actividad
  actualizarEstatus(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar-estatus`, data); // Asegúrate de que esta ruta exista en el backend
  }
}

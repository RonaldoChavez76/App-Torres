import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiUrl = 'http://localhost:3000/api/estudiantes';  // URL de la API para los alumnos

  constructor(private http: HttpClient) {}

  // Obtener la información personal del alumno
  obtenerInformacionPersonal(matricula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/perfil/${matricula}`);
  }

  // Consultar actividades del alumno
  consultarActividades(matricula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/actividades/${matricula}`);
  }

  // Consultar materias del alumno
  consultarMaterias(matricula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/materias/${matricula}`);
  }

  // Consultar información básica del alumno
  consultarInformacionPersonal(matricula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/informacion-personal/${matricula}`);
  }
}

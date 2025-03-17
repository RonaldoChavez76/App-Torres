// EstudianteService

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = 'http://localhost:3000/api/estudiantes'; // URL de la API para los estudiantes

  constructor(private http: HttpClient) {}

  // Obtener todos los estudiantes
  obtenerEstudiantes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/todos`); // Endpoint para obtener los estudiantes
  }

  // Consultar información personal de un estudiante
  consultarInformacionPersonal(matricula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/perfil/${matricula}`);
  }

  // Consultar las actividades asignadas a un estudiante
  consultarActividades(matricula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/actividades/${matricula}`); // Endpoint para obtener actividades asignadas
  }

  // Actualizar la información personal de un estudiante
  actualizarInformacionPersonal(matricula: string, estudianteInfo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil/${matricula}`, estudianteInfo); // Endpoint para actualizar la información personal del estudiante
  }

   // Consultar materias asignadas a un estudiante
   consultarMaterias(matricula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/materias/${matricula}`); // Endpoint para obtener materias asignadas
  }
}


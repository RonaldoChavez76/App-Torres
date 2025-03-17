import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  private apiUrl = 'http://localhost:3000/api/observaciones';

  constructor(private http: HttpClient) {}

  // Obtener todos los docentes
  obtenerDocentes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/docentes`);
  }

  // Obtener materias de un docente por su ID
  obtenerMateriasDocente(docenteId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/materias/${docenteId}`);
}

// Obtener estudiantes por materia del docente
obtenerEstudiantesPorMateria(docenteId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/estudiantes/${docenteId}`);
}

// Obtener observaciones de un estudiante por parte del docente
consultarObservaciones(docenteId: string, matriculaEstudiante: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/consultar/${docenteId}/${matriculaEstudiante}`);
}

 // Registrar una nueva observación
 registrarObservacion(datos: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/registrar`, datos);
}

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private apiUrl = 'http://localhost:3000/api/servicios-escolares';  // Asegúrate de que esta URL esté correcta

  constructor(private http: HttpClient) {}

  crearEstudiante(estudianteData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, estudianteData);
  }
  
  // Método para buscar estudiantes
  buscarEstudiantes(nombre: string, carrera: string, matriculaEstudiante: string): Observable<any> {
    let params = new HttpParams();

    if (nombre) {
      params = params.set('nombre', nombre);
    }

    if (carrera) {
      params = params.set('carrera', carrera);
    }

    if (matriculaEstudiante) {
      params = params.set('matriculaEstudiante', matriculaEstudiante);
    }

    return this.http.get<any>(`${this.apiUrl}/search`, { params });  // Aquí se agrega el prefijo /search
  }

  // Método para obtener la información del estudiante por matrícula
  obtenerEstudiantePorMatricula(matricula: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/info/${matricula}`);  // Aquí se usa /info
  }


  //Metodo para actualizar la informacion del estudiante
  actualizarEstudiante(matriculaEstudiante: string, updatedData: any): Observable<any> {
    console.log('Actualizando estudiante con matrícula:', matriculaEstudiante);  // Depuración
    return this.http.put<any>(`${this.apiUrl}/edit/${matriculaEstudiante}`, updatedData);
  }


  // Método para eliminar definitivamente un estudiante
  eliminarEstudianteDefinitivo(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/definitivo`);
  }

  // Método para eliminar temporalmente (soft delete) un estudiante
  softDeleteEstudiante(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
    
}

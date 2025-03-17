import { Component } from '@angular/core';
import { EstudianteService } from '../../../services/estudiante.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estudiante-search',
  templateUrl: './estudiante-search.component.html',
  styleUrl: './estudiante-search.component.css'
})
export class EstudianteSearchComponent {
  nombre: string = '';
  carrera: string = '';
  matriculaEstudiante: string = '';
  estudiantes: any[] = [];

  constructor(private estudianteService: EstudianteService, private router: Router) {}

  // Método para buscar estudiantes por nombre, carrera o matrícula
  buscarEstudiantes() {
    this.estudianteService.buscarEstudiantes(this.nombre, this.carrera, this.matriculaEstudiante).subscribe(
      (result) => {
        this.estudiantes = result;
      },
      (error) => {
        console.error('Error al buscar estudiantes', error);
        this.estudiantes = [];
      }
    );
  }

  // Redirigir al componente de información con el ID del estudiante
  verInformacion(estudiante: any) {
    // Aquí rediriges al componente de información utilizando la matrícula del estudiante
    this.router.navigate(['/estudiante/info', estudiante.matriculaEstudiante]);
  }

}

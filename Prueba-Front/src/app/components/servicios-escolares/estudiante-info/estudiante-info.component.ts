import { Component, Input } from '@angular/core';
import { EstudianteService } from '../../../services/estudiante.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-estudiante-info',
  templateUrl: './estudiante-info.component.html',
  styleUrl: './estudiante-info.component.css'
})
export class EstudianteInfoComponent {

  estudiante: any = null;
  matricula: string = '';

  constructor(
    private estudianteService: EstudianteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el parámetro de matrícula de la URL
    this.route.paramMap.subscribe((params) => {
      this.matricula = params.get('matricula')!;
      this.obtenerEstudianteInfo();
    });
  }

  obtenerEstudianteInfo() {
    this.estudianteService.obtenerEstudiantePorMatricula(this.matricula).subscribe(
      (data) => {
        this.estudiante = data;
      },
      (error) => {
        console.error('Error al obtener la información del estudiante', error);
      }
    );
  }

  // Redirigir al formulario de edición
  actualizarInformacion() {
    // Redirige al formulario de edición con la matrícula del estudiante, no el ID de MongoDB
    this.router.navigate(['/estudiante/edit', this.estudiante.matriculaEstudiante]);  // Usamos la matrícula
  }



  // Eliminar el estudiante de forma definitiva
  eliminarDefinitivamente() {
    if (confirm('¿Estás seguro de continuar con la eliminación definitiva?')) {
      // Se asume que el estudiante tiene el campo _id
      this.estudianteService.eliminarEstudianteDefinitivo(this.estudiante._id).subscribe(
        (response) => {
          alert('Estudiante eliminado definitivamente');
          // Redirigir a la lista o inicio
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error al eliminar el estudiante de forma definitiva', error);
          alert('No se pudo eliminar el estudiante');
        }
      );
    }
  }

  // Eliminar el estudiante de forma temporal (Soft Delete)
  eliminarTemporalmente() {
    if (confirm('¿Estás seguro de continuar con la eliminación temporal?')) {
      // Se asume que el estudiante tiene el campo _id
      this.estudianteService.softDeleteEstudiante(this.estudiante._id).subscribe(
        (response) => {
          alert('Estudiante eliminado temporalmente');
          // Redirigir a la lista o inicio
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error al realizar el soft delete del estudiante', error);
          alert('No se pudo eliminar el estudiante');
        }
      );
    }
  }
}


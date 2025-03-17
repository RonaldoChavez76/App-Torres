import { Component } from '@angular/core';
import { EstudianteService } from '../../../services/estudiante.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-estudiante-editar',
  templateUrl: './estudiante-editar.component.html',
  styleUrls: ['./estudiante-editar.component.css']
})
export class EstudianteEditarComponent {
  estudiante: any = null;
  isSubmitting = false;  // Variable para controlar el estado de envío

  constructor(
    private estudianteService: EstudianteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const matricula = this.route.snapshot.paramMap.get('matricula');  // Obtener la matrícula desde la URL
    console.log('Matrícula obtenida:', matricula);  // Depuración
    if (matricula) {
      this.estudianteService.obtenerEstudiantePorMatricula(matricula).subscribe(
        (data) => {
          this.estudiante = data;
        },
        (error) => {
          console.error('Error al cargar los detalles del estudiante', error);
        }
      );
    }
  }
  

  guardarCambios() {
    if (this.estudiante) {
      // Eliminar campos no deseados antes de enviar la solicitud
      delete this.estudiante._id;  // No enviar _id
      delete this.estudiante.__v;  // No enviar __v
      console.log("Datos a actualizar:", this.estudiante);  // Depuración
  
      // Asegúrate de que la matrícula esté correcta
      const matricula = this.estudiante.matriculaEstudiante;
      if (!matricula) {
        console.error('La matrícula no está definida');
        alert('Error: matrícula no definida');
        return;
      }
  
      this.estudianteService.actualizarEstudiante(matricula, this.estudiante).subscribe(
        (response) => {
          console.log("Respuesta del servidor:", response);  // Log para verificar la respuesta
          alert('Datos actualizados con éxito');
          this.router.navigate(['/estudiante/info', matricula]);  // Redirige después de actualizar
        },
        (error) => {
          console.error('Error al actualizar el estudiante', error);
          alert('Error al actualizar los datos');
        }
      );
    }
  }
  
  
  
}

import { Component, OnInit } from '@angular/core';
import { EstudianteService } from '../../services/estudiante.service';  // Asegúrate de importar el servicio

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit {
  estudiantes: any[] = [];  // Lista de estudiantes
  estudianteSeleccionado: string = '';  // Almacena la matrícula seleccionada
  estudianteInfo: any = {};  // Almacena los datos completos del estudiante
  editableFields: any = {
    correos: false,
    telefonos: false,
    domicilio: false,
    tutores: false
  };
  actividadesExtracurriculares: any[] = [];  // Aquí almacenaremos las actividades extracurriculares del estudiante
  materiasAsignadas: any[] = []; // Aquí almacenaremos las materias del estudiante


  constructor(private estudianteService: EstudianteService) { }

  ngOnInit(): void {
    // Inicializar con los estudiantes disponibles
    this.obtenerEstudiantes();
  }

  // Método para obtener la lista de estudiantes
  obtenerEstudiantes(): void {
    this.estudianteService.obtenerEstudiantes().subscribe(
      (data: any) => {
        this.estudiantes = data;  // Asigna los datos recibidos de la API a la variable `estudiantes`
      },
      error => {
        console.error('Error al obtener los estudiantes:', error);
        alert('Hubo un error al cargar los estudiantes.');
      }
    );
  }

  // Obtener la información del estudiante cuando se selecciona
   // Método para obtener la información personal del estudiante seleccionado
   obtenerInformacionEstudiante(): void {
    if (this.estudianteSeleccionado) {
      this.estudianteService.consultarInformacionPersonal(this.estudianteSeleccionado).subscribe(
        (data: any) => {
          this.estudianteInfo = data;  // Asigna los datos del estudiante a la propiedad `estudianteInfo`
        },
        error => {
          console.error('Error al obtener la información del estudiante:', error);
        }
      );
    }
  }

   // Método para permitir la edición de los campos específicos
   toggleEdit(field: string): void {
    this.editableFields[field] = true;
  }

  actualizarInformacionPersonal(): void {
    if (this.estudianteSeleccionado) {
      // Eliminar campos restringidos del objeto de datos
      const estudianteData = { ...this.estudianteInfo };
      delete estudianteData.matriculaEstudiante; // Evitamos enviar matriculaEstudiante
      delete estudianteData.fechaAlta; // Evitamos enviar fechaAlta
      delete estudianteData.fechaNacimiento; // Evitamos enviar fechaNacimiento
      delete estudianteData.sexo; // Evitamos enviar sexo
      delete estudianteData.rfc; // Evitamos enviar rfc
      delete estudianteData.promedioBachillerato; // Evitamos enviar promedioBachillerato
      delete estudianteData.especialidadBachillerato; // Evitamos enviar especialidadBachillerato
      delete estudianteData.carrera; // Evitamos enviar carrera
      delete estudianteData.especialidadCursar; // Evitamos enviar especialidadCursar
      delete estudianteData.certificadoBachillerato; // Evitamos enviar certificadoBachillerato
  
      // Ahora enviamos los datos actualizados
      this.estudianteService.actualizarInformacionPersonal(this.estudianteSeleccionado, estudianteData).subscribe(
        data => {
          alert('Información actualizada correctamente!');
          // Restringimos la edición nuevamente después de la actualización
          this.editableFields = {
            correos: false,
            telefonos: false,
            domicilio: false,
            tutores: false
          };
        },
        error => {
          console.error('Error al actualizar la información:', error);
          alert('Hubo un error al actualizar la información.');
        }
      );
    }
  }

  // Método para consultar las actividades extracurriculares asignadas al estudiante
  consultarActividadesExtracurriculares(): void {
    if (this.estudianteSeleccionado) {
      this.estudianteService.consultarActividades(this.estudianteSeleccionado).subscribe(
        data => {
          this.actividadesExtracurriculares = data;  // Almacena las actividades extracurriculares
        },
        error => {
          console.error('Error al consultar las actividades extracurriculares:', error);
          alert('Hubo un error al consultar las actividades extracurriculares.');
        }
      );
    }
  }

  // Método para consultar las materias asignadas al estudiante
  consultarMaterias(): void {
    if (this.estudianteSeleccionado) {
      this.estudianteService.consultarMaterias(this.estudianteSeleccionado).subscribe(
        data => {
          this.materiasAsignadas = data;  // Almacena las materias asignadas
        },
        error => {
          console.error('Error al consultar las materias:', error);
          alert('Hubo un error al consultar las materias.');
        }
      );
    }
  }

}

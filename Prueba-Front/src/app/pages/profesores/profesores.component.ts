import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../services/profesor.service';
import { EstudianteService } from '../../services/estudiante.service';  // Importar el servicio de estudiantes
import { AlumnoService } from '../../services/actividad.service'; // Importar el servicio de actividad

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css']
})
export class ProfesoresComponent implements OnInit {
  profesores: any[] = [];
  actividades: any[] = [];
  estudiantes: any[] = [];  // Lista de estudiantes
  actividadesEstudiante: any[] = []; // Aquí definimos actividadesEstudiante
  estudiantesFiltrados: any[] = []; // Estudiantes filtrados según búsqueda
  profesorSeleccionado: string = '';  // Profesor seleccionado por el usuario
  actividadSeleccionada: string = ''; // Actividad seleccionada
  estudianteSeleccionado: string = ''; // Estudiante seleccionado para asignar la actividad
  busqueda: string = '';  // Campo de búsqueda para matrícula o nombre
  estatusSeleccionado: string = 'Pendiente';  // Estatus de la actividad

  showActividades: boolean = false;  // Controla la visibilidad de las actividades
  showEstudiantes: boolean = false;  // Controla la visibilidad de los estudiantes

  constructor(
    private profesorService: ProfesorService, 
    private estudianteService: EstudianteService,
  ) {}

  ngOnInit(): void {
    // Obtener los profesores al cargar el componente
    this.profesorService.obtenerProfesores().subscribe(data => {
      this.profesores = data; // Recibe los profesores y los almacena
    });

    // Obtener estudiantes al cargar el componente
    this.obtenerEstudiantes(); // Cargar los estudiantes al inicio
  }

  // Método para cargar las actividades cuando se selecciona un profesor
  cargarActividades(): void {
    if (this.profesorSeleccionado) {
      this.profesorService.cargarActividades(this.profesorSeleccionado).subscribe(data => {
        this.actividades = data;
      });
    }
  }

  // Mostrar los estudiantes
  obtenerEstudiantes(): void {
    this.estudianteService.obtenerEstudiantes().subscribe(data => {
      this.estudiantes = data;
      this.estudiantesFiltrados = this.estudiantes;  // Inicialmente mostramos todos los estudiantes
    });
  }

  // Consultar las actividades del estudiante seleccionado
  cargarActividadesEstudiante(): void {
    if (this.estudianteSeleccionado) {
      this.estudianteService.consultarActividades(this.estudianteSeleccionado).subscribe(data => {
        this.actividadesEstudiante = data; // Aquí almacenamos las actividades del estudiante
      }, error => {
        console.error('Error al cargar actividades del estudiante:', error);
        alert('Hubo un error al cargar las actividades del estudiante.');
      });
    }
  }

  // Filtrar estudiantes por matrícula o nombre
  filtrarEstudiantes(): void {
    if (this.busqueda) {
      this.estudiantesFiltrados = this.estudiantes.filter(estudiante =>
        estudiante.matriculaEstudiante.includes(this.busqueda) || 
        estudiante.nombreCompleto.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    } else {
      this.estudiantesFiltrados = this.estudiantes;  // Si no hay búsqueda, mostramos todos
    }
  }

  // Asignar actividad al estudiante
  asignarActividad(): void {
    if (this.estudianteSeleccionado && this.actividadSeleccionada) {
      const actividadData = {
        nombreProfesor: this.profesorSeleccionado,
        matriculaEstudiante: this.estudianteSeleccionado,
        nombreActividad: this.actividadSeleccionada,
        resultado: 'Pendiente'
      };

      this.profesorService.registrarActividad(actividadData).subscribe(response => {
        alert('Actividad asignada correctamente!');
      }, error => {
        console.error('Error al asignar la actividad:', error);
        alert('Hubo un error al asignar la actividad.');
      });
    } else {
      alert('Por favor, seleccione un estudiante y una actividad.');
    }
  }

  // Métodos para mostrar/ocultar las listas
  toggleActividades() {
    this.showActividades = !this.showActividades;
  }

  toggleEstudiantes() {
    this.showEstudiantes = !this.showEstudiantes;
  }

  // Método para manejar la búsqueda con Enter o clic en botón
  buscarEstudiantes() {
    this.filtrarEstudiantes();  // Filtra la lista cuando se hace Enter o se da clic
  }

   // Método para actualizar el estatus de la actividad
actualizarEstatus(): void {
  if (this.estudianteSeleccionado && this.actividadSeleccionada && this.estatusSeleccionado) {
    const estatusData = {
      matriculaEstudiante: this.estudianteSeleccionado,
      nombreActividad: this.actividadSeleccionada,
      estatus: this.estatusSeleccionado
    };

    // Actualizar el estatus en el backend
    this.profesorService.actualizarEstatus(estatusData).subscribe(response => {
      alert('Estatus actualizado correctamente!');
      
      // Después de actualizar, volvemos a cargar las actividades del estudiante para reflejar el cambio
      this.cargarActividadesEstudiante();
    }, error => {
      console.error('Error al actualizar el estatus:', error);
      alert('Hubo un error al actualizar el estatus.');
    });
  } else {
    alert('Por favor, seleccione un estudiante, una actividad y un estatus.');
  }
}

}

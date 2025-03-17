import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocenteService } from '../../../services/docente.service';

@Component({
  selector: 'app-crear-observacion',
  templateUrl: './crear-observacion.component.html',
  styleUrl: './crear-observacion.component.css'
})
export class CrearObservacionComponent {
  docenteId: string = '';
  materias: any[] = [];
  estudiantes: any[] = [];
  materiaSeleccionada: string = '';
  estudianteSeleccionado: string = '';
  descripcion: string = '';
  semestreSeleccionado: number = 1;  // Valor por defecto del semestre
  anioSeleccionado: number = new Date().getFullYear();  // Año por defecto

  constructor(
    private route: ActivatedRoute,
    private docenteService: DocenteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.docenteId = this.route.snapshot.paramMap.get('docenteId') || '';
    this.obtenerMaterias();
  }

  // Obtener materias del docente usando el service
  obtenerMaterias() {
    this.docenteService.obtenerMateriasDocente(this.docenteId).subscribe(
      response => {
        this.materias = response.materias;
      },
      error => {
        console.error('Error al obtener materias:', error);
      }
    );
  }

  // Obtener estudiantes de la materia seleccionada
  obtenerEstudiantes() {
    if (!this.materiaSeleccionada) {
      alert('Selecciona una materia primero');
      return;
    }

    this.docenteService.obtenerEstudiantesPorMateria(this.docenteId).subscribe(
      response => {
        this.estudiantes = response.estudiantes;
      },
      error => {
        console.error('Error al obtener estudiantes:', error);
      }
    );
  }

  // Registrar observación del docente
  registrarObservacion() {
    if (!this.estudianteSeleccionado || !this.descripcion) {
      alert('Selecciona un estudiante y escribe la observación');
      return;
    }

    const datos = {
      docenteId: this.docenteId,
      matriculaEstudiante: this.estudianteSeleccionado,
      asignatura: this.materiaSeleccionada,
      semestre: this.semestreSeleccionado,
      anio: this.anioSeleccionado,
      descripcion: this.descripcion
    };

    this.docenteService.registrarObservacion(datos).subscribe(
      response => {
        
        this.router.navigate(['/']);  // Esta es la ruta para la página de búsqueda de estudiantes
        alert('Registrado exitosamente');
      },
      error => {
        console.error("Error al registrar observación:", error);
        alert('Error al registrar la observación');
      }
    );
  }
}

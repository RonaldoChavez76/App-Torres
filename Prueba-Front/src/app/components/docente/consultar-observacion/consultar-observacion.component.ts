import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocenteService } from '../../../services/docente.service';

@Component({
  selector: 'app-consultar-observacion',
  templateUrl: './consultar-observacion.component.html',
  styleUrl: './consultar-observacion.component.css'
})
export class ConsultarObservacionComponent {
  docenteId: string = '';
  materias: any[] = [];
  materiaSeleccionada: string = '';
  estudiantes: any[] = [];
  estudianteSeleccionado: string = '';
  observaciones: any[] = [];

  constructor(private route: ActivatedRoute, private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.docenteId = this.route.snapshot.paramMap.get('docenteId') || '';
    this.obtenerMaterias();
  }

  // Obtener materias del docente desde el service
  obtenerMaterias() {
    this.docenteService.obtenerMateriasDocente(this.docenteId).subscribe(response => {
      this.materias = response.materias;
    }, error => {
      console.error('Error al obtener materias:', error);
    });
  }

  // Obtener estudiantes según la materia seleccionada
  obtenerEstudiantes() {
    if (!this.materiaSeleccionada) {
      alert('Selecciona una materia primero');
      return;
    }

    this.docenteService.obtenerEstudiantesPorMateria(this.docenteId).subscribe(response => {
      this.estudiantes = response.estudiantes;
    }, error => {
      console.error('Error al obtener estudiantes:', error);
    });
  }

  // Consultar observaciones de un estudiante
  consultarObservaciones() {
    if (!this.estudianteSeleccionado) {
      alert('Selecciona un estudiante primero');
      return;
    }

    this.docenteService.consultarObservaciones(this.docenteId, this.estudianteSeleccionado).subscribe(response => {
      this.observaciones = response.observaciones;
    }, error => {
      console.error('Error al obtener observaciones:', error);
    });
  }
}

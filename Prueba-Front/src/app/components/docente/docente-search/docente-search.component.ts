import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../services/docente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-docente-search',
  templateUrl: './docente-search.component.html',
  styleUrl: './docente-search.component.css'
})

export class DocenteSearchComponent implements OnInit{

  docentes: any[] = [];
  filtro: string = '';  // Filtro de búsqueda para los docentes
  docenteSeleccionado: string = '';  // ID del docente seleccionado
  materias: any[] = [];  // Materias del docente

  constructor(private docenteService: DocenteService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerDocentes();
  }

  // Obtener la lista de docentes desde el servicio
  obtenerDocentes() {
    this.docenteService.obtenerDocentes().subscribe(
      response => {
        console.log("Docentes recibidos:", response);
        this.docentes = response.docentes;
      },
      error => {
        console.error("Error al obtener docentes:", error);
      }
    );
  }

  // Cargar materias del docente para agregar observación
  cargarMaterias() {
    if (!this.docenteSeleccionado) {
      alert('Selecciona un docente antes de continuar');
      return;
    }

    this.docenteService.obtenerMateriasDocente(this.docenteSeleccionado).subscribe(
      response => {
        console.log("Materias del docente:", response);
        this.materias = response.materias;
        this.router.navigate(['/observacion', this.docenteSeleccionado]); // Navegar a la pantalla de observaciones
      },
      error => {
        console.error("Error al obtener materias:", error);
      }
    );
  }

  // Redirigir a la pantalla de consulta de observaciones
  consultarObservaciones() {
    if (!this.docenteSeleccionado) {
      alert('Selecciona un docente antes de continuar');
      return;
    }

    this.router.navigate(['/consultar-observaciones', this.docenteSeleccionado]);  // Redirigir a la vista de consulta
  }
}

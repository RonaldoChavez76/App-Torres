import { Component } from '@angular/core';
import { ServiciosEscolaresService } from '../../../services/servicios-escolares.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-estudiante-registrar',
  templateUrl: './estudiante-registrar.component.html',
  styleUrl: './estudiante-registrar.component.css'
})
export class EstudianteRegistrarComponent {

  estudianteForm: FormGroup;
  foto: File | null = null;

  // Nuevos arrays para carreras y especialidades
  carreras: any[] = [];
  especialidades: any[] = [];

  constructor(private fb: FormBuilder, 
              private estudianteService: ServiciosEscolaresService, 
              private router: Router) {
    this.estudianteForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      // Se cambia el input por select, por lo que el valor se asignará al seleccionar una carrera
      carrera: ['', Validators.required],
      especialidadCursar: ['', Validators.required],
      matriculaEstudiante: [{ value: '', disabled: true }],
      semestre: ['', Validators.required],
      promedioBachillerato: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      certificadoBachillerato: ['', [Validators.required, Validators.min(0), Validators.max(1)]],
      especialidadBachillerato: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      rfc: [''],
      domicilio: this.fb.group({
        calle: [''],
        numeroInterior: [''],
        numeroExterior: [''],
        colonia: [''],
        codigoPostal: [''],
        ciudad: ['']
      }),
      // FormArray para teléfonos y correos del estudiante
      telefonos: this.fb.array([]),
      correos: this.fb.array([]),
      tutores: this.fb.array([])
    });

    // Cargar las carreras al inicializar
    this.getCarreras();
  }

  // Getters para los FormArray
  get telefonos(): FormArray {
    return this.estudianteForm.get('telefonos') as FormArray;
  }
  get correos(): FormArray {
    return this.estudianteForm.get('correos') as FormArray;
  }
  get tutores(): FormArray {
    return this.estudianteForm.get('tutores') as FormArray;
  }

  // Métodos para agregar/eliminar teléfonos y correos (como ya tienes)
  agregarTelefono() {
    this.telefonos.push(this.fb.control(''));
  }
  eliminarTelefono(index: number) {
    this.telefonos.removeAt(index);
  }
  agregarCorreo() {
    this.correos.push(this.fb.control(''));
  }
  eliminarCorreo(index: number) {
    this.correos.removeAt(index);
  }
  agregarTutor() {
    const tutorForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      domicilio: this.fb.group({
        calle: [''],
        numeroInterior: [''],
        numeroExterior: [''],
        colonia: [''],
        codigoPostal: [''],
        ciudad: ['']
      }),
      telefonos: [''],
      correos: ['']
    });
    this.tutores.push(tutorForm);
  }
  eliminarTutor(index: number) {
    this.tutores.removeAt(index);
  }

  onFileChange(event: any) {
    this.foto = event.target.files[0];
  }

  // Método para cargar carreras (asegúrate de que exista el endpoint en el backend)
  getCarreras(): void {
    this.estudianteService.getCarreras().subscribe(
      data => {
        // Se asume que el backend responde con { carreras: [...] }
        this.carreras = data.carreras;
      },
      error => {
        console.error('Error al obtener carreras:', error);
      }
    );
  }

  // Método que se ejecuta cuando se selecciona una carrera
  onCarreraChange(selectedCarrera: string): void {
    const carreraSeleccionada = this.carreras.find(c => c.nombreCarrera === selectedCarrera);
    if (carreraSeleccionada) {
      this.especialidades = carreraSeleccionada.especialidades;
    } else {
      this.especialidades = [];
    }
  }

  submitForm() {
    const formData = new FormData();
    const estudianteData = this.estudianteForm.value;
    
    if (this.foto) {
      formData.append('foto', this.foto);
    }
    
    // Convertir cada campo a FormData. Si el valor es un objeto (o array), se convierte con JSON.stringify
    Object.keys(estudianteData).forEach(key => {
      if (typeof estudianteData[key] === 'object') {
        formData.append(key, JSON.stringify(estudianteData[key]));
      } else {
        formData.append(key, estudianteData[key]);
      }
    });
    
    this.estudianteService.crearEstudiante(formData).subscribe(response => {
      console.log('Estudiante registrado:', response);
      alert('Estudiante registrado con éxito');
      this.router.navigate(['/']);  // Redirigir a la página principal o a la ruta deseada
    }, error => {
      console.error('Error:', error);
    });
  }
}

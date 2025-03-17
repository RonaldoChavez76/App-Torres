import { Component } from '@angular/core';
import { EstudianteService } from '../../../services/estudiante.service';
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

  constructor(private fb: FormBuilder, private estudianteService: EstudianteService, private router: Router) {
    this.estudianteForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      carrera: ['', Validators.required],
      matriculaEstudiante: [{ value: '', disabled: true }],
      semestre: ['', Validators.required],
      promedioBachillerato: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
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
      // Nuevos FormArray para teléfonos y correos del estudiante
      telefonos: this.fb.array([]),
      correos: this.fb.array([]),
      tutores: this.fb.array([])
    });
  }

  // Getter para acceder a los arrays
  get telefonos(): FormArray {
    return this.estudianteForm.get('telefonos') as FormArray;
  }
  get correos(): FormArray {
    return this.estudianteForm.get('correos') as FormArray;
  }
  get tutores(): FormArray {
    return this.estudianteForm.get('tutores') as FormArray;
  }

  // Métodos para agregar/eliminar teléfonos
  agregarTelefono() {
    this.telefonos.push(this.fb.control(''));
  }
  eliminarTelefono(index: number) {
    this.telefonos.removeAt(index);
  }

  // Métodos para agregar/eliminar correos
  agregarCorreo() {
    this.correos.push(this.fb.control(''));
  }
  eliminarCorreo(index: number) {
    this.correos.removeAt(index);
  }

  // Métodos existentes para tutores
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
      this.router.navigate(['/']);  // Redirigir a la página principal o la ruta que desees
    }, error => {
      console.error('Error:', error);
    });
  }
}

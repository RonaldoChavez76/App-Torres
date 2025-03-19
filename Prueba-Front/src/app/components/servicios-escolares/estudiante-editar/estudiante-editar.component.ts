import { Component } from '@angular/core';
import { ServiciosEscolaresService } from '../../../services/servicios-escolares.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-estudiante-editar',
  templateUrl: './estudiante-editar.component.html',
  styleUrls: ['./estudiante-editar.component.css']
})
export class EstudianteEditarComponent {
  estudianteForm!: FormGroup;
  foto: File | null = null;
  carreras: any[] = [];  // Lista de carreras
  especialidades: any[] = [];  // Lista de especialidades basadas en la carrera seleccionada

  constructor(
    private fb: FormBuilder,
    private estudianteService: ServiciosEscolaresService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const matricula = this.route.snapshot.paramMap.get('matricula');
    if (matricula) {
      // Inicializa el formulario con la misma estructura que en el registro
      this.estudianteForm = this.fb.group({
        nombreCompleto: ['', Validators.required],
        apellidoPaterno: ['', Validators.required],
        carrera: ['', Validators.required],
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
        telefonos: this.fb.array([]),
        correos: this.fb.array([]),
        tutores: this.fb.array([]),
        especialidadCursar: ['', Validators.required],  // Especialidad a cursar
      });

      // Cargar los datos del estudiante y actualizar el formulario
      this.estudianteService.obtenerEstudiantePorMatricula(matricula).subscribe(
        (data) => {
          // Suponiendo que el API devuelve directamente el objeto estudiante
          this.estudianteForm.patchValue(data);

          // Llenar los FormArray de teléfonos, correos y tutores
          this.setTelefonos(data.telefonos);
          this.setCorreos(data.correos);
          this.setTutores(data.tutores);

          // Aquí actualizas las especialidades basadas en la carrera seleccionada
          const carreraSeleccionada = data.carrera;
          this.onCarreraChange(carreraSeleccionada);
        },
        (error) => {
          console.error('Error al cargar los detalles del estudiante', error);
        }
      );
    }

    // Cargar las carreras disponibles
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

  // Métodos para agregar/eliminar tutores
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

  // Método para cargar las carreras
  getCarreras(): void {
    this.estudianteService.getCarreras().subscribe(
      data => {
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

  // Método para llenar los teléfonos en el FormArray
  setTelefonos(telefonos: string[]) {
    const telefonosArray = this.telefonos;
    telefonos.forEach(tel => {
      telefonosArray.push(this.fb.control(tel));
    });
  }

  // Método para llenar los correos en el FormArray
  setCorreos(correos: string[]) {
    const correosArray = this.correos;
    correos.forEach(correo => {
      correosArray.push(this.fb.control(correo));
    });
  }

  // Método para llenar los tutores en el FormArray
  setTutores(tutores: any[]) {
    const tutoresArray = this.tutores;
    tutores.forEach(tutor => {
      tutoresArray.push(this.fb.group({
        nombreCompleto: [tutor.nombreCompleto, Validators.required],
        domicilio: this.fb.group({
          calle: [tutor.domicilio.calle],
          numeroInterior: [tutor.domicilio.numeroInterior],
          numeroExterior: [tutor.domicilio.numeroExterior],
          colonia: [tutor.domicilio.colonia],
          codigoPostal: [tutor.domicilio.codigoPostal],
          ciudad: [tutor.domicilio.ciudad]
        }),
        telefonos: [tutor.telefonos],
        correos: [tutor.correos]
      }));
    });
  }

  // Guardar cambios
  guardarCambios(): void {
    if (this.estudianteForm.valid) {
      const formData = new FormData();
      const estudianteData = this.estudianteForm.getRawValue(); // Obtener los valores, incluso los campos deshabilitados

      if (this.foto) {
        formData.append('foto', this.foto);
      }

      // Convertir cada campo a FormData. Si el valor es un objeto o array, usamos JSON.stringify
      Object.keys(estudianteData).forEach(key => {
        if (typeof estudianteData[key] === 'object') {
          formData.append(key, JSON.stringify(estudianteData[key]));
        } else {
          formData.append(key, estudianteData[key]);
        }
      });

      const matricula = estudianteData.matriculaEstudiante;
      this.estudianteService.actualizarEstudiante(matricula, formData).subscribe(
        (response) => {
          alert('Datos actualizados con éxito');
          this.router.navigate(['/estudiante/info', matricula]);
        },
        (error) => {
          console.error('Error al actualizar el estudiante', error);
          alert('Error al actualizar los datos');
        }
      );
    }
  }
}

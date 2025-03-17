import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EstudianteSearchComponent } from './components/servicios-escolares/estudiante-search/estudiante-search.component';
import { EstudianteInfoComponent } from './components/servicios-escolares/estudiante-info/estudiante-info.component';
import { EstudianteEditarComponent } from './components/servicios-escolares/estudiante-editar/estudiante-editar.component';
import { EstudianteRegistrarComponent } from './components/servicios-escolares/estudiante-registrar/estudiante-registrar.component';
import { DocenteSearchComponent } from './components/docente/docente-search/docente-search.component';
import { CrearObservacionComponent } from './components/docente/crear-observacion/crear-observacion.component';
import { ConsultarObservacionComponent } from './components/docente/consultar-observacion/consultar-observacion.component';
import { ProfesoresComponent } from './pages/profesores/profesores.component';
import { EstudiantesComponent } from './pages/estudiantes/estudiantes.component';
import { ActividadesComponent } from './pages/actividades/actividades.component';


const routes: Routes = [
  { path: '', component: EstudianteSearchComponent },
  { path: 'estudiante/info/:matricula', component: EstudianteInfoComponent },
  { path: 'estudiante/edit/:matricula', component: EstudianteEditarComponent },
  { path: 'registrar-estudiante', component: EstudianteRegistrarComponent},
  { path: 'profesor-observacion', component: DocenteSearchComponent},
  { path: 'observacion/:docenteId', component: CrearObservacionComponent },
  { path: 'consultar-observaciones/:docenteId', component: ConsultarObservacionComponent },
  { path: 'profesores', component: ProfesoresComponent },
  { path: 'estudiantes', component: EstudiantesComponent },
  { path: 'actividades', component: ActividadesComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

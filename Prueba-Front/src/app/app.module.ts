import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstudianteSearchComponent } from './components/servicios-escolares/estudiante-search/estudiante-search.component';
import { EstudianteInfoComponent } from './components/servicios-escolares/estudiante-info/estudiante-info.component';
import { EstudianteEditarComponent } from './components/servicios-escolares/estudiante-editar/estudiante-editar.component';
import { EstudianteRegistrarComponent } from './components/servicios-escolares/estudiante-registrar/estudiante-registrar.component';
import { DocenteSearchComponent } from './components/docente/docente-search/docente-search.component';
import { FilterDocentesPipe } from './pipes/filter-docentes.pipe';
import { CrearObservacionComponent } from './components/docente/crear-observacion/crear-observacion.component';
import { ConsultarObservacionComponent } from './components/docente/consultar-observacion/consultar-observacion.component';

@NgModule({
  declarations: [
    AppComponent,
    EstudianteSearchComponent,
    EstudianteInfoComponent,
    EstudianteEditarComponent,
    EstudianteRegistrarComponent,
    DocenteSearchComponent,
    FilterDocentesPipe,
    CrearObservacionComponent,
    ConsultarObservacionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

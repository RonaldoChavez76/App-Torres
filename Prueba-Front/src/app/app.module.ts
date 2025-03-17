import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductoListComponent } from './components/producto-list/producto-list.component';
import { ProductoCreateComponent } from './components/producto-create/producto-create.component';
import { ProductoEditComponent } from './components/producto-edit/producto-edit.component';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfesoresComponent } from './pages/profesores/profesores.component';
import { EstudiantesComponent } from './pages/estudiantes/estudiantes.component';
import { ActividadesComponent } from './pages/actividades/actividades.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductoListComponent,
    ProductoCreateComponent,
    ProductoEditComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ProfesoresComponent,
    EstudiantesComponent,
    ActividadesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,  // Asegúrate de que FormsModule esté aquí
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

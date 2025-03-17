import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoListComponent } from './components/producto-list/producto-list.component';
import { ProductoCreateComponent } from './components/producto-create/producto-create.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfesoresComponent } from './pages/profesores/profesores.component';
import { EstudiantesComponent } from './pages/estudiantes/estudiantes.component';
import { ActividadesComponent } from './pages/actividades/actividades.component';

const routes: Routes = [
  { path: 'productos', component: ProductoListComponent },
  { path: 'crear-producto', component: ProductoCreateComponent },
  { path: '', component: HomeComponent },
  { path: 'profesores', component: ProfesoresComponent },
  { path: 'estudiantes', component: EstudiantesComponent },
  { path: 'actividades', component: ActividadesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

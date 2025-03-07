import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoListComponent } from './components/producto-list/producto-list.component';
import { ProductoCreateComponent } from './components/producto-create/producto-create.component';

const routes: Routes = [
  { path: 'productos', component: ProductoListComponent },
  { path: 'crear-producto', component: ProductoCreateComponent },
  { path: '', redirectTo: '/productos', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

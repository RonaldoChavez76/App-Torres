import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';


@Component({
  selector: 'app-producto-create',
  templateUrl: './producto-create.component.html',
  styleUrls: ['./producto-create.component.css']
})
export class ProductoCreateComponent {

  producto = {
    nombre: '',
    precio: null,
    descripcion: ''
  };

  constructor(private productoService: ProductoService, private router: Router) { }

  crearProducto(): void {
    this.productoService.createProducto(this.producto).subscribe(() => {
      this.router.navigate(['/productos']);
    });
  }
}

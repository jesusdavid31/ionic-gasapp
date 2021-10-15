import { Component, Input, OnInit } from '@angular/core';
import { ProductoPedido } from '../../models/models';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-item-carrito',
  templateUrl: './item-carrito.component.html',
  styleUrls: ['./item-carrito.component.scss'],
})
export class ItemCarritoComponent implements OnInit {

  //Esto input es como decir que le va entrar un ProductoPedido, osea algo de ese tipo ProductoPedido
  //el productoPedido con minuscula es el nombre que lo identifica pa que funcione alla también en el carrito.component.hmtl que es donde
  //se esta utilizando y es lo que se esta mandando practicamente con ese nombre desde carrito.html, en este caso la variable producto del ngFor
  @Input() productoPedido: ProductoPedido;
  @Input() botones = true;

  constructor(public carritoService: CarritoService) { }

  ngOnInit() {}

  addCarrito() {
    console.log('addCarrito()');
    this.carritoService.addProducto(this.productoPedido.producto);
  }

  removeCarrito() {
      this.carritoService.removeProducto(this.productoPedido.producto);
  }

}

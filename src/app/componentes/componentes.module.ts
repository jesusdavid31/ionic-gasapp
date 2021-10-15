import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoComponent } from './producto/producto.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ItemCarritoComponent } from './item-carrito/item-carrito.component';


@NgModule({
  declarations: [
    ProductoComponent,
    ItemCarritoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ], exports: [
    ProductoComponent,
    ItemCarritoComponent
  ]
})
export class ComponentesModule { }

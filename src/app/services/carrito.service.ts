import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Producto, Pedido, Cliente, ProductoPedido } from '../models/models';
import { FirebaseauthService } from './firebaseauth.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private pedido: Pedido;
  pedido$ = new Subject<Pedido>();
  path = 'carrito/';
  uid = '';
  cliente: Cliente;

  carritoSuscriber: Subscription;
  clienteSuscriber: Subscription;

  constructor(public firebaseauthService: FirebaseauthService,
              public firestoreService: FirestoreService,
              public router: Router) {

    //Esto es para verificar si el usuario esta autenticado o no
    //   console.log('CarritoService inicio');
      this.initCarrito();
      this.firebaseauthService.stateAuth().subscribe( res => {
            // console.log(res);
            //Si la respuesta es diferente de null es porque esta autenticado
            if (res !== null) {
                  this.uid = res.uid;
                  this.loadCLiente();
            }
      });
   }

  loadCarrito() {
      //Esta ruta es donde se va guardar el pedido agregado al carrito
      const path = 'Clientes/' + this.uid + '/' + 'carrito';
      if (this.carritoSuscriber) {
        this.carritoSuscriber.unsubscribe();
      }
      this.carritoSuscriber = this.firestoreService.getDoc<Pedido>(path, this.uid).subscribe( res => {
            //   console.log(res);
              if (res) {
                    this.pedido = res;
                    this.pedido$.next(this.pedido);
              } else {
                  this.initCarrito();
              }

      });
  }

  initCarrito() {
      //Inicializamos el pedido
      this.pedido = {
          id: this.uid,
          cliente: this.cliente,
          productos: [],
          precioTotal: null,
          estado: 'enviado',
          fecha: new Date(),
          valoracion: null,
      };
      this.pedido$.next(this.pedido);
  }

  loadCLiente() {
      const path = 'Clientes';
      this.clienteSuscriber = this.firestoreService.getDoc<Cliente>(path, this.uid).subscribe( res => {
            this.cliente = res;
            // console.log('loadCLiente() ->', res);
            this.loadCarrito();
            this.clienteSuscriber.unsubscribe();
      });
  }

  getCarrito(): Observable<Pedido> {
    setTimeout(() => {
        this.pedido$.next(this.pedido);
    }, 100);
    return this.pedido$.asObservable();
  }

  addProducto(producto: Producto) {
     console.log('addProducto ->', this.uid);
     if (this.uid.length) {
        //Aqui buscamos con el fin si existe un id igual al producto.id que se esta pasando por parametro
        //Lo buscamos en el array de productos que esta en this.pedido, el find devuelve el primer valor del arreglo que coincida con la busqueda
        const item = this.pedido.productos.find( productoPedido => {
            return (productoPedido.producto.id === producto.id)
        });
        //Si el find de arriba no encuentra nada devuelve un undefined, por lo tanto hacemos la condición de que si es diferente de
        //undefined es porque si encontro algo, por lo tanto como ya existe ese producto en el arreglo no lo agregamos de nuevo como tal
        //sino que a la cantidad le sumamos para indicar que quieres un producto mas de ese mismo producto 
        if (item !== undefined) {
            item.cantidad ++;
        } else {
           //Sino es porque no encontro nada en el arreglo y alli si puedes hacer un push a ese array
           //el producto solo, es porque recuerda que si pones producto: producto es lo mismo que producto solo ya que tienen el mismo nombre
           const add: ProductoPedido = {
              cantidad: 1,
              producto,
           };
           this.pedido.productos.push(add);
        }
     } else {
          //Aqui entra si no estamos logueados, nos lleva al perfil 
          this.router.navigate(['/perfil']);
          return;
     }
     this.pedido$.next(this.pedido);
     console.log('en add pedido -> ', this.pedido);
     const path = 'Clientes/' + this.uid + '/' + this.path;
     this.firestoreService.createDoc(this.pedido, path, this.uid).then( () => {
          console.log('añdido con exito');
     });
  }

  removeProducto(producto: Producto) {
        console.log('removeProducto ->', this.uid);
        if (this.uid.length) {
            let position = 0;
            const item = this.pedido.productos.find( (productoPedido, index) => {
                position = index;
                return (productoPedido.producto.id === producto.id)
            });
            if (item !== undefined) {
                item.cantidad --;
                if (item.cantidad === 0) {
                     this.pedido.productos.splice(position, 1);
                }
                console.log('en remove pedido -> ', this.pedido);
                const path = 'Clientes/' + this.uid + '/' + this.path;
                this.firestoreService.createDoc(this.pedido, path, this.uid).then( () => {
                    console.log('removido con exito');
                });
            }
        }
  }

  realizarPedido() {

  }

  clearCarrito() {
      const path = 'Clientes/' + this.uid + '/' + 'carrito';
      this.firestoreService.deleteDoc(path, this.uid).then( () => {
          this.initCarrito();
      });
  }

}

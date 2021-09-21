import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';
import { Producto } from '../../models/models';

@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit {

  productos: Producto[] = [];

  newProducto: Producto;

  //Esto es para ocultar el editar o añadir un nuevo producto
  enableNewProducto = false;

  private path = 'Productos/';

  newImage = '';
  newFile: any;

  loading: any;

  constructor(
    public menucontroler: MenuController,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,  
  ) { }

  ngOnInit() {
    this.getProductos();
  }

  openMenu(){
    this.menucontroler.toggle('principal');
  }

  async guardarProducto() {
    this.presentLoading();
    // const path = 'Productos';
    // const name = this.newProducto.nombre;
    // if (this.newFile !== undefined) {
    //   const res = await this.firestorageService.uploadImage(this.newFile, path, name);
    //   this.newProducto.foto = res;
    // }
    this.firestoreService.createDoc(this.newProducto, this.path, this.newProducto.id).then( res => {
         this.loading.dismiss();
         this.presentToast('Producto guardado con éxito');
    }).catch( error => {
       this.presentToast('No se pude guardar correctamente el producto');
    });
}

  getProductos() {
    this.firestoreService.getCollection<Producto>(this.path).subscribe(  res => {
           this.productos = res;
    });
  }

  async deleteProducto(producto: Producto) {

    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message: '¿Esta seguro que desea <strong>eliminar</strong> este producto?',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            // this.alertController.dismiss();
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.firestoreService.deleteDoc(this.path, producto.id).then( res => {
              this.presentToast('Eliminado con éxito');
              this.alertController.dismiss();
            }).catch( error => {
                this.presentToast('No se pude eliminar correctamente');
            });
          }
        }
      ]
    });
    await alert.present();
}

  nuevo() {
    this.enableNewProducto = true;
    this.newProducto = {
      nombre: '',
      precioNormal: null,
      precioReducido: null,
      foto: '',
      id: this.firestoreService.getId(),
      fecha: new Date()
    };
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'Guardando...',
    });
    await this.loading.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 2000,
      color: 'light',
    });
    toast.present();
  }

}

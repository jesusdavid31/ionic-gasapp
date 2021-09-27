import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { SetProductosComponent } from './backend/set-productos/set-productos.component';
import { PerfilComponent } from './page/perfil/perfil.component';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'set-productos', component: SetProductosComponent
  },
  { path: 'perfil', component: PerfilComponent },
  {
    path: '', component: HomeComponent
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

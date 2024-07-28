import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { HomeComponent } from './pages/home/home.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';


const routes: Routes = [
  {
    path: 'products',
    component: HomeComponent
  },
  {
    path: 'add-product',
    component: AddProductComponent
  },
  {
    path: 'edit-product/:id',
    component: EditProductComponent
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialProductsRouting { }

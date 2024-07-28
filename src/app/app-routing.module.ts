import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'financial',
    loadChildren: () =>
      import('./financial-products/financial-products.module').then((m) => m.FinancialProductsModule),
  },
  {
    path: '**',
    redirectTo: 'financial',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

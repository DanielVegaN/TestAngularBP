import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddProductComponent } from './pages/add-product/add-product.component';
import { FinancialProductsRouting } from './financial-products.routing.module';
import { HomeComponent } from './pages/home/home.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { SharedModule } from '../shared/shared.module';
import { TableHomeComponent } from './components/table-home/table-home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditProductComponent } from './pages/edit-product/edit-product.component';

@NgModule({
  declarations: [
    AddProductComponent,
    EditProductComponent,
    HomeComponent,
    SearchBoxComponent,
    TableHomeComponent,
  ],
  imports: [
    CommonModule,
    FinancialProductsRouting,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class FinancialProductsModule {}

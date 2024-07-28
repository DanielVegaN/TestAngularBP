import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormComponent } from './components/form/form.component';
import { HeaderComponent } from './components/header/header.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { LogoComponent } from './components/logo/logo.component';
import { ModalDeleteComponent } from './components/modal-delete/modal-delete.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SkeletonFormComponent } from './components/skeleton-form/skeleton-form.component';
import { SkeletonTableComponent } from './components/skeleton-table/skeleton-table.component';
import { TableProductsComponent } from './components/table-products/table-products.component';

@NgModule({
  declarations: [
    FormComponent,
    HeaderComponent,
    InputTextComponent,
    LogoComponent,
    ModalDeleteComponent,
    SkeletonFormComponent,
    SkeletonTableComponent,
    TableProductsComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    FormComponent,
    HeaderComponent,
    InputTextComponent,
    LogoComponent,
    ModalDeleteComponent,
    SkeletonFormComponent,
    SkeletonTableComponent,
    TableProductsComponent,
  ],
})
export class SharedModule {}

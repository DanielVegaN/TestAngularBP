import { Component } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  constructor(public productService: ProductService){}

  onAddProduct(product: Product): void {
    this.productService.addProduct(product).subscribe();
  }
}

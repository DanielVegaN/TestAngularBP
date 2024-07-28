import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

import { Product } from '../../interfaces/product';

@Component({
  selector: 'financial-products-table-home',
  templateUrl: './table-home.component.html',
  styleUrl: './table-home.component.css',
})
export class TableHomeComponent implements OnInit {
  public products: Product[] = [];
  public isLoading: boolean = true;

  constructor(
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.isLoading = false;
    });
  }

  searchProduct(products: Product[]): void {
    this.products = products;
  }

  deleteProduct(product: Product): void {
    this.isLoading = true;
    this.productService.deleteProduct(product).subscribe(() => {
      this.getProducts();
    });
  }
}

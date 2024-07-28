import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../interfaces/product';
import { debounceTime, Observable, Subject } from 'rxjs';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'financial-products-search-box',
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css',
})
export class SearchBoxComponent implements OnInit {
  @Output()
  public productsSearched = new EventEmitter<Product[]>();

  private debouncer: Subject<string> = new Subject<string>();

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(100)).subscribe((value) => {
      this.filterProducts(value);
    });
  }

  filterProducts(value: string): void {
    this.productService.getProducts().subscribe((products) => {
      if (value !== "") {
        const productsFilter = products.filter(
          (p) => p.name.includes(value) || p.description.includes(value)
        );
        this.productsSearched.emit(productsFilter);
      } else {
        this.productsSearched.emit(products);
      }
    });
  }

  searchProducts(term: string): void {
    this.debouncer.next(term);
  }
}

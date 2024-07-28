import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { catchError, first, map, Observable, of, switchMap, tap } from 'rxjs';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent implements OnInit {
  public productUpdate$: Observable<Product | null> = of(null);

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productUpdate$ = this.activatedRoute.params.pipe(
      switchMap(({ id }) => this.getProduct(id)),
      tap((result) => {
        if (result === null) {
          this.router.navigateByUrl('/financial/products');
          return of(null);
        } else {
          return result;
        }
      })
    );
  }

  private getProduct(id: string): Observable<Product | null> {
    return this.productService.getProducts().pipe(
      map((products) => products.find((product) => product.id === id) || null),
      first()
    );
  }

  onEditProduct(product: Product): void {
    this.productService.editProduct(product).subscribe(() => {
      this.router.navigateByUrl('');
    });
  }
}

import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import {
  Product,
  ProductResponse,
  ProductResponseCU,
} from '../interfaces/product';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url: string = 'http://localhost:3002/bp';

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<ProductResponse>(`${this.url}/products`).pipe(
      map((response) => response.data),
      delay(300)
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http
      .post<ProductResponseCU>(`${this.url}/products`, product)
      .pipe(map((response) => response.data));
  }

  editProduct(product: Product): Observable<Product> {
    return this.http
      .put<ProductResponseCU>(`${this.url}/products/${product.id}`, product)
      .pipe(map((response) => response.data));
  }

  deleteProduct(product: Product): Observable<string> {
    return this.http
      .delete<ProductResponseCU>(`${this.url}/products/${product.id}`)
      .pipe(map((response) => response.message!));
  }

  verifyIdExist(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/products/verification/${id}`);
  }
}

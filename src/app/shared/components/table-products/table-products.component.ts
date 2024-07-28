import { Component, EventEmitter, HostListener, Input, Output, SimpleChanges } from '@angular/core';
import { Product } from '../../../financial-products/interfaces/product';
import { Router } from '@angular/router';
import { ProductService } from '../../../financial-products/services/product.service';

@Component({
  selector: 'shared-table-products',
  templateUrl: './table-products.component.html',
  styleUrl: './table-products.component.css',
})
export class TableProductsComponent {
  @Input()
  public products: Product[] = [];
  @Input()
  public isLoading: boolean = true;
  @Output()
  public onDelete: EventEmitter<any> = new EventEmitter();


  public activeDropdown: string | null = null;
  public isDeleteModalVisible = false;
  public selectedProduct: Product | null = null;

  private itemsPerPage: number = 5;
  public paginatedProducts: Product[] = [];

  constructor(private router: Router, private readonly productService: ProductService){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      this.paginateProducts();
    }
  }

  private paginateProducts(): void {
    this.paginatedProducts = this.products.slice(0, this.itemsPerPage);
  }

  public onItemsPerPageChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(selectElement.value);
    this.paginateProducts();
  }

  toggleDropdown(productId: string) {
    this.activeDropdown = this.activeDropdown === productId ? null : productId;
  }

  editProduct(product: Product) {
    this.router.navigate(['/financial/edit-product', product.id]);
    this.activeDropdown = null;
  }

  deleteProduct(product: Product) {
    this.selectedProduct = product;
    this.isDeleteModalVisible = true;
    this.activeDropdown = null;
  }

  onDeleteConfirmed() {
    if (this.selectedProduct) {
      this.onDelete.emit(this.selectedProduct);
      this.selectedProduct = null;
    }
    this.isDeleteModalVisible = false;
  }

  onDeleteCanceled() {
    this.selectedProduct = null;
    this.isDeleteModalVisible = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target as Element).closest('.relative')) {
      this.activeDropdown = null;
    }
  }
}

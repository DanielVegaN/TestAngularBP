import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SearchBoxComponent } from './search-box.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { of } from 'rxjs';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const mockProducts: Product[] = [
    { id: '1', name: 'Product 1', description: 'Description 1', date_release: "2021-01-01", date_revision: "2021-01-01", logo: 'logo1.png' },
    { id: '2', name: 'Product 2', description: 'Description 2', date_release: "2021-01-01", date_revision: "2021-01-01", logo: 'logo2.png' },
    { id: '3', name: 'Other', description: 'Other description', date_release: "2021-01-01", date_revision: "2021-01-01", logo: 'logo3.png' },
  ];

  beforeEach(async () => {
    const spyService = jasmine.createSpyObj('ProductService', ['getProducts']);

    await TestBed.configureTestingModule({
      declarations: [SearchBoxComponent],
      providers: [{
        provide: ProductService, useValue: spyService
      }]
    })
    .compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));

    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter products based on search term', fakeAsync(() => {
    let filteredProducts: Product[] = [];
    component.productsSearched.subscribe(products => filteredProducts = products);

    component.searchProducts('Product');
    tick(100);

    expect(filteredProducts.length).toBe(2);
    expect(filteredProducts[0].name).toBe('Product 1');
    expect(filteredProducts[1].name).toBe('Product 2');
  }));

  it('should return all products when search term is empty', fakeAsync(() => {
    let filteredProducts: Product[] = [];
    component.productsSearched.subscribe(products => filteredProducts = products);

    component.searchProducts('');
    tick(100);

    expect(filteredProducts.length).toBe(3);
  }));

  it('should debounce search requests', fakeAsync(() => {
    let callCount = 0;
    component.productsSearched.subscribe(() => callCount++);

    component.searchProducts('a');
    component.searchProducts('ab');
    component.searchProducts('abc');
    tick(50);
    expect(callCount).toBe(0);
    tick(50);
    expect(callCount).toBe(1);
  }));
});

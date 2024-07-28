import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHomeComponent } from './table-home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    logo: 'url',
    date_release: "2021-01-01",
    date_revision: "2021-01-01",
    description: 'description',
  },
  {
    id: '2',
    name: 'Product 2',
    logo: 'url',
    date_release: "2021-01-01",
    date_revision: "2021-01-01",
    description: 'description',
  },
];

const bookServiceMock = {
  getProducts: () => of(mockProducts),
  deleteProduct: (product: Product) => of(null),
};

describe('TableHomeComponent', () => {
  let component: TableHomeComponent;
  let fixture: ComponentFixture<TableHomeComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TableHomeComponent],
      providers: [
        {
          provide: ProductService,
          useValue: bookServiceMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TableHomeComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getProducts should receive a list of products', () => {
    fixture.debugElement.injector.get(ProductService);
    component.getProducts();
    expect(component.products.length).toBe(2);
  });

  it('searchProduct should update products array', () => {
    const searchResults: Product[] = [
      {
        id: '3',
        name: 'Searched Product',
        logo: 'url',
        date_release: "2021-01-01",
        date_revision: "2021-01-01",
        description: 'description',
      },
    ];

    component.searchProduct(searchResults);

    expect(component.products).toEqual(searchResults);
    expect(component.products.length).toBe(1);
    expect(component.products[0].name).toBe('Searched Product');
  });

  it('should delete a product', () => {
    spyOn(productService, 'deleteProduct').and.callThrough();
    spyOn(component, 'getProducts').and.callThrough();

    const productToDelete = mockProducts[0];
    component.deleteProduct(productToDelete);

    expect(productService.deleteProduct).toHaveBeenCalledWith(productToDelete);
    expect(component.getProducts).toHaveBeenCalled();
  });
});

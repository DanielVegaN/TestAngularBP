import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProductComponent } from './add-product.component';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';
import { Product } from '../../interfaces/product';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['addProduct']);

    await TestBed.configureTestingModule({
      declarations: [AddProductComponent],
      providers: [{ provide: ProductService, useValue: spy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call productService.addProduct when onAddProduct is called', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      logo: 'test-logo.png',
      description: 'Test Description',
      date_release: '2023-05-15',
      date_revision: '2024-05-15',
    };

    productServiceSpy.addProduct.and.returnValue(of(mockProduct));

    component.onAddProduct(mockProduct);

    expect(productServiceSpy.addProduct).toHaveBeenCalledWith(mockProduct);
  });
});

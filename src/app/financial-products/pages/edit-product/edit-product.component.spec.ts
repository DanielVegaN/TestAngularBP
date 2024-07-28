import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EditProductComponent } from './edit-product.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

class MockProductService {
  getProducts() {
    return of([
      { id: '1', name: 'Product 1', logo: 'Logo 1', description: 'Description 1', date_release: '2020-01-01', date_revision: '2020-01-01' },
      { id: '2', name: 'Product 2', logo: 'Logo 2', description: 'Description 2', date_release: '2020-01-01', date_revision: '2020-01-01' },
    ]);
  }

  editProduct(product: Product) {
    return of(product);
  }
}

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let router: Router;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [EditProductComponent],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: jasmine.createSpy('navigateByUrl')
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch product on init', () => {
    component.ngOnInit();
    fixture.detectChanges();

    component.productUpdate$.subscribe(product => {
      expect(product).toEqual(jasmine.objectContaining({ id: '1' }));
    });
  });

  it('should navigate to home if product not found', () => {
    spyOn(productService, 'getProducts').and.returnValue(of([]));

    component.ngOnInit();
    fixture.detectChanges();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/financial/products');
  });

  it('should call editProduct on ProductService when editing a product', () => {
    spyOn(productService, 'editProduct').and.callThrough();
    const product = { id: '1', name: 'Product 1', logo: 'Logo 1', description: 'Description 1', date_release: '2020-01-01', date_revision: '2020-01-01' };

    component.onEditProduct(product);

    expect(productService.editProduct).toHaveBeenCalledWith(product);
    expect(router.navigateByUrl).toHaveBeenCalledWith('');
  });
});

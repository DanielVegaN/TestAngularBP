import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { TableProductsComponent } from './table-products.component';
import { ProductService } from '../../../financial-products/services/product.service';
import { Product } from '../../../financial-products/interfaces/product';

describe('TableProductsComponent', () => {
  let component: TableProductsComponent;
  let fixture: ComponentFixture<TableProductsComponent>;
  let router: jasmine.SpyObj<Router>;
  let productService: jasmine.SpyObj<ProductService>;

  const dummyProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      logo: 'logo1.png',
      description: 'Description 1',
      date_release: '2021-01-01',
      date_revision: '2022-01-01'
    },
    {
      id: '2',
      name: 'Product 2',
      logo: 'logo2.png',
      description: 'Description 2',
      date_release: '2021-02-01',
      date_revision: '2022-02-01'
    }
  ];

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['delete']);

    await TestBed.configureTestingModule({
      declarations: [TableProductsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ProductService, useValue: productServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;

    fixture = TestBed.createComponent(TableProductsComponent);
    component = fixture.componentInstance;
    component.products = dummyProducts;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should paginate products on changes', () => {
    const moreDummyProducts: Product[] = [
      ...dummyProducts,
      { id: '3', name: 'Product 3', logo: 'logo3.png', description: 'Description 3', date_release: '2021-03-01', date_revision: '2022-03-01' },
      { id: '4', name: 'Product 4', logo: 'logo4.png', description: 'Description 4', date_release: '2021-04-01', date_revision: '2022-04-01' },
      { id: '5', name: 'Product 5', logo: 'logo5.png', description: 'Description 5', date_release: '2021-05-01', date_revision: '2022-05-01' },
      { id: '6', name: 'Product 6', logo: 'logo6.png', description: 'Description 6', date_release: '2021-06-01', date_revision: '2022-06-01' }
    ];

    component.products = moreDummyProducts;
    component.ngOnChanges({
      products: {
        currentValue: moreDummyProducts,
        previousValue: dummyProducts,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.paginatedProducts.length).toBe(5);
  });

  it('should emit delete event when onDeleteConfirmed is called', () => {
    spyOn(component.onDelete, 'emit');
    component.selectedProduct = dummyProducts[0];
    component.onDeleteConfirmed();

    expect(component.onDelete.emit).toHaveBeenCalledWith(dummyProducts[0]);
    expect(component.selectedProduct).toBeNull();
    expect(component.isDeleteModalVisible).toBeFalse();
  });

  it('should navigate to edit product page when editProduct is called', () => {
    const product = dummyProducts[0];
    component.editProduct(product);

    expect(router.navigate).toHaveBeenCalledWith(['/financial/edit-product', product.id]);
    expect(component.activeDropdown).toBeNull();
  });

  it('should show delete modal when deleteProduct is called', () => {
    const product = dummyProducts[0];
    component.deleteProduct(product);

    expect(component.selectedProduct).toEqual(product);
    expect(component.isDeleteModalVisible).toBeTrue();
  });

  it('should close dropdown when clicking outside of dropdown', () => {
    component.activeDropdown = '1';

    const event = new MouseEvent('click');
    spyOnProperty(event, 'target', 'get').and.returnValue(document.createElement('div'));

    component.onDocumentClick(event);

    expect(component.activeDropdown).toBeNull();
  });

  it('should paginate products correctly when items per page is changed', () => {
    const event = {
      target: { value: '10' }
    } as unknown as Event;

    const privateItemsPerPage = 'itemsPerPage';
    (component as any)[privateItemsPerPage] = 10; // Accessing private property for the test
    component.onItemsPerPageChange(event);

    expect((component as any)[privateItemsPerPage]).toBe(10);
    expect(component.paginatedProducts.length).toBe(2); // Since we only have 2 products
  });

  it('should toggle dropdown correctly', () => {
    component.toggleDropdown('1');
    expect(component.activeDropdown).toBe('1');

    component.toggleDropdown('1');
    expect(component.activeDropdown).toBeNull();

    component.toggleDropdown('2');
    expect(component.activeDropdown).toBe('2');
  });

  it('should cancel delete correctly', () => {
    component.selectedProduct = dummyProducts[0];
    component.isDeleteModalVisible = true;

    component.onDeleteCanceled();

    expect(component.selectedProduct).toBeNull();
    expect(component.isDeleteModalVisible).toBeFalse();
  });
});
